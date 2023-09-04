import { createServer } from 'http';
import compression from 'compression';
import express from 'express';
import cors from 'cors';
import { register } from './routes/index.js';
import './hijack-console.js';

const port = process.env.PORT ? Number(process.env.port) : 3001;

const app = express();

app.use(compression()); // enables flushing early
app.use(cors());

app.use((req, res, next) => {
  const { "last-event-id": lastEventID } = req.headers;
  const log = lastEventID ? [ { lastEventID } ] : [];
  console.log(req.method, req.url, ...log);
  next();
});

await register(app);

const server = createServer(app);

server.listen(port, () => {
  console.log(`SSE-demo server listening on port ${port}`);
});
