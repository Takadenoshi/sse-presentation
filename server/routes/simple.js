import SSE from 'express-sse';

export const name = 'simple';

export default function registerBasic(server) {
  console.log(`Registering /stream/${name}`);

  server.get(`/stream/${name}`, (req, res) => {
    const sse = new SSE(undefined, { noID: true });
    sse.init(req, res);
    sse.send(`Hello from ${req.url}!`);
    setTimeout(() => sse.send('ReactLive are you there?'), 2000);
  });
}
