mod elevation;
mod icon;
mod memory_alert;
mod memory_clean;
mod monitor;
mod plugins;
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

// Passed by the "Start with Windows" entry: launch straight into the tray
const START_MINIMIZED_ARG: &str = "--minimized";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    elevation::wait_for_previous_instance();
    if should_exit_for_elevation() {
        return;
    }

    tauri::Builder::default()
        // must be registered first: a second launch just brings the running window forward
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            tray::show_main_window(app);
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(plugins::prevent_browser_defaults())
        .plugin(plugins::window_state())
        .plugin(tauri_plugin_autostart::Builder::new().arg(START_MINIMIZED_ARG).build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            tray::create(app)?;
            // a shortcut already taken by another app must not stop devkit from starting
            if let Err(error) = app.handle().plugin(plugins::toggle_shortcut()) {
                eprintln!("{} is unavailable: {error}", plugins::TOGGLE_SHORTCUT);
            }
            monitor::start(app.handle().clone());
            // the window starts hidden ("visible": false) so an autostart launch never flashes it
            if !std::env::args().any(|arg| arg == START_MINIMIZED_ARG) {
                tray::show_main_window(app.handle());
            }
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
