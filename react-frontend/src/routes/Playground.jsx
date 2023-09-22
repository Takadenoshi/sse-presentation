import { useState, useEffect, useCallback } from 'react';
import { READY_STATES } from '../util.js';

export default function Playground() {
  const [endpoint, setEndpoint] = useState();
  const [eventSource, setEventSource] = useState();
  const [logs, setLogs] = useState([]);
  const [counter, setCounter] = useState(0);

  function appendLogs(...args) {
    setLogs((logs) => [...logs, [new Date().toISOString(), ...args].join(' ')]);
  }

  useEffect(() => {
    if (!endpoint) {
      return;
    }
    setLogs([]);
    const newEventSource = new EventSource(`http://localhost:3001/stream/${endpoint}`);
    for(const eventName of ['open', 'error']) {
      newEventSource.addEventListener(eventName, () => appendLogs('[event]', eventName, `/${endpoint}`));
    }
    for(let eventName of ['message', 'status']) {
      const eventLabel = eventName === 'message' ? 'data' : eventName;
      newEventSource.addEventListener(eventName, ({ data }) => appendLogs('[event]', eventLabel, typeof data, data));
    }
    setEventSource(newEventSource);
    return () => {
      appendLogs(`Disconnecting from`, endpoint);
      newEventSource.close();
    }
  }, [endpoint, counter]);

  const changeEndpoint = useCallback((endpoint) => () => {
    setEndpoint(endpoint);
    setCounter(n => n+1);
  }, []);

  useEffect(() => {
    if (eventSource) {
      appendLogs('[EventSource] readyState ->', READY_STATES[eventSource.readyState]);
    }
  }, [eventSource?.readyState]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={changeEndpoint('simple')}>Simple</button>
        <button onClick={changeEndpoint('flaky')}>Flaky</button>
        <button onClick={changeEndpoint('retry-flaky')}>Retry-flaky</button>
        <button onClick={changeEndpoint('notifications')}>Notifications</button>
        <button onClick={changeEndpoint('not-sse')}>Not SSE</button>
      </header>
      <div className="container">
        { eventSource ? <p>Current eventSource.readyState: {READY_STATES[eventSource.readyState]}</p> : null }
        {logs.map((log, i) =>
          <div key={`log-${i}`}>{log}</div>
        )}
      </div>
    </div>
  );
}
