use tauri::image::Image;

// 16 × 16 is the tray icon size at 100% scaling; drawing at that size keeps every dot on a pixel
const SIZE: usize = 16;
const CORNER_RADIUS: f32 = 3.5;
const CRITICAL_PERCENT: u8 = 90;

const TILE: [u8; 4] = [32, 32, 32, 255];
const TILE_CRITICAL: [u8; 4] = [196, 43, 28, 255];
const DOT: [u8; 4] = [255, 255, 255, 255];

// The app's 5×7 digit matrix (keep in sync with PIXEL_BITMAPS in src/constants/pixel-glyphs.constants.ts)
const DIGITS: [[&str; 7]; 10] = [
    [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
    ["..#..", ".##..", "#.#..", "..#..", "..#..", "..#..", "#####"],
    [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
    [".###.", "#...#", "....#", "..##.", "....#", "#...#", ".###."],
    ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
    ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
    ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
    ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
    [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
    [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
];
const DIGIT_WIDTH: usize = 5;
const DIGIT_HEIGHT: usize = 7;
const DIGIT_GAP: usize = 1;

fn is_inside_tile(x: usize, y: usize) -> bool {
    let distance_to_edge = |value: usize| {
        let center = value as f32 + 0.5;
        (CORNER_RADIUS - center).max(center - (SIZE as f32 - CORNER_RADIUS)).max(0.0)
    };
    let (dx, dy) = (distance_to_edge(x), distance_to_edge(y));
    dx * dx + dy * dy <= CORNER_RADIUS * CORNER_RADIUS
}

fn set_pixel(rgba: &mut [u8], x: usize, y: usize, color: [u8; 4]) {
    let offset = (y * SIZE + x) * 4;
    rgba[offset..offset + 4].copy_from_slice(&color);
}

// capped at 99: three 5×7 digits don't fit in 16 px
pub fn render_ram_icon(percent: u8) -> Image<'static> {
    let percent = percent.min(99);
    let mut rgba = vec![0u8; SIZE * SIZE * 4];
    let tile = if percent >= CRITICAL_PERCENT { TILE_CRITICAL } else { TILE };

    for y in 0..SIZE {
        for x in 0..SIZE {
            if is_inside_tile(x, y) {
                set_pixel(&mut rgba, x, y, tile);
            }
        }
    }

    let digits: Vec<usize> = percent.to_string().bytes().map(|byte| (byte - b'0') as usize).collect();
    let text_width = digits.len() * DIGIT_WIDTH + (digits.len() - 1) * DIGIT_GAP;
    let (left, top) = ((SIZE - text_width) / 2, (SIZE - DIGIT_HEIGHT) / 2);

    for (index, digit) in digits.iter().enumerate() {
        let digit_left = left + index * (DIGIT_WIDTH + DIGIT_GAP);
        for (row, line) in DIGITS[*digit].iter().enumerate() {
            for (column, cell) in line.bytes().enumerate() {
                if cell == b'#' {
                    set_pixel(&mut rgba, digit_left + column, top + row, DOT);
                }
            }
        }
    }

    Image::new_owned(rgba, SIZE as u32, SIZE as u32)
}
