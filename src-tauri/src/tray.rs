use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App, AppHandle, Manager,
};

use crate::tray_icon::render_ram_icon;

const TRAY_ID: &str = "main";
const SHOW_ITEM_ID: &str = "show";
const QUIT_ITEM_ID: &str = "quit";

pub fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

pub fn create(app: &App) -> tauri::Result<()> {
    let show = MenuItem::with_id(app, SHOW_ITEM_ID, "Show devkit", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, QUIT_ITEM_ID, "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &quit])?;

    TrayIconBuilder::with_id(TRAY_ID)
        .icon(render_ram_icon(0))
        .tooltip("devkit")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            SHOW_ITEM_ID => show_main_window(app),
            QUIT_ITEM_ID => app.exit(0),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                show_main_window(tray.app_handle());
            }
        })
        .build(app)?;
    Ok(())
}

pub fn update_ram(app: &AppHandle, percent: u8) {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        let _ = tray.set_icon(Some(render_ram_icon(percent)));
        let _ = tray.set_tooltip(Some(format!("devkit: RAM {percent}%")));
    }
}
