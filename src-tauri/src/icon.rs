use base64::{engine::general_purpose::STANDARD, Engine};
use file_icon_provider::Icon;

// requested from the shell at this size; the frontend shows it smaller, so it stays sharp on HiDPI
const ICON_SIZE: u16 = 64;

fn encode_png(icon: &Icon) -> Result<Vec<u8>, png::EncodingError> {
    let mut bytes = Vec::new();
    let mut encoder = png::Encoder::new(&mut bytes, icon.width, icon.height);
    encoder.set_color(png::ColorType::Rgba);
    encoder.set_depth(png::BitDepth::Eight);

    let mut writer = encoder.write_header()?;
    writer.write_image_data(&icon.pixels)?;
    writer.finish()?;
    Ok(bytes)
}

fn read_icon_data_url(path: &str) -> Result<String, String> {
    let icon = file_icon_provider::get_file_icon(path, ICON_SIZE).map_err(|error| error.to_string())?;
    let png = encode_png(&icon).map_err(|error| error.to_string())?;
    Ok(format!("data:image/png;base64,{}", STANDARD.encode(png)))
}

// The icon an executable shows in Explorer, as a PNG data URL. The frontend caches results per path.
#[tauri::command]
pub async fn get_app_icon(path: String) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || read_icon_data_url(&path))
        .await
        .map_err(|error| error.to_string())?
}
