import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import express, { json } from 'express';
import cors from 'cors';
import { register } from './routes/index.js';
import './hijack-console.js';

const port = process.env.PORT ? Number(process.env.port) : 3001;

const app = express();

app.use(cookieParser());
app.use(compression()); // also enables flushing early
app.use(cors());
app.use(json());

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
