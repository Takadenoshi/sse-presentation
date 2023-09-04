import SSE from 'express-sse';

export const name = 'retry-flaky';

export default function registerBasic(server) {
  console.log(`Registering /stream/${name}`);

  server.get(`/stream/${name}`, (req, res) => {
    const { "last-event-id": lastEventID } = req.headers;
    const retry = 10_000;
    const sse = new SSE(undefined, { retry });
    sse.init(req, res);
    const lastEventLabel = lastEventID ? ` Last Event ID: ${lastEventID}.` : '';
    setTimeout(() => sse.send(`Hello from ${req.url}!${lastEventLabel}`), 1000);
    setTimeout(() => sse.send(`Retry set to ${retry} ms`), 1500);
    setTimeout(() => sse.send("You're getting the boot in 2 seconds"), 2000);
    setTimeout(() => res.end(), 4000);
  });
}
