// Writes latest.json for the updater next to the signed NSIS installer.
// Run after `bun run release:build`, then attach latest.json to the GitHub release along with the installers.
import { readFileSync, writeFileSync } from 'node:fs'

const REPO = 'jojoarman1/devkit'
const BUNDLE_DIR = 'src-tauri/target/release/bundle/nsis'

const { version } = JSON.parse(readFileSync('src-tauri/tauri.conf.json', 'utf8'))
const installer = `devkit_${version}_x64-setup.exe`
const signature = readFileSync(`${BUNDLE_DIR}/${installer}.sig`, 'utf8').trim()

const manifest = {
  version,
  notes: `devkit ${version}`,
  pub_date: new Date().toISOString(),
  platforms: {
    'windows-x86_64': {
      signature,
      url: `https://github.com/${REPO}/releases/download/v${version}/${installer}`,
    },
  },
}

writeFileSync(`${BUNDLE_DIR}/latest.json`, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Wrote ${BUNDLE_DIR}/latest.json for ${version}`)
