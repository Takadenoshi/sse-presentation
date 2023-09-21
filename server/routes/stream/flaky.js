import SSE from '@takadenoshi/express-sse';

export const name = 'flaky';

export default function registerBasic(server) {
  console.log(`Registering /stream/${name}`);

  server.get(`/stream/${name}`, (req, res) => {
    const sse = new SSE(undefined, { noID: true });
    sse.init(req, res);
    sse.send(`Hello from ${req.url}!`);
    setTimeout(() => sse.send("You're getting the boot in 2 seconds"), 2000);
    setTimeout(() => res.end(), 4000);
  });
}
