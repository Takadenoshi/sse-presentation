import SSE from '@takadenoshi/express-sse';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash/debounce.js';

export const name = 'emoji';

const emojiMap = {
  1: "🙂",
  2: "🙃",
}

const validEmojiValues = Object.keys(emojiMap).map(strNum => parseInt(strNum, 10));

function validate(e) {
  return validEmojiValues.includes(e);
}

const connected = new Map();

const sse = new SSE(connected.size + 1, { initialEvent: 'clients' });

const updateConnected = debounce(() => {
  sse.send(connected.size, 'clients');
  sse.updateInit(connected.size);
}, 500);

const outBuffer = [];

const sendBuffer = debounce(() => {
  const data = [...outBuffer];
  outBuffer.splice(0); // clear outbuffer;
  sse.send(data);
}, 250);

export default function register(server) {
  console.log(`Registering /demo/${name}`);
  
  server.get(`/demo/${name}`, (req, res) => {
    let { uuid } = req.cookies;
    if (!uuid) {
      uuid = uuidv4();
      res.cookie('uuid', uuid);
    }
    connected.set(uuid, 1 + (connected.get(uuid) ?? 0));
    updateConnected();
    sse.init(req, res);
    res.on('close', () => {
      if (connected.get(uuid) < 2) {
        console.log("removing last");
        connected.delete(uuid);
        updateConnected();
      } else {
        console.log("removing not last", uuid);
        connected.set(uuid, (connected.get(uuid) ?? 0) - 1);
      }
    });
  });
  
  server.post(`/demo/${name}`, (req, res) => {
    const { e } = req.body;
    if (!validate(e)) {
      return res.status(400).json({error: 'Invalid emoji offset'});
    }
    outBuffer.push(e);
    sendBuffer();
    res.send({"ok": 1});
  });
}
