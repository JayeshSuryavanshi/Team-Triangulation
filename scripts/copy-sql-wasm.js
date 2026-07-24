// Copies the sql.js WebAssembly binary into public/ so it is served at the app
// root and can be loaded offline (see `locateFile` in src/db/index.js). Runs on
// postinstall and before start/build/test. Keeping it out of git means the
// committed binary always matches the installed sql.js version.
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
const destDir = path.join(__dirname, '..', 'public');
const dest = path.join(destDir, 'sql-wasm.wasm');

if (!fs.existsSync(source)) {
  // Dependencies not installed yet (e.g. postinstall ordering) — skip quietly.
  console.warn('[copy-sql-wasm] sql.js not found yet; skipping. It will be copied on the next install/build.');
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(source, dest);
console.log('[copy-sql-wasm] Copied sql-wasm.wasm -> public/sql-wasm.wasm');
