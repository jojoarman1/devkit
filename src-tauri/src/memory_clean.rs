use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum CleanError {
    AdminRequired,
    #[cfg_attr(windows, allow(dead_code))] // only built by the non-Windows stub
    Unsupported,
    Failed { message: String },
}

fn available_bytes() -> u64 {
    let mut system = sysinfo::System::new();
    system.refresh_memory();
    system.available_memory()
}

#[tauri::command]
pub async fn clean_memory() -> Result<u64, CleanError> {
    tauri::async_runtime::spawn_blocking(platform::clean)
        .await
        .map_err(|error| CleanError::Failed {
            message: error.to_string(),
        })?
}

#[cfg(windows)]
mod platform {
    use std::{ffi::c_void, ptr};

    use windows_sys::Win32::{
        Foundation::{CloseHandle, GetLastError, ERROR_NOT_ALL_ASSIGNED, HANDLE, LUID},
        Security::{
            AdjustTokenPrivileges, LookupPrivilegeValueW, LUID_AND_ATTRIBUTES, SE_PRIVILEGE_ENABLED,
            TOKEN_ADJUST_PRIVILEGES, TOKEN_PRIVILEGES, TOKEN_QUERY,
        },
        System::Threading::{GetCurrentProcess, OpenProcessToken},
    };

    use super::{available_bytes, CleanError};
    use crate::elevation::is_elevated;

    // Undocumented ntdll call (what Mem Reduct uses); windows-sys doesn't expose it
    #[link(name = "ntdll")]
    unsafe extern "system" {
        fn NtSetSystemInformation(class: i32, information: *const c_void, length: u32) -> i32;
    }

    const SYSTEM_MEMORY_LIST_INFORMATION: i32 = 80;
    const MEMORY_EMPTY_WORKING_SETS: i32 = 2;
    const MEMORY_PURGE_LOW_PRIORITY_STANDBY_LIST: i32 = 5;

    // Working sets move to the standby list first, then only its low-priority pages are dropped.
    // A full standby purge would throw away the whole file cache and make apps reread from disk.
    const COMMANDS: [i32; 2] = [MEMORY_EMPTY_WORKING_SETS, MEMORY_PURGE_LOW_PRIORITY_STANDBY_LIST];

    // Both are held by admins but disabled by default; the memory-list calls fail without them
    const PRIVILEGES: [&str; 2] = ["SeProfileSingleProcessPrivilege", "SeIncreaseQuotaPrivilege"];

    fn enable_privilege(token: HANDLE, name: &str) -> bool {
        let wide = crate::elevation::to_wide(name);
        let mut luid = LUID { LowPart: 0, HighPart: 0 };
        // SAFETY: `wide` is NUL-terminated and `luid`/`privileges` are valid locals for the calls
        unsafe {
            if LookupPrivilegeValueW(ptr::null(), wide.as_ptr(), &mut luid) == 0 {
                return false;
            }
            let privileges = TOKEN_PRIVILEGES {
                PrivilegeCount: 1,
                Privileges: [LUID_AND_ATTRIBUTES {
                    Luid: luid,
                    Attributes: SE_PRIVILEGE_ENABLED,
                }],
            };
            // AdjustTokenPrivileges "succeeds" even when the privilege isn't held; only GetLastError tells
            AdjustTokenPrivileges(token, 0, &privileges, 0, ptr::null_mut(), ptr::null_mut()) != 0
                && GetLastError() != ERROR_NOT_ALL_ASSIGNED
        }
    }

    fn enable_privileges() -> Result<(), CleanError> {
        let mut token: HANDLE = ptr::null_mut();
        // SAFETY: the token is opened for this process and closed below
        if unsafe { OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &mut token) } == 0 {
            return Err(CleanError::AdminRequired);
        }
        let is_enabled = PRIVILEGES.iter().all(|name| enable_privilege(token, name));
        // SAFETY: `token` was opened above
        unsafe { CloseHandle(token) };
        if is_enabled { Ok(()) } else { Err(CleanError::AdminRequired) }
    }

    pub fn clean() -> Result<u64, CleanError> {
        if !is_elevated() {
            return Err(CleanError::AdminRequired);
        }
        enable_privileges()?;
        let before = available_bytes();

        for command in COMMANDS {
            // SAFETY: the information buffer is a single i32 command, as the API expects
            let status = unsafe {
                NtSetSystemInformation(
                    SYSTEM_MEMORY_LIST_INFORMATION,
                    (&command as *const i32).cast(),
                    size_of::<i32>() as u32,
                )
            };
            if status < 0 {
                return Err(CleanError::Failed {
                    message: format!("memory list command {command} failed with NTSTATUS 0x{:08X}", status as u32),
                });
            }
        }

        Ok(available_bytes().saturating_sub(before))
    }
}

#[cfg(not(windows))]
mod platform {
    use super::CleanError;

    pub fn clean() -> Result<u64, CleanError> {
        Err(CleanError::Unsupported)
    }
}
