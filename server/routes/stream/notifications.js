import SSE from "@takadenoshi/express-sse";

export const name = "notifications";

const notifications = [
  "First notification",
  "Second notification",
  "Third notification",
  "Fourth notification",
  "Fifth notification",
  "Sixth notification",
  "Seventh notification",
  "Eighth notification",
  "Ninth notification",
  "Tenth notification",
];

export default function registerBasic(server) {
  console.log(`Registering /stream/${name}`);

  server.get(`/stream/${name}`, (req, res) => {
    const { "last-event-id": lastEventID } = req.headers;
    const retry = 1_000;
    const sse = new SSE(undefined, { retry });
    sse.init(req, res);
    const lastEventLabel = lastEventID ? ` Last Event ID: ${lastEventID}.` : "";
    const disconnectRand = 1500 + Math.floor(2500 * Math.random());
    sse.send(`Hello from ${req.url}!${lastEventLabel}.Retry set to ${retry} ms,`);
    sse.send(`You're getting the boot in ${disconnectRand} ms`);
    setTimeout(() => res.end(), disconnectRand);
    let notificationsToSend;
    if (lastEventID && lastEventID.startsWith("notification-")) {
      notificationsToSend = notifications.slice(lastEventID ? 1 + Number(lastEventID.replace("notification-", "")) : 0);
    } else {
      notificationsToSend = notifications;
    }
    const droppedNotifications = notifications.length - notificationsToSend.length;
    notificationsToSend.forEach((text, i) => setTimeout(() => sse.send(text, undefined, `notification-${i+droppedNotifications}`), (1+i) * 1000));
  });
}
