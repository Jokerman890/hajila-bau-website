#!/usr/bin/env node

import { spawn } from 'child_process';

function runTests() {
  console.log('🚀 Starte Test-Suite...');
  console.log(`ℹ️ Node: ${process.version} | Plattform: ${process.platform}`);
  console.log(`ℹ️ CWD: ${process.cwd()}`);
  console.log(`ℹ️ NODE_OPTIONS (vorher): ${process.env.NODE_OPTIONS ? '(set)' : '(none)'}`);
  // Zusätzliche CLI-Argumente an Jest weiterreichen (z. B. --watch, --coverage)
  const passthrough = process.argv.slice(2);
  const args = ['jest', '--config', 'jest.config.mjs', '--runInBand', '--verbose', ...passthrough];
  console.log('🔍 Ausführung:', 'npx', args.join(' '));

  const env = { ...process.env };
  const vmFlag = '--experimental-vm-modules';
  if (env.NODE_OPTIONS && !env.NODE_OPTIONS.includes(vmFlag)) {
    env.NODE_OPTIONS = `${env.NODE_OPTIONS} ${vmFlag}`.trim();
  } else if (!env.NODE_OPTIONS) {
    env.NODE_OPTIONS = vmFlag;
  }
  console.log(`ℹ️ NODE_OPTIONS (effektiv): ${env.NODE_OPTIONS ? '(set)' : '(none)'}`);

  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  console.log(`ℹ️ NPX Kommando: ${npxCmd}`);
  const child = spawn(npxCmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Tests erfolgreich abgeschlossen.');
      process.exit(0);
    } else {
      console.error(`❌ Tests fehlgeschlagen (Exit-Code ${code}).`);
      process.exit(code ?? 1);
    }
  });

  child.on('error', (err) => {
    console.error('❌ Fehler beim Starten von Jest:', err);
    process.exit(1);
  });
}

runTests();
