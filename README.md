# ReactLive SSE Talk Repo

Presentation slides are available [online here](http://takadenoshi.github.io/sse-presentation/).

## Contents

- server/
  - Express SSE server for playground and demo app
- react-playground/
  - React playground app to explore SSE/EventSource behaviors under different browsers & conditions
- react-demo/
  - Demo app used during talk that streams emoji reactions and the number of connected clients
- presentation/
  - presentation source & built files. The theme is extracted to [this reusable repo](https://github.com/takadenoshi/pandoc-presentation-template).

## Playground scenarios

- Simple: A route that sends two events after a delay
- Flaky: A stream that will disconnect after 4 seconds
- Retry-flaky: A stream that sets a custom `retry` timeout to 10_000 ms and disconnects after 4 seconds
- Notifications: A stream that sends notifications from a list with set `id` fields, and randomly disconnects after 1.5 - 4 seconds. Reconnecting should resume from the last seen ID, until the notifications stream is consumed.
- Not SSE: Endpoint that returns a `200` without the correct Content-Type (not SSE)
- Status code: stream that returns a custom, user-provided status code
