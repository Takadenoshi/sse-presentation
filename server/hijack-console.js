const originals = {};

for(const method of ['log', 'warn', 'error']) {
  originals[method] = console[method];
  console[method] = (...args) => originals[method](new Date().toISOString(), ...args);
}
