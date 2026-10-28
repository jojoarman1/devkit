use std::{fs, path::PathBuf};

use serde::{Deserialize, Serialize};

// Built by hand instead of Tauri's app_config_dir(): the startup elevation check runs before the app exists.
// Must match "identifier" in tauri.conf.json.
const APP_IDENTIFIER: &str = "com.jojoa.devkit";
const SETTINGS_FILE: &str = "settings.json";

#[derive(Default, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Theme {
    #[default]
    System,
    Light,
    Dark,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Settings {
    pub run_as_admin: bool,
    pub minimize_to_tray: bool,
    pub theme: Theme,
    pub notify_high_memory: bool,
}

// Hand-written so fields missing from older files get their real defaults (serde `default` uses this)
impl Default for Settings {
    fn default() -> Self {
        Self {
            run_as_admin: false,
            minimize_to_tray: false,
            theme: Theme::default(),
            notify_high_memory: true,
        }
    }
}

fn settings_path() -> Option<PathBuf> {
    let config_dir = std::env::var_os("APPDATA")
        .map(PathBuf::from)
        .or_else(|| std::env::var_os("HOME").map(|home| PathBuf::from(home).join(".config")))?;
    Some(config_dir.join(APP_IDENTIFIER).join(SETTINGS_FILE))
}

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
pub fn get_settings() -> Settings {
    load()
}

#[tauri::command]
pub fn set_settings(settings: Settings) -> Result<(), String> {
    save(&settings)
}
