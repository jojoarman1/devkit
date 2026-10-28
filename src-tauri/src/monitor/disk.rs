use serde::Serialize;
use sysinfo::Disks;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiskStats {
    name: String,
    mount_point: String,
    total_bytes: u64,
    available_bytes: u64,
    is_system: bool,
}

// Windows installs the OS on %SystemDrive% (usually C:), other platforms on the root
fn system_mount_point() -> String {
    std::env::var("SystemDrive")
        .map(|drive| format!("{drive}\\"))
        .unwrap_or_else(|_| "/".into())
}

pub fn read(disks: &mut Disks) -> Vec<DiskStats> {
    disks.refresh(true);
    let system_mount_point = system_mount_point();

    disks
        .list()
        .iter()
        .map(|disk| {
            let mount_point = disk.mount_point().to_string_lossy().into_owned();
            DiskStats {
                name: disk.name().to_string_lossy().into_owned(),
                is_system: mount_point.eq_ignore_ascii_case(&system_mount_point),
                mount_point,
                total_bytes: disk.total_space(),
                available_bytes: disk.available_space(),
            }
        })
        .collect()
}
