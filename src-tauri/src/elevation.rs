#[cfg(windows)]
mod platform {
    use std::{iter, os::windows::ffi::OsStrExt, ptr};

    use windows_sys::Win32::{
        Foundation::{CloseHandle, HANDLE},
        Security::{GetTokenInformation, TokenElevation, TOKEN_ELEVATION, TOKEN_QUERY},
        System::Threading::{GetCurrentProcess, OpenProcessToken},
        UI::{Shell::ShellExecuteW, WindowsAndMessaging::SW_SHOWNORMAL},
    };

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

    // "runas" shows the UAC prompt; ShellExecuteW returns a value > 32 on success
    pub fn launch_elevated() -> Result<(), String> {
        let exe = std::env::current_exe().map_err(|error| error.to_string())?;
        let (verb, file) = (to_wide("runas"), to_wide(exe));
        // SAFETY: both strings are NUL-terminated UTF-16 buffers that outlive the call
        let result = unsafe {
            ShellExecuteW(ptr::null_mut(), verb.as_ptr(), file.as_ptr(), ptr::null(), ptr::null(), SW_SHOWNORMAL)
        };
        if result as isize > 32 {
            Ok(())
        } else {
            Err("elevation was cancelled or failed".into())
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
