use serde::Serialize;
use sysinfo::System;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CpuStats {
    usage_percent: f32,
}

#[derive(Default)]
pub struct CpuMonitor {
    #[cfg(windows)]
    previous: Option<windows_times::SystemTimes>,
}

impl CpuMonitor {
    // sysinfo's global usage on Windows comes from PDH counters, which read a constant 0
    // on machines with disabled or corrupted perf counters (this dev machine is one).
    // GetSystemTimes is what Task Manager relies on and always works.
    #[cfg(windows)]
    pub fn read(&mut self, _system: &mut System) -> CpuStats {
        let current = windows_times::read();
        let usage_percent = match (self.previous, current) {
            (Some(previous), Some(current)) => current.usage_since(&previous),
            _ => 0.0,
        };
        self.previous = current;
        CpuStats { usage_percent }
    }

    #[cfg(not(windows))]
    pub fn read(&mut self, system: &mut System) -> CpuStats {
        system.refresh_cpu_usage();
        CpuStats {
            usage_percent: system.global_cpu_usage(),
        }
    }
}

#[cfg(windows)]
mod windows_times {
    use windows_sys::Win32::{Foundation::FILETIME, System::Threading::GetSystemTimes};

    #[derive(Clone, Copy)]
    pub struct SystemTimes {
        idle: u64,
        kernel: u64,
        user: u64,
    }

    impl SystemTimes {
        pub fn usage_since(&self, previous: &Self) -> f32 {
            let idle = self.idle.saturating_sub(previous.idle);
            // kernel time already includes idle time
            let total = self.kernel.saturating_sub(previous.kernel) + self.user.saturating_sub(previous.user);
            if total == 0 {
                return 0.0;
            }
            (total.saturating_sub(idle) as f64 / total as f64 * 100.0) as f32
        }
    }

    const fn to_ticks(time: FILETIME) -> u64 {
        ((time.dwHighDateTime as u64) << 32) | time.dwLowDateTime as u64
    }

    pub fn read() -> Option<SystemTimes> {
        let empty = FILETIME {
            dwLowDateTime: 0,
            dwHighDateTime: 0,
        };
        let (mut idle, mut kernel, mut user) = (empty, empty, empty);
        // SAFETY: all three pointers reference valid, writable FILETIME values on the stack
        let is_ok = unsafe { GetSystemTimes(&mut idle, &mut kernel, &mut user) } != 0;
        is_ok.then(|| SystemTimes {
            idle: to_ticks(idle),
            kernel: to_ticks(kernel),
            user: to_ticks(user),
        })
    }
}
