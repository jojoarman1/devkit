use tauri::{plugin::TauriPlugin, Runtime};
use tauri_plugin_global_shortcut::ShortcutState;
use tauri_plugin_window_state::StateFlags;

use crate::tray;

pub const TOGGLE_SHORTCUT: &str = "CommandOrControl+Shift+D";

// Turns off the browser context menu and browser shortcuts (reload, print, find, downloads…).
// Debug builds keep reload and devtools so `tauri dev` stays usable.
pub fn prevent_browser_defaults<R: Runtime>() -> TauriPlugin<R> {
    use tauri_plugin_prevent_default::{Builder, Flags};

    let is_debug = cfg!(debug_assertions);
    let flags = if is_debug {
        Flags::all().difference(Flags::DEV_TOOLS | Flags::RELOAD)
    } else {
        Flags::all()
    };
    let builder = Builder::new().with_flags(flags);

    // WebView2 settings switch these off natively instead of relying on the injected script
    #[cfg(windows)]
    let builder = builder.platform(
        tauri_plugin_prevent_default::PlatformOptions::new()
            .default_context_menus(false)
            .browser_accelerator_keys(is_debug),
    );

    builder.build()
}

// Position only: the size is fixed, and visibility belongs to the tray/autostart logic
pub fn window_state<R: Runtime>() -> TauriPlugin<R> {
    tauri_plugin_window_state::Builder::new()
        .with_state_flags(StateFlags::POSITION)
        .build()
}

pub fn toggle_shortcut() -> TauriPlugin<tauri::Wry> {
    tauri_plugin_global_shortcut::Builder::new()
        .with_shortcuts([TOGGLE_SHORTCUT])
        .expect("TOGGLE_SHORTCUT is a valid accelerator")
        .with_handler(|app, _shortcut, event| {
            if event.state == ShortcutState::Pressed {
                tray::toggle_main_window(app);
            }
        })
        .build()
}
