import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const packagesDir = join(root, 'packages');
const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const scopedNames = new Map();

for (const dir of packageDirs) {
  const pkgPath = join(packagesDir, dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const [major, minor, patch] = pkg.version.split('.').map(Number);
  const newVersion = `${major}.${minor}.${patch + 1}`;
  scopedNames.set(pkg.name, { dir, oldVersion: pkg.version, newVersion });
}

for (const [, info] of scopedNames) {
  const pkgPath = join(packagesDir, info.dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  pkg.version = info.newVersion;

  for (const depType of ['dependencies', 'devDependencies', 'peerDependencies']) {
    if (!pkg[depType]) continue;
    for (const [depName, depVersion] of Object.entries(pkg[depType])) {
      if (scopedNames.has(depName)) {
        const { newVersion } = scopedNames.get(depName);
        if (depVersion !== 'latest' && depVersion !== '*') {
          pkg[depType][depName] = newVersion;
        }
      }
    }
  }

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`${info.oldVersion} -> ${info.newVersion}  ${pkg.name}`);
}

console.log('\nAll packages bumped!');
