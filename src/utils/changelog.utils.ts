// The updater's notes are the "- " bullet lines of the version's CHANGELOG.md section
// (scripts/make-update-manifest.ts); anything else, like an old "devkit 0.2.2" note, yields no entries.
export const parseChangelogEntries = (notes: string | undefined) =>
  (notes ?? '')
    .split('\n')
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2).trim())
