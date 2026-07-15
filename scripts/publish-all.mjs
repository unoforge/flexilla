import { execSync } from 'child_process';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const packagesDir = join(root, 'packages');

try {
  execSync('npm whoami', { stdio: 'pipe' });
} catch {
  console.error('Not logged into npm. Run `npm login` first.');
  process.exit(1);
}

function getPublishedVersion(name) {
  try {
    return execSync(`npm view ${name} version`, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch {
    return null;
  }
}

const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const published = [];
const skipped = [];
const failed = [];

for (const dir of packageDirs) {
  const pkgPath = join(packagesDir, dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  if (pkg.private === true) {
    console.log(`Skipping private package: ${pkg.name}`);
    continue;
  }

  const publishedVersion = getPublishedVersion(pkg.name);
  if (publishedVersion === pkg.version) {
    skipped.push(`${pkg.name}@${pkg.version}`);
    continue;
  }

  if (publishedVersion) {
    console.log(`\n${pkg.name}: ${publishedVersion} → ${pkg.version}`);
  } else {
    console.log(`\n${pkg.name}@${pkg.version} (new package)`);
  }

  try {
    execSync('npm publish --access public', {
      cwd: join(packagesDir, dir),
      stdio: 'inherit',
    });
    published.push(`${pkg.name}@${pkg.version}`);
  } catch (err) {
    failed.push(`${pkg.name}@${pkg.version}: ${err.message}`);
  }
}

console.log('\n--- Summary ---');
if (published.length) console.log(`Published:  ${published.join(', ')}`);
if (skipped.length)  console.log(`Skipped:    ${skipped.length} package(s) (already up-to-date)`);
if (failed.length)   console.log(`Failed:     ${failed.join('\n            ')}`);
