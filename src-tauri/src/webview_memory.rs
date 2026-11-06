use tauri::WebviewWindow;

// WebView2 trims its caches and pages out the renderer under the Low target. devkit spends most of its
// life hidden in the tray, so this is where most of its memory goes back to the system.
#[cfg(windows)]
pub fn set_low(window: &WebviewWindow, is_low: bool) {
    use webview2_com::Microsoft::Web::WebView2::Win32::{
        COREWEBVIEW2_MEMORY_USAGE_TARGET_LEVEL_LOW, COREWEBVIEW2_MEMORY_USAGE_TARGET_LEVEL_NORMAL,
        ICoreWebView2_19,
    };
    use windows::core::Interface;

    let level = if is_low {
        COREWEBVIEW2_MEMORY_USAGE_TARGET_LEVEL_LOW
    } else {
        COREWEBVIEW2_MEMORY_USAGE_TARGET_LEVEL_NORMAL
    };
    let _ = window.with_webview(move |webview| unsafe {
        // ICoreWebView2_19 needs WebView2 Runtime 114+; older runtimes just keep the default level
        if let Ok(core) = webview.controller().CoreWebView2()
            && let Ok(core) = core.cast::<ICoreWebView2_19>()
        {
            let _ = core.SetMemoryUsageTargetLevel(level);
        }
    });
}

#[cfg(not(windows))]
pub fn set_low(_window: &WebviewWindow, _is_low: bool) {}
