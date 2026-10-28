# devkit

A small Windows desktop toolbox for developers.

## Download

**[Download the latest release](https://github.com/jojoarman1/devkit/releases/latest)**

There are two installers:

- `devkit_<version>_x64-setup.exe`: the regular installer. Use this one if
  you're not sure.
- `devkit_<version>_x64_en-US.msi`: an MSI for managed installs.

It runs on Windows 10 and 11 (x64). It needs Microsoft Edge WebView2. That's
built into Windows 11, and on Windows 10 the installer downloads it if needed.

> The installer isn't code-signed yet, so on the first run Windows SmartScreen
> may show "Windows protected your PC". Click **More info → Run anyway**.

## Features

- **Live resource monitor:** CPU, RAM, system disk, network speed, temperature
  and uptime, updated every second.
- **Top processes:** the three apps using the most CPU, with their icons, CPU %
  and memory.
- **Memory cleaner:** frees RAM the way Mem Reduct does. It empties process
  working sets and purges the low-priority standby list. This needs
  administrator rights, and a shield on the button marks that.
- **Tray:** a RAM gauge in the tray. devkit can minimize and close to the tray
  instead of quitting.
- **Window tools:** pin the window on top of all others.
- **Settings** (in the **…** menu): System, Light or Dark theme, start as
  administrator, minimize and close to tray.

The temperature card shows the CPU when the board exposes ACPI thermal zones to
Windows. Otherwise it shows an NVIDIA GPU, read through the driver's NVML. With
neither, it says "not supported".

## Build from source

Requirements: [Bun](https://bun.sh), [Rust](https://rustup.rs), and the
[Tauri prerequisites for Windows](https://v2.tauri.app/start/prerequisites/).

```sh
bun install
bun run tauri dev      # run in development
bun run tauri build    # build the installers into src-tauri/target/release/bundle/
```

Built with [Tauri 2](https://v2.tauri.app), React 19, TypeScript, Tailwind CSS 4
and GSAP.

## License

[MIT](LICENSE). The bundled Geist font is licensed under the [SIL Open Font License](src/assets/fonts/OFL.txt).
