use serde::Serialize;
use sysinfo::System;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryStats {
    total_bytes: u64,
    used_bytes: u64,
}

pub fn read(system: &mut System) -> MemoryStats {
    system.refresh_memory();
    MemoryStats {
        total_bytes: system.total_memory(),
        used_bytes: system.used_memory(),
    }
}
