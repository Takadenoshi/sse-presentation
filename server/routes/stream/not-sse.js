import SSE from '@takadenoshi/express-sse';

export const name = 'not-sse';

export default function registerBasic(server) {
  console.log(`Registering /stream/${name}`);

  server.get(`/stream/${name}`, (req, res) => {
    res.send({"Not SSE": 1});
  });
}
