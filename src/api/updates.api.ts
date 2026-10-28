import { getVersion } from '@tauri-apps/api/app'
import { relaunch } from '@tauri-apps/plugin-process'
import { check, type Update } from '@tauri-apps/plugin-updater'

export const getAppVersion = () => getVersion()

// null when the latest release on GitHub is not newer than this build
export const checkForUpdate = () => check()

// on Windows the passive NSIS installer closes the app itself; relaunch covers the other platforms
export const installUpdate = async (update: Update) => {
  await update.downloadAndInstall()
  await relaunch()
}
