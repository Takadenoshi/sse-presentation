import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

function getScriptDir() {
  return dirname(fileURLToPath(import.meta.url));
}
function getScriptsInDir(path='.') {
  return readdirSync(join(
    getScriptDir(),
    path,
  )).filter(name => name.endsWith('.js') && !name.endsWith('index.js'))
    .map(name => join(path, name));
}

export async function register(server) {
  const files = ['stream', 'demo'].flatMap(dir => getScriptsInDir(dir));
  for(const file of files) {
    console.error("importing", file);
    const { default: register } = await import(join(getScriptDir(), file));
    register(server);
  }
}
