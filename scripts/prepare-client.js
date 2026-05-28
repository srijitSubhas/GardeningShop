const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const clientDir = path.join(rootDir, 'client');
const clientDistDir = path.join(clientDir, 'dist');
const serverPublicDir = path.join(rootDir, 'server', 'public');

const npmCommand = process.platform === 'win32' ? 'cmd.exe' : 'npm';
const npmArgs = process.platform === 'win32' ? ['/c', 'npm', 'run', 'build'] : ['run', 'build'];

const buildResult = spawnSync(npmCommand, npmArgs, {
  cwd: clientDir,
  stdio: 'inherit',
});

if (buildResult.status !== 0) {
  if (buildResult.error) {
    console.error(buildResult.error);
  }
  process.exit(buildResult.status || 1);
}

if (!fs.existsSync(clientDistDir)) {
  console.error('Client build output was not found at', clientDistDir);
  process.exit(1);
}

fs.rmSync(serverPublicDir, { recursive: true, force: true });
fs.cpSync(clientDistDir, serverPublicDir, { recursive: true, force: true });

console.log(`Client build copied to ${serverPublicDir}`);