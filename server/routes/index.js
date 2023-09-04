import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

function getScriptDir() {
  return dirname(fileURLToPath(import.meta.url));
}

function getScriptsInDir() {
  return readdirSync(getScriptDir())
    .filter(name => name.endsWith('.js') && name !== 'index.js');
}

export async function register(server) {
  const files = getScriptsInDir();
  for(const file of files) {
    const { default: register } = await import(join(getScriptDir(), file));
    register(server);
  }
}
