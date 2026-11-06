// Writes latest.json for the updater and release-notes.md for `gh release create --notes-file`,
// both next to the signed NSIS installer. The notes come from this version's section in CHANGELOG.md.
// Run after `bun run release:build`, then attach latest.json to the GitHub release along with the installers.
import { readFileSync, writeFileSync } from 'node:fs'

const REPO = 'jojoarman1/devkit'
const BUNDLE_DIR = 'src-tauri/target/release/bundle/nsis'

const { version } = JSON.parse(readFileSync('src-tauri/tauri.conf.json', 'utf8'))
const installer = `devkit_${version}_x64-setup.exe`
const signature = readFileSync(`${BUNDLE_DIR}/${installer}.sig`, 'utf8').trim()

const getChangelogEntries = (changelog: string) => {
  const section = changelog.split(/^## /m).find(part => part.startsWith(`${version}\n`))
  const entries = section?.split('\n').filter(line => line.startsWith('- ')) ?? []
  if (entries.length === 0) {
    throw new Error(`CHANGELOG.md has no "## ${version}" section with "- " entries; the update dialog would show nothing`)
  }
  return entries
}

// git may check the file out with CRLF, which would hide the "## <version>\n" header
const notes = getChangelogEntries(readFileSync('CHANGELOG.md', 'utf8').replaceAll('\r\n', '\n')).join('\n')

const manifest = {
  version,
  notes,
  pub_date: new Date().toISOString(),
  platforms: {
    'windows-x86_64': {
      signature,
      url: `https://github.com/${REPO}/releases/download/v${version}/${installer}`,
    },
  },
}

const releaseNotes = `## What's new

${notes}

## Downloads

Use the x64 setup EXE or MSI installer. Existing installations can update from Settings.
`

writeFileSync(`${BUNDLE_DIR}/latest.json`, `${JSON.stringify(manifest, null, 2)}\n`)
writeFileSync(`${BUNDLE_DIR}/release-notes.md`, releaseNotes)
console.log(`Wrote latest.json and release-notes.md for ${version} to ${BUNDLE_DIR}`)
