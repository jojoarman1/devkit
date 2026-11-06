# Changelog

Each `## <version>` section becomes the release notes: the update dialog in devkit and the GitHub release
both show its bullet points. Keep one short line per change, written for the user.

## 0.2.3

- Mini charts on the metric cards: CPU and network over the last minute, disk and temperature gauges, uptime over the last day.
- The update dialog lists what's new before you install.
- New tray menu: current RAM usage, Free memory right from the tray, and a shortcut to Settings.
- Errors are written to a log file (%LOCALAPPDATA%\com.jojoa.devkit\logs\devkit.log) to help with bug reports.

## 0.2.2

- Much lower memory use while devkit is hidden in the tray or minimized.
- The RAM warning glow no longer animates a grain texture, which kept the GPU busy.

## 0.2.1

- Native title bar menu and updated settings controls.
- Automatic update checks and installation from Settings.
- Startup, tray and high-memory notification settings.
- Red RAM warning glow at high usage.
- Improved process table, card interactions and tray icon readability.
