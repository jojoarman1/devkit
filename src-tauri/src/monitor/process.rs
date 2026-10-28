use std::collections::HashMap;

use serde::Serialize;
use sysinfo::{ProcessRefreshKind, ProcessesToUpdate, System, UpdateKind};

const TOP_PROCESS_COUNT: usize = 3;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcessStats {
    name: String,
    cpu_percent: f32,
    memory_bytes: u64,
    // None for protected system processes: Windows denies their path without admin rights
    exe_path: Option<String>,
}

// Processes are grouped by name: a browser or `node` runs as dozens of processes
// and is only meaningful as a total.
pub fn read(system: &mut System) -> Vec<ProcessStats> {
    system.refresh_processes_specifics(
        ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::nothing()
            .with_cpu()
            .with_memory()
            .with_exe(UpdateKind::OnlyIfNotSet),
    );
    // logical cores; system.cpus() stays empty on Windows because CPU usage bypasses sysinfo there
    let core_count = std::thread::available_parallelism().map_or(1, |count| count.get()) as f32;
    let mut by_name: HashMap<String, ProcessStats> = HashMap::new();

    for process in system.processes().values() {
        // pid 0 is Windows' "System Idle Process": its CPU share is idle time
        if process.pid().as_u32() == 0 {
            continue;
        }
        let name = process.name().to_string_lossy();
        let name = name.strip_suffix(".exe").unwrap_or(&name).to_string();
        let entry = by_name.entry(name.clone()).or_insert(ProcessStats {
            name,
            cpu_percent: 0.0,
            memory_bytes: 0,
            exe_path: None,
        });
        // sysinfo reports usage per core, so a busy multi-threaded process can exceed 100%
        entry.cpu_percent += process.cpu_usage() / core_count;
        entry.memory_bytes += process.memory();
        if entry.exe_path.is_none() {
            entry.exe_path = process.exe().map(|path| path.to_string_lossy().into_owned());
        }
    }

    let mut top: Vec<ProcessStats> = by_name.into_values().collect();
    top.sort_by(|a, b| {
        b.cpu_percent
            .total_cmp(&a.cpu_percent)
            .then(b.memory_bytes.cmp(&a.memory_bytes))
    });
    top.truncate(TOP_PROCESS_COUNT);
    top
}
