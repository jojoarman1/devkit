// Gradually allocates RAM and holds it, to test the memory card. Ctrl+C releases everything.
// Run: bun run stress:memory [gigabytes=4]
const GIGABYTE = 1024 ** 3
const CHUNK_SIZE = 256 * 1024 ** 2
const STEP_DELAY_MS = 500

const targetBytes = Number(process.argv[2] ?? 4) * GIGABYTE
const chunks: Buffer[] = []

while (chunks.length * CHUNK_SIZE < targetBytes) {
  // filling forces the OS to back the pages with physical memory; untouched allocations don't count as used
  chunks.push(Buffer.alloc(CHUNK_SIZE, 1))
  process.stdout.write(`\rHolding ${((chunks.length * CHUNK_SIZE) / GIGABYTE).toFixed(2)} GB`)
  await new Promise(resolve => setTimeout(resolve, STEP_DELAY_MS))
}

console.log('\nTarget reached. Press Ctrl+C to release.')
setInterval(() => {}, 60_000)
