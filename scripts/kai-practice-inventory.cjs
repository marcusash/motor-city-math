const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const repository = path.resolve(__dirname, '..');
const bundle = path.join(repository, 'print', 'kai-practice-2026-11');
const inventoryPath = path.join(bundle, 'inventory.json');

function inventory() {
  const files = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(filename);
      else if (filename !== inventoryPath) files.push(filename);
    }
  }
  visit(bundle);
  files.push(
    path.join(repository, '.gitattributes'),
    path.join(repository, 'scripts', 'build-kai-mixed-refresher.cjs'),
    path.join(repository, 'scripts', 'kai-practice-inventory.cjs'),
    path.join(repository, 'tests', 'kai-practice-handoff.test.cjs'),
  );
  return {
    schemaVersion: 1,
    target: 'Standard Precalculus mastery; aiming for an A, not honors-level difficulty',
    currentStudent: 'print/kai-practice-2026-11/Kai_Mixed_Refresher_Quiz_2026-11-04_Easier_Factoring.pdf',
    currentKey: 'print/kai-practice-2026-11/Kai_Mixed_Refresher_Quiz_2026-11-04_Easier_Factoring_PARENT_KEY.pdf',
    files: files.map(filename => {
      const bytes = fs.readFileSync(filename);
      return {
        path: path.relative(repository, filename).split(path.sep).join('/'),
        bytes: bytes.length,
        sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      };
    }).sort((a, b) => a.path.localeCompare(b.path, 'en')),
  };
}

module.exports = { inventory, inventoryPath };
if (require.main === module) {
  if (!process.argv.includes('--write')) {
    throw new Error('Use --write to deliberately refresh the practice inventory.');
  }
  fs.writeFileSync(inventoryPath, `${JSON.stringify(inventory(), null, 2)}\n`);
  console.log('Updated print/kai-practice-2026-11/inventory.json');
}
