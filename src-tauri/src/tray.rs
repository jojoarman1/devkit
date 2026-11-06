use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App, AppHandle, Manager,
};

use crate::{tray_icon::render_ram_icon, tray_menu, webview_memory};

const TRAY_ID: &str = "main";

pub fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        webview_memory::set_low(&window, false);
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

pub fn hide_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.hide();
        webview_memory::set_low(&window, true);
    }
}

// The webview only has something to render while the window is on screen
pub fn is_main_window_on_screen(app: &AppHandle) -> bool {
    app.get_webview_window("main").is_some_and(|window| {
        window.is_visible().unwrap_or(false) && !window.is_minimized().unwrap_or(false)
    })
}

#[tauri::command]
pub fn hide_to_tray(app: AppHandle) {
    hide_main_window(&app);
}

// Global shortcut: hide when devkit is in front, otherwise bring it forward
pub fn toggle_main_window(app: &AppHandle) {
    let Some(window) = app.get_webview_window("main") else {
        return;
    };
    let is_in_front = window.is_visible().unwrap_or(false)
        && !window.is_minimized().unwrap_or(false)
        && window.is_focused().unwrap_or(false);
    if is_in_front {
        hide_main_window(app);
    } else {
        show_main_window(app);
    }
}

pub fn create(app: &App) -> tauri::Result<()> {
    let menu = tray_menu::build(app)?;

    TrayIconBuilder::with_id(TRAY_ID)
        .icon(render_ram_icon(0))
        .tooltip("devkit")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(tray_menu::handle_event)
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
    tray_menu::set_ram_percent(app, percent);
}
