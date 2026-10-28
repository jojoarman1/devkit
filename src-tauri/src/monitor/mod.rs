mod cpu;
mod disk;
mod memory;
mod network;
mod process;
mod temperature;

use std::{
    thread,
    time::{Duration, Instant},
};

use serde::Serialize;
use sysinfo::{Components, Disks, Networks, System};
use tauri::{AppHandle, Emitter};

const SYSTEM_STATS_EVENT: &str = "system-stats";
const REFRESH_INTERVAL: Duration = Duration::from_secs(1);

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct SystemStats {
    cpu: cpu::CpuStats,
    memory: memory::MemoryStats,
    network: network::NetworkStats,
    disks: Vec<disk::DiskStats>,
    temperature: temperature::TemperatureStats,
    processes: Vec<process::ProcessStats>,
    uptime_seconds: u64,
}

struct Monitor {
    system: System,
    cpu: cpu::CpuMonitor,
    networks: Networks,
    disks: Disks,
    components: Components,
    last_tick: Instant,
}

impl Monitor {
    fn new() -> Self {
        let mut monitor = Self {
            system: System::new(),
            cpu: cpu::CpuMonitor::default(),
            networks: Networks::new_with_refreshed_list(),
            disks: Disks::new_with_refreshed_list(),
            components: Components::new_with_refreshed_list(),
            last_tick: Instant::now(),
        };
        // CPU usage (global and per process) is a delta between two reads, so take a baseline
        monitor.cpu.read(&mut monitor.system);
        process::read(&mut monitor.system);
        monitor
    }

    fn read(&mut self) -> SystemStats {
        let elapsed = self.last_tick.elapsed();
        self.last_tick = Instant::now();

        SystemStats {
            cpu: self.cpu.read(&mut self.system),
            memory: memory::read(&mut self.system),
            network: network::read(&mut self.networks, elapsed),
            disks: disk::read(&mut self.disks),
            temperature: temperature::read(&mut self.components),
            processes: process::read(&mut self.system),
            uptime_seconds: System::uptime(),
        }
    }
}

pub fn start(app: AppHandle) {
    thread::spawn(move || {
        let mut monitor = Monitor::new();

        loop {
            thread::sleep(REFRESH_INTERVAL);
            if app.emit(SYSTEM_STATS_EVENT, monitor.read()).is_err() {
                break;
            }
        }
    });
}
