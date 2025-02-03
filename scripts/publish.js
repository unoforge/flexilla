// scripts/publish.js
const { execSync } = require('child_process');

execSync('git fetch --tags', { stdio: 'inherit' });

const changedPackages = execSync('lerna changed --json').toString();
const packages = JSON.parse(changedPackages);

if (packages.length === 0) {
  console.log('No packages have changed. Skipping publish.');
  process.exit(0);
}

console.log('The following packages will be published:');
packages.forEach(pkg => console.log(`- ${pkg.name}`));


// packages order
const publishOrder = [
  '@flexilla/utilities',
  '@flexilla/popover',
  '@flexilla/collapse',
  "@flexilla/accordion",
  "@flexilla/auto-resize-area",
  "@flexilla/custom-range",
  "@flexilla/dismissible",
  "@flexilla/dropdown",
  "@flexilla/modal",
  "@flexilla/offcanvas",
  "@flexilla/tabs",
  "@flexilla/tooltip",
  "@flexilla/tailwind-plugin"
];

// Publish packages in the specified order
publishOrder.forEach(pkgName => {
  const pkg = packages.find(pkg => pkg.name === pkgName);
  if (pkg) {
    console.log(`Publishing ${pkgName}...`);
    execSync(`lerna exec --scope ${pkgName} -- npm publish`, { stdio: 'inherit' });
  } else {
    console.log(`Skipping ${pkgName} (no changes detected).`);
  }
});