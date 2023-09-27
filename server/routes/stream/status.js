import SSE from '@takadenoshi/express-sse';

export const name = 'status';

export default function registerBasic(server) {
  console.log(`Registering /stream/${name}`);

  server.get(`/stream/${name}`, (req, res) => {
    const { code } = req.query; // undefined also OK
    const sse = new SSE(undefined, { status: code });
    sse.init(req, res);
    sse.send(`Hello with status code ${code}!`);
  });
}
