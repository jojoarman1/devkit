use std::{fs, path::PathBuf};

use serde::{Deserialize, Serialize};

// Same folder Tauri's app_config_dir() resolves to. It is built by hand because the startup
// elevation check runs before the Tauri app (and its path resolver) exists.
// Must match "identifier" in tauri.conf.json.
const APP_IDENTIFIER: &str = "com.jojoa.devkit";
const SETTINGS_FILE: &str = "settings.json";

#[derive(Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Settings {
    pub run_as_admin: bool,
}

fn settings_path() -> Option<PathBuf> {
    let config_dir = std::env::var_os("APPDATA")
        .map(PathBuf::from)
        .or_else(|| std::env::var_os("HOME").map(|home| PathBuf::from(home).join(".config")))?;
    Some(config_dir.join(APP_IDENTIFIER).join(SETTINGS_FILE))
}

// A missing or broken file just means defaults
pub fn load() -> Settings {
    settings_path()
        .and_then(|path| fs::read_to_string(path).ok())
        .and_then(|json| serde_json::from_str(&json).ok())
        .unwrap_or_default()
}

fn save(settings: &Settings) -> Result<(), String> {
    let path = settings_path().ok_or("no config directory")?;
    if let Some(dir) = path.parent() {
        fs::create_dir_all(dir).map_err(|error| error.to_string())?;
    }
    let json = serde_json::to_string_pretty(settings).map_err(|error| error.to_string())?;
    fs::write(path, json).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn get_run_as_admin() -> bool {
    load().run_as_admin
}

#[tauri::command]
pub fn set_run_as_admin(is_enabled: bool) -> Result<(), String> {
    let mut settings = load();
    settings.run_as_admin = is_enabled;
    save(&settings)
}
