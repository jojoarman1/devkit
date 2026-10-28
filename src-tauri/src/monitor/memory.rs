use serde::Serialize;
use sysinfo::System;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryStats {
    total_bytes: u64,
    used_bytes: u64,
}

impl MemoryStats {
    // Same rounding as getUsagePercent on the frontend, so the tray and the RAM card agree
    pub fn usage_percent(&self) -> u8 {
        if self.total_bytes == 0 {
            return 0;
        }
        (self.used_bytes as f64 / self.total_bytes as f64 * 100.0).round() as u8
    }
}

pub fn read(system: &mut System) -> MemoryStats {
    system.refresh_memory();
    MemoryStats {
        total_bytes: system.total_memory(),
        used_bytes: system.used_memory(),
    }
}
