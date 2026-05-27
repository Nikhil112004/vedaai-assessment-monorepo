import { spawn } from 'node:child_process';
import process from 'node:process';

const run = (name, cwd, command, args) => {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: false,
  });

  child.on('error', (error) => {
    console.error(`[${name}] failed to start`, error);
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[${name}] exited with signal ${signal}`);
      return;
    }
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  return child;
};

const children = [
  run('api', 'apps/api', process.execPath, ['./node_modules/ts-node-dev/lib/bin.js', '--respawn', '--transpile-only', 'src/index.ts']),
  run('web', 'apps/web', process.execPath, ['./node_modules/next/dist/bin/next', 'dev', '--port', '3000']),
];

const shutdown = (signal) => {
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
