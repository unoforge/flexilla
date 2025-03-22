const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function removeDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`Removed: ${dirPath}`);
    }
}

function resetProject() {
    const rootDir = __dirname;
    const packagesDir = path.join(rootDir, 'packages');

    // Clean up packages
    if (fs.existsSync(packagesDir)) {
        const packages = fs.readdirSync(packagesDir);
        
        packages.forEach(pkg => {
            const pkgPath = path.join(packagesDir, pkg);
            if (fs.statSync(pkgPath).isDirectory()) {
                // Remove node_modules in package
                removeDirectory(path.join(pkgPath, 'node_modules'));
                // Remove dist in package
                removeDirectory(path.join(pkgPath, 'dist'));
            }
        });
    }

    // Remove root node_modules
    removeDirectory(path.join(rootDir, 'node_modules'));

    // Install dependencies
    console.log('\nInstalling dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Build project
    console.log('\nBuilding project...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('\nProject reset completed successfully!');
}

resetProject();