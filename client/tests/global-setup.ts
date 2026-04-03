/**
 * global-setup.ts
 *
 * Runs `python seed.py` in the server directory before ANY Playwright test
 * starts (all suites, not just e2e).  Drops and recreates the users, Projects,
 * and hardware collections so every run starts with a clean database —
 * no leftover e2e users / projects from a previous run.
 */

import { execSync } from 'child_process';
import path from 'path';

export default function globalSetup() {
  // process.cwd() is the client root (where playwright.config.ts lives)
  const serverDir = path.resolve(process.cwd(), '..', 'server');
  console.log(`\n[globalSetup] Resetting database via seed.py in ${serverDir} …`);

  execSync('python seed.py', {
    cwd: serverDir,
    stdio: 'inherit',
    timeout: 30_000,
  });

  console.log('[globalSetup] Database reset complete.\n');
}
