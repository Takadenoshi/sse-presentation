---
title-prefix: Takadenoshi
title:  Server-Sent Events
author: tasos@kadena.io
date: September 29, 2023
icons:
  - assets/icons/tasos.jpeg
  - assets/icons/k-internal-icon.jpg
  - assets/icons/logo_reactlive.svg
video:
  - src: assets/videos/kd-back.webm
    type: video/webm
  - src: assets/videos/kd-back.mp4
    type: video/mp4
video_playback_rate: 0.5
slide_bg_is_video: true
background: assets/bg.png
---

# whois "Tasos Bitsios"

- Full stack software developer ~ 13 years
  - Somwehat backend-leaning
  - Mostly JS/TS/node.js/React
  - Mostly worked in startups
- Long time listener, first time speaker
- Developer @ [Kadena](https://kadena.io/) Developer Experience team
- Socials:
  - [\@Takadenoshi](https://github.com/takadenoshi) on Github 
  - [\@Takadenoshi](https://x.com/takadenoshi) on X

# whois "Kadena"

- Scalabe PoW Blockchain
- Focus on:
  - Scalability
  - Intelligent & secure smart contracts
    - Formal verification
    - Source available
- Socials
  - [\@kadena-io](https://github.com/kadena-io) and [\@kadena-community](https://github.com/kadena-community) on Github
  - [\@kadena_io](https://x.com/kadena_io) on X
  - [kadena.io](https://kadena.io) on the Interwebs

---

# Server-Sent Events (SSE)

## A server-push protocol

- Unidirectional: Server -> Client
- Essentially a streaming HTTP/1.1 GET (or HTTP/2)
  - Connection is kept open, server writes more data as it becomes available
- (Web) Client side interacts with SSE endpoints using `EventSource`
  - Register `data` or custom `event` callbacks
  - A MessageEvent Interface
- With reconnection batteries included*
  - Terms and conditions may apply

---

# Use cases

Replaces polling. Stream any kind of update from the server.

- notifications
- live ticker data
- live sports events
- anything that is UTF-8 suitable

---

# What is this ~~new~~ thing?

🥳 SSE is 19 years old

🔧 13 years of mainstream support

<hr />

- 2004 Sep 23 &middot; [Server-sent DOM Events](https://web.archive.org/web/20041009144718/http://www.whatwg.org/specs/web-apps/current-work/#server-sent), Ian Hickson, Opera Software, WHATWG Web Applications 1.0
- 2006 &middot; [Production] Opera browser implementation
- 2009 &middot; [W3C Working Draft](https://www.w3.org/TR/2009/WD-eventsource-20090423/), Ian Hickson, Google Inc
- 2010 &middot; [Production] Safari v5, Chrome v6
- 2011 &middot; [Production] Firefox v6, 
- 2015 &middot; [W3C Recommendation](https://www.w3.org/TR/2015/REC-eventsource-20150203/)


<hr />

History: [W3C Publication History](https://www.w3.org/TR/2015/REC-eventsource-20150203/)

Current: [HTML Living Standard § 9.2](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events) 

---

# Playground repo - download me!

:::::::::::::: {.columns}
::: {.column width="60%"}

Play-along repository:

- SSE server (express)
- React app
- Presentation

[github.com/takadenoshi/sse-presentation](https://github.com/takadenoshi/sse-presentation)

Useful for examining behaviors, browser implementation differences.

Repo link in QR ➡

:::
::: {.column width="38%"}

![](assets/images/qr.png)

:::
::::::::::::::


---

# Minimum Viable SSE response


The simplest server-sent event stream specifies just `data` events.

Example with 2 events:

```
> GET /stream/hello HTTP/1.1

< HTTP/1.1 200 OK
< Content-Type: text/event-stream

< data: Hello\n\n

< data: ReactLive are you there?\n\n
```

Content-Type is `text/event-stream`

Events separated by two newline characters `\n\n`

Data is encoded in UTF-8 (mandatory)

<sup>[Playground](https://github.com/takadenoshi/sse-presentation): "simple" scenario</sup>

---

# Simple EventSource consumer

Server-sent events are consumed with `EventSource`:

```javascript
let i=0;

const source = new EventSource("http://localhost:3001/stream/simple");

// "message" event emitted for each "data" event received
source.addEventListener("message", event => console.log(++i, event.data), false);

```

The exmaple from the previous slide would trigger the callback twice, logging:


:::::::::::::: {.columns}
::: {.column width="50%"}

```
< HTTP/1.1 200 OK
< Content-Type: text/event-stream

< data: Hello\n\n

< data: ReactLive are you there?\n\n
```

:::
::: {.column width="50%"}

```



1 Hello

2 ReactLive are you there?
```

:::
::::::::::::::

---

# Named Events

You can "namespace" your events using the `event` field with any custom name:

```
< event: goal
< data: "ARS-LIV 1-1 45"\n\n

< event: spectator-chat
< data: "Did you see that ludicrous display just now"\n\n
```

The `goal` and `spectator-chat` events are handled separately on the frontend

- Allows multiplexing / routing events 
  - no need for pattern matching on a shared data payload

---

# Comments

Any lines starting with `:` (colon) are interpreted as comments 

```
< data: this or that\n\n

< :TODO emit some events in the near future
```

These are ignored on the client-side

---

# Reconnection (1)

By default*, EventSource consumers will reconnect if the connection is interrupted.

<sup>\* _with implementation-specific caveats_</sup>

The default reconnection timeout is up to each browser (empirically: between 3-5 s.)

## Custom timeouts

The reconnection timeout can be customized.

Emit a `retry:` field in any of the events:

```
retry: 2500
data: Hello!\n\n

```

- Value is in milliseconds
- Timeouts are linear

<sup>[Playground](https://github.com/takadenoshi/sse-presentation): "Retry-flaky" scenario</sup>

---

# Reconnection (2)

## Computer can say no

A server can signal "do not reconnect":

- with a `Content-Type` header other than `text/event-stream`
- with a `2xx` response other than 200
  - 301, 307 redirects to a 200 are OK

<sup>[Playground](https://github.com/takadenoshi/sse-presentation): "Not SSE" scenario</sup>

---

# Reconnection (3) - Last-Event-ID

Events can include an `id` field with any UTF-8 string as value.

Connection interrupted? Reconnection header `Last-Event-ID` set to the last id received.

This allows the server to resume gracefully.

<hr />

If this is the last event received in a stream that disconnects:
```
< id: data-0
< retry: 5000
< data: Data Zero event\n
```

Then the connection timeout will be 5 seconds, and the `Last-Event-ID` header will be set to `data-0`.

```
> GET /stream/notifications HTTP/1.1
> Host: localhost:3001
> Last-Event-ID: data-0
```

<sup>[Playground](https://github.com/takadenoshi/sse-presentation): "notifications" scenario</sup>

---

# Full SSE response

:::::::::::::: {.columns}
::: {.column width="45%"}

Entire SSE gramar: 4+1 fields

- Setting reconnection time `retry: 2000`
- Event identifiers `id: 0`
- Unnamed events `data: Hello\n\n`
- Comment: starts with colon `:I am a ...`
- Named events `event: status`


:::
::: {.column width="55%"}

```
> GET /stream/hello HTTP/1.1

< HTTP/1.1 200 OK
< Content-Type: text/event-stream

< retry: 2000
< id: 0
< data: Hello\n\n

< :I am a comment line

< id: 1
< event: status
< data: {"warn":"Service degraded"}\n\n
```

:::
::::::::::::::

---

# EventSource: custom events

You can subscribe to custom events (e.g. `status`) with `.addEventListener`:

```javascript
const source = new EventSource('/stream/hello');

// [name]: triggers for custom named event, here: "status"
source.addEventListener(
  "status",
  ({ data }) => console.log("custom event: status", JSON.parse(data)),
  false,
);

// as before, un-named data events
source.addEventListener(
  "message", 
  (event) => { console.log("data event", event.data); },
  false,
);
```

---

# EventSource: connection events

Subscribe to `open` and `error` for connection management:

```javascript
// on connection established
source.addEventListener(
  "open",
  (event) => { console.log("Connection status"); },
  false
);

// on disconnection
source.addEventListener(
  "error",
  (event) => { console.log("Connection status"); },
  false
);
```

---

# The EventSource Interface

- `constructor(url, { withCredentials: boolean })`
  - `withCredentials`: instantiate with CORS credentials (default: false)

- Events:
  - `open`: on connection
  - `error`: on error/disconnection
  - `message`: on generic data: event received
  - `<custom>:` on named event received

- `addEventListener(event_name: string, (event: Event) => void, bubbles: boolean)`
- readyState: `CONNECTING` (0) | `OPEN` (1) | `CLOSED`(2)
  - CONNECTING: also "waiting to reconnect"
  - CLOSED: will not attempt to reconnect

- close()

---

# Error event is a bit useless

- Single bit of information: "error"

- callback signature is `(event: Event) => void`
  - event.target instanceof EventSource

- No reason or message can be derived 
  - usually output in console

- Some disconnections can be "fatal", cancelling the reconnection policy.

- Inspect `readyState` to find out EventSource's intent:
  - CONNECTING: will reconnect / waiting to reconnect / reconnecting
  - CLOSED: will not reconnect


---

# Implementation Considerations: HTTP/1.1 connections quota

Browsers implement a **per-hostname connection quota** (6) for HTTP/1.1

Per [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#listening_for_custom_events):

> Warning: When not used over HTTP/2, SSE suffers from a **limitation to the maximum number of open connections**, which can be especially painful when opening multiple tabs, as the limit is per browser and is set to a very low number (6). The issue has been marked as "Won't fix" in [Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=275955) and [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=906896).

> When using HTTP/2, the maximum number of simultaneous HTTP streams is negotiated between the server and the client (defaults to 100).

## Solutions

- **Prefer HTTP/2 where available** (can-i-use 96% yes)
- If applicable, use an EventSource within a SharedWorker
- Use subdomains for SSE endpoint(s)

---

# Implementation Considerations: Reconnecting

**Default reconnection behavior implementation is not fully standardized**

When a network error is encountered:

- Firefox: Will **stop** retrying (standard compliant)
- Chrome: Will **keep** retrying (actually helpful)

<hr />

**Consider handling reconnections yourself:**

- Option for exponential backoff strategies
- Better connection timeout detection

<hr />

Test it out in the [playground repo](https://github.com/takadenoshi/sse-presentation):

- Start react-app but not the server
- Open react-app in Chrome and Firefox
- Try to connect to any endpoint
- Chrome will keep trying to reconnect vs Firefox will quit after one network error

---

# Implementation Considerations: Proxies (1)

## Proxies can kill

Proxies, load balancers and other networking middleware can kill idle connections after a short while.

Two approaches to fix this:

<hr />

## 1/ Comment (not client-aware)

You can emit a comment (any line starting with a colon `:`)

```
< :bump
```

Good enough to keep connection alive.

EventSource won't emit any event.

---

# Implementation Considerations: Proxies (2)

## Proxies can kill

Proxies, load balancers and other networking middleware can kill idle connections after a short while.

Two approaches to fix this:

<hr />

## 2/ Heartbeat event (client-aware)

Emit a custom "heartbeat" or "ping" event every 15 seconds or so:

```
< event: heartbeat
< data: ""
```

(data field **must** be present)

The client can listen to this event and use it to detect stale connections:

**"expect heartbeats every N seconds, otherwise reconnect"**

Preferred approach, especially for important payloads.

---

# Implementation Considerations: Service Workers (Firefox)

## Firefox Service Workers 💔 EventSource

Firefox has yet to implement support for EventSource in its Service Worker context.

Future people can track the present validity of this statement [here](https://bugzilla.mozilla.org/show_bug.cgi?id=1681218).

✅ But you can use it in a SharedWorker

---

# Implementation Considerations: Last-Event-ID detail

**If no event is emitted in the subsequent connection's lifetime, the Last-Event-ID is reset.**

<hr />

When a reconnected session is initialized with `Last-Event-ID: Some-id`

And the connection emits no messages for its lifetime,

Then the Last-Event-ID value is _reset_.

---

# Vs competiting options

:::::::::::::: {.columns}
::: {.column width="33%"}

## 1a/ Polling

Keep requesting new data on an interval

- Slower
- Usually more resource intensive than SSE

Benefit: Doesn't "hog" a connection (HTTP/1.1)

## 1b/ Long Polling

"Hanging GET" - server keeps connection open/hanging until there is something to write.

Client loops the GET request.

:::
::: {.column width="32%"}

## 2/ SSE

- Like formalized, reusable long polling
- HTTP + REST compatible
  - Works with your existing framework
  - Works with your existing auth
- Reconnecting

:::
::: {.column width="32%"}

## 3/ Websockets

- Not HTTP/REST
  - Websocket server usually a separate beast
- Must bring your own:
  - Routing
  - Auth
  - Error handling
  - TLS Certs (duplicated)
- Pain to debug
- Bidirectional/full duplex
  - good if you need it

:::
::::::::::::::

---

# Kadena use case

Blockchain stuff usually comes with lots of polling.

Kadena's Chainweb is 20 "braided" chains -> 20x polling threads (worst case)

[Chainweb-stream](https://github.com/kadena-io/chainweb-stream):

- SSE Server
- Streams transactions of a certain type (specific account or contract)

[Chainweb-stream-client](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/chainweb-stream-client):

- Client side lib (node, browser)
- Detects stale connections (heartbeat events)
- Detects initial connection timeouts
- Custom reconnection (exponential backoffs)

---

# Can I use?

Yes (96.11%)

![](assets/images/caniuse.png)

[caniuse.com/eventsource](https://caniuse.com/eventsource)

---

# Almost Done

## References

[§ 9.1 MessageEvent Interface - HTML Living Standard](https://html.spec.whatwg.org/multipage/comms.html)

[§ 9.2 Server-Sent Events - HTML Living Standard](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events)

## Links

[Presentation](https://takadenoshi.github.io/sse-presentation/#(1))

[Presentation source & SSE playground - Github](https://github.com/takadenoshi/sse-presentation)

## Font

`Monospace font:` [Kode mono](https://kodemono.com/) by Kadena's Isa Ozler