use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

const ALERT_PERCENT: u8 = 90;
// Re-arms only after usage drops clearly below the alert, so hovering around 90% doesn't spam
const REARM_PERCENT: u8 = 85;

#[derive(Default)]
pub struct MemoryAlert {
    has_fired: bool,
}

impl MemoryAlert {
    pub fn update(&mut self, app: &AppHandle, percent: u8) {
        if percent < REARM_PERCENT {
            self.has_fired = false;
            return;
        }
        if percent < ALERT_PERCENT || self.has_fired {
            return;
        }
        self.has_fired = true;

        // read only on the rare crossing, not every tick
        if !crate::settings::load().notify_high_memory {
            return;
        }
        let _ = app
            .notification()
            .builder()
            .title("RAM is almost full")
            .body(format!("Memory usage is {percent}%. You can free some from the RAM card in devkit."))
            .show();
    }
}
