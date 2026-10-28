mod elevation;
mod icon;
mod memory_clean;
mod monitor;
mod settings;

// "Run as administrator on startup": checked before the builder, so the unelevated copy never shows a window.
// Skipped in debug builds: under `tauri dev` the CLI stops its dev server once this process exits.
// If the UAC prompt is cancelled, the app just starts without admin rights.
fn should_exit_for_elevation() -> bool {
    !cfg!(debug_assertions)
        && settings::load().run_as_admin
        && !elevation::is_elevated()
        && elevation::launch_elevated().is_ok()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    if should_exit_for_elevation() {
        return;
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            monitor::start(app.handle().clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            icon::get_app_icon,
            memory_clean::clean_memory,
            elevation::relaunch_as_admin,
            elevation::check_elevated,
            settings::get_run_as_admin,
            settings::set_run_as_admin
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
