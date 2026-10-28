mod cpu;
mod disk;
mod gpu;
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
    gpu: gpu::GpuMonitor,
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
            gpu: gpu::GpuMonitor::new(),
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
            temperature: temperature::read(&mut self.components, self.gpu.temperature()),
            processes: process::read(&mut self.system),
            uptime_seconds: System::uptime(),
        }
    }
}

pub fn start(app: AppHandle) {
    thread::spawn(move || {
        let mut monitor = Monitor::new();
        let mut tray_percent = None;
        let mut memory_alert = crate::memory_alert::MemoryAlert::default();

        loop {
            thread::sleep(REFRESH_INTERVAL);
            let stats = monitor.read();

            // rebuilding the tray icon is a native call, so only do it when the number changes
            let percent = stats.memory.usage_percent();
            if tray_percent != Some(percent) {
                crate::tray::update_ram(&app, percent);
                tray_percent = Some(percent);
            }
            memory_alert.update(&app, percent);

            if app.emit(SYSTEM_STATS_EVENT, stats).is_err() {
                break;
            }
        }
    });
}
