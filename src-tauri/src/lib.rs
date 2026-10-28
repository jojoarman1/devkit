mod elevation;
mod icon;
mod memory_clean;
mod monitor;
mod settings;
mod tray;
mod tray_icon;

// Runs before the builder, so the unelevated copy never shows a window. Skipped in debug builds:
// under `tauri dev` the CLI stops its dev server once this process exits. A cancelled UAC prompt
// just starts the app without admin rights.
fn should_exit_for_elevation() -> bool {
    !cfg!(debug_assertions)
        && settings::load().run_as_admin
        && !elevation::is_elevated()
        && elevation::launch_elevated().is_ok()
}

// Turns off the browser context menu and browser shortcuts (reload, print, find, downloads…).
// Debug builds keep reload and devtools so `tauri dev` stays usable.
fn prevent_browser_defaults<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    if should_exit_for_elevation() {
        return;
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(prevent_browser_defaults())
        .setup(|app| {
            tray::create(app)?;
            monitor::start(app.handle().clone());
            Ok(())
        })
        // With "minimize to tray" on, closing (X, Alt+F4) also just hides; the tray's Quit uses app.exit(),
        // which doesn't go through CloseRequested
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event
                && settings::load().minimize_to_tray
            {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .invoke_handler(tauri::generate_handler![
            icon::get_app_icon,
            memory_clean::clean_memory,
            elevation::relaunch_as_admin,
            elevation::check_elevated,
            settings::get_settings,
            settings::set_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
