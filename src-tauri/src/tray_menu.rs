use tauri::{
    menu::{IconMenuItem, Menu, MenuEvent, MenuItem, PredefinedMenuItem},
    App, AppHandle, Emitter, Manager, Wry,
};

use crate::{elevation, memory_clean, notify, tray, tray_icon, START_MINIMIZED_ARG};

const RAM_ITEM_ID: &str = "ram";
const FREE_MEMORY_ITEM_ID: &str = "free-memory";
const SHOW_ITEM_ID: &str = "show";
const SETTINGS_ITEM_ID: &str = "settings";
const QUIT_ITEM_ID: &str = "quit";

// Passed to the elevated copy that "Free memory" starts, so it cleans as soon as it's up
pub const CLEAN_MEMORY_ARG: &str = "--clean-memory";
// must match OPEN_SETTINGS_EVENT in src/constants/tray.constants.ts
const OPEN_SETTINGS_EVENT: &str = "open-settings";

const BYTES_PER_MB: f64 = 1024.0 * 1024.0;
const BYTES_PER_GB: f64 = BYTES_PER_MB * 1024.0;

// Kept so the disabled "RAM 43%" line can be retitled along with the tray icon
struct RamItem(MenuItem<Wry>);

pub fn build(app: &App) -> tauri::Result<Menu<Wry>> {
    let ram = MenuItem::with_id(app, RAM_ITEM_ID, "RAM", false, None::<&str>)?;
    let shield = (!elevation::is_elevated()).then(tray_icon::render_shield_icon);
    let free_memory = IconMenuItem::with_id(app, FREE_MEMORY_ITEM_ID, "Free memory", true, shield, None::<&str>)?;
    let show = MenuItem::with_id(app, SHOW_ITEM_ID, "Show devkit", true, None::<&str>)?;
    let settings = MenuItem::with_id(app, SETTINGS_ITEM_ID, "Settings…", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, QUIT_ITEM_ID, "Quit", true, None::<&str>)?;

    let menu = Menu::with_items(
        app,
        &[
            &ram,
            &free_memory,
            &PredefinedMenuItem::separator(app)?,
            &show,
            &settings,
            &PredefinedMenuItem::separator(app)?,
            &quit,
        ],
    )?;
    app.manage(RamItem(ram));
    Ok(menu)
}

pub fn handle_event(app: &AppHandle, event: MenuEvent) {
    match event.id.as_ref() {
        FREE_MEMORY_ITEM_ID => free_memory(app),
        SHOW_ITEM_ID => tray::show_main_window(app),
        SETTINGS_ITEM_ID => {
            tray::show_main_window(app);
            if let Err(error) = app.emit(OPEN_SETTINGS_EVENT, ()) {
                log::warn!("opening settings from the tray failed: {error}");
            }
        }
        QUIT_ITEM_ID => app.exit(0),
        _ => {}
    }
}

pub fn set_ram_percent(app: &AppHandle, percent: u8) {
    if let Some(item) = app.try_state::<RamItem>() {
        let _ = item.0.set_text(format!("RAM {percent}%"));
    }
}

// A menu click can't wait for UAC, so an unelevated copy relaunches as admin with CLEAN_MEMORY_ARG
// and the elevated copy cleans on start (see lib.rs)
pub fn free_memory(app: &AppHandle) {
    if elevation::is_elevated() {
        let app = app.clone();
        std::thread::spawn(move || notify_clean_result(&app, memory_clean::clean()));
        return;
    }
    // under `tauri dev` a relaunch opens the debug exe's console and loses the dev server (see MemoryCleanButton)
    if cfg!(debug_assertions) {
        notify::show(app, "Free memory needs admin rights", "Run the dev terminal as administrator.");
        return;
    }
    match elevation::launch_elevated(&[START_MINIMIZED_ARG, CLEAN_MEMORY_ARG]) {
        Ok(()) => app.exit(0),
        Err(error) => log::info!("free memory from the tray: {error}"),
    }
}

fn notify_clean_result(app: &AppHandle, result: Result<u64, memory_clean::CleanError>) {
    match result {
        Ok(freed) => notify::show(app, "Memory freed", &format!("devkit freed {}.", format_freed(freed))),
        Err(_) => notify::show(app, "Couldn't free memory", "Windows refused the request. Details are in devkit.log."),
    }
}

fn format_freed(bytes: u64) -> String {
    let bytes = bytes as f64;
    if bytes >= BYTES_PER_GB {
        format!("{:.1} GB", bytes / BYTES_PER_GB)
    } else {
        format!("{:.0} MB", bytes / BYTES_PER_MB)
    }
}
