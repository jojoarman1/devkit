// The elevated copy starts while this one is still alive. It gets our pid and waits for us to exit
// before Tauri starts, otherwise the single-instance plugin would treat it as a duplicate and close it.
const WAIT_FOR_PID_ARG: &str = "--wait-for-pid=";
const PREVIOUS_INSTANCE_TIMEOUT_MS: u32 = 5000;

#[cfg(windows)]
mod platform {
    use std::{iter, os::windows::ffi::OsStrExt, ptr};

    use windows_sys::Win32::{
        Foundation::{CloseHandle, HANDLE},
        Security::{GetTokenInformation, TokenElevation, TOKEN_ELEVATION, TOKEN_QUERY},
        System::Threading::{
            GetCurrentProcess, OpenProcess, OpenProcessToken, WaitForSingleObject, PROCESS_SYNCHRONIZE,
        },
        UI::{Shell::ShellExecuteW, WindowsAndMessaging::SW_SHOWNORMAL},
    };

    use super::{PREVIOUS_INSTANCE_TIMEOUT_MS, WAIT_FOR_PID_ARG};

    pub fn to_wide(value: impl AsRef<std::ffi::OsStr>) -> Vec<u16> {
        value.as_ref().encode_wide().chain(iter::once(0)).collect()
    }

    pub fn is_elevated() -> bool {
        // SAFETY: the token handle is opened, read and closed here; all pointers reference locals
        unsafe {
            let mut token: HANDLE = ptr::null_mut();
            if OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &mut token) == 0 {
                return false;
            }
            let mut elevation = TOKEN_ELEVATION { TokenIsElevated: 0 };
            let mut length = 0;
            let is_read = GetTokenInformation(
                token,
                TokenElevation,
                (&mut elevation as *mut TOKEN_ELEVATION).cast(),
                size_of::<TOKEN_ELEVATION>() as u32,
                &mut length,
            ) != 0;
            CloseHandle(token);
            is_read && elevation.TokenIsElevated != 0
        }
    }

    // "runas" shows the UAC prompt; ShellExecuteW returns a value > 32 on success.
    // Our own arguments are forwarded, so an autostart launch (--minimized) stays in the tray once elevated.
    pub fn launch_elevated() -> Result<(), String> {
        let exe = std::env::current_exe().map_err(|error| error.to_string())?;
        let arguments = std::env::args()
            .skip(1)
            .filter(|arg| !arg.starts_with(WAIT_FOR_PID_ARG))
            .chain(iter::once(format!("{WAIT_FOR_PID_ARG}{}", std::process::id())))
            .collect::<Vec<_>>()
            .join(" ");
        let (verb, file, parameters) = (to_wide("runas"), to_wide(exe), to_wide(arguments));
        // SAFETY: all strings are NUL-terminated UTF-16 buffers that outlive the call
        let result = unsafe {
            ShellExecuteW(
                ptr::null_mut(),
                verb.as_ptr(),
                file.as_ptr(),
                parameters.as_ptr(),
                ptr::null(),
                SW_SHOWNORMAL,
            )
        };
        if result as isize > 32 {
            Ok(())
        } else {
            Err("elevation was cancelled or failed".into())
        }
    }

    pub fn wait_for_process_exit(pid: u32) {
        // SAFETY: the handle is only used for waiting and closed right after
        unsafe {
            let process = OpenProcess(PROCESS_SYNCHRONIZE, 0, pid);
            if process.is_null() {
                return;
            }
            WaitForSingleObject(process, PREVIOUS_INSTANCE_TIMEOUT_MS);
            CloseHandle(process);
        }
    }
}

#[cfg(windows)]
pub use platform::{is_elevated, launch_elevated, to_wide};

#[cfg(not(windows))]
pub fn is_elevated() -> bool {
    false
}

#[cfg(not(windows))]
pub fn launch_elevated() -> Result<(), String> {
    Err("relaunching as admin is only supported on Windows".into())
}

pub fn wait_for_previous_instance() {
    let pid = std::env::args().find_map(|arg| arg.strip_prefix(WAIT_FOR_PID_ARG)?.parse::<u32>().ok());
    #[cfg(windows)]
    if let Some(pid) = pid {
        platform::wait_for_process_exit(pid);
    }
    #[cfg(not(windows))]
    let _ = pid;
}

#[tauri::command]
pub fn relaunch_as_admin(app: tauri::AppHandle) -> Result<(), String> {
    launch_elevated()?;
    app.exit(0);
    Ok(())
}

#[tauri::command]
pub fn check_elevated() -> bool {
    is_elevated()
}
