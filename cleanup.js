const fs = require('fs');
const path = require('path');


const packagesDir = path.resolve(__dirname, 'packages');
console.log('Starting cleanup of node_modules folders inside packages...');
if (!fs.existsSync(packagesDir)) {
    console.error(`Error: Packages directory not found at ${packagesDir}`);
    process.exit(1);
}

// Read the packages directory
fs.readdir(packagesDir, (err, packages) => {
    if (err) {
        console.error('Error reading the packages directory:', err.message);
        process.exit(1);
    }

    if (packages.length === 0) {
        console.log('No packages found in the packages directory.');
        process.exit(0);
    }

    packages.forEach((pkg) => {
        const packagePath = path.join(packagesDir, pkg);
        const nodeModulesPath = path.join(packagePath, 'node_modules','@flexilla');
        if (fs.lstatSync(packagePath).isDirectory()) {
            if (fs.existsSync(nodeModulesPath)) {
                console.log(`Removing ${nodeModulesPath}...`);
                try {
                    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
                    console.log(`Successfully removed: ${nodeModulesPath}`);
                } catch (err) {
                    console.error(`Failed to remove ${nodeModulesPath}:`, err.message);
                }
            } else {
                console.log(`No node_modules found in ${packagePath}. Skipping.`);
            }
        } else {
            console.log(`${packagePath} is not a directory. Skipping.`);
        }
    });
    console.log('Cleanup complete!');
});