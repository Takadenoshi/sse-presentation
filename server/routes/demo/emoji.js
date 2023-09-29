import SSE from '@takadenoshi/express-sse';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash/debounce.js';
import emojiMap from '../../../common/emoji-map.js';

export const name = 'emoji';

const validEmojiValues = Object.keys(emojiMap).map(strNum => parseInt(strNum, 10));

function validate(e) {
  return validEmojiValues.includes(e);
}

let connected = 0;

const sse = new SSE();

const keepAliveInt = setInterval(() => {
  console.log('bump');
  sse.comment();
}, 15_000);

const updateConnected = debounce(() => {
  sse.send(connected, 'clients');
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
      res.cookie('uuid', uuid, { maxAge: 86400000, httpOnly: true });
    }
    connected += 1;
    updateConnected();
    sse.init(req, res);
    res.on('close', () => {
      connected -= 1;
      updateConnected();
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
