import './App.css';
import { useState, useEffect, useCallback, useRef, } from 'react';
import { READY_STATES, API_SERVER, } from './util.js';
import EMOJI_MAP from './emoji-map.js';
import './App.css';

const path = `/demo/emoji`;
const endpoint = `${API_SERVER}${path}`;

function getISOTime() {
  const d = new Date();
  const [hours, minutes, seconds, ms] = [
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds(),
  ];
  return `${hours}:${minutes}:${seconds}.${ms}`;
}

export default function App() {
  const [eventSource, setEventSource] = useState();
  const [clients, setClients] = useState(0);
  const [logs, setLogs] = useState([]);
  const scrollRef = useRef();

  const appendLogs = useCallback((...args) => {
    setLogs((logs) => [...logs, [getISOTime(), ...args].join(' ')]);
    setTimeout(() => {
      scrollRef.current?.scroll(0, 1e8);
    }, 10);
  }, [scrollRef]);

  useEffect(() => {
    let eventSource;
    function init() {
      const es = eventSource = new EventSource(endpoint);
      es.addEventListener('open', () => {
        appendLogs(`connection open`);
      });
      es.addEventListener('error', () => {
        destroy();
        setTimeout(() => {
          init();
        }, 3000);
      });
      es.addEventListener('clients', ({ data }) => {
        appendLogs(`rcv clients = ${data}`);
        setClients(data);
      });
      es.addEventListener('message', ({ data }) => {
        const parsed = JSON.parse(data);
        appendLogs(`rcv data = ${data} = ${parsed.map(d => EMOJI_MAP[d])}`);
      });
      setEventSource(es);
    }
    function destroy() {
      if (eventSource) {
        eventSource.close();
        appendLogs(`disconnected`);
      }
    }
    init();
    return () => destroy();
  }, [appendLogs]);

  const post = useCallback((e) => {
    (async() => {
      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ e }),
        });
        await resp.json();
        appendLogs(`POST ${path} [${e}]`);
      } catch(e) {
        appendLogs(`ERROR POST ${path} [${e}] ${e.message}`);
      }
    })()
  }, [appendLogs]);

  return <>
    <div className="App">
      <div className="container" ref={scrollRef}>
        { eventSource ? <p>Current eventSource.readyState: {READY_STATES[eventSource.readyState]}</p> : null }
        {logs.map((log, i) =>
          <div key={`log-${i}`}>{log}</div>
        )}
      </div>
      <div className="buttons">
        {Object.entries(EMOJI_MAP).map(([val, emoji], i) =>
          <div className="button" onClick={() => post(Number(val))} key={`emoji-${i}`}>{emoji}</div>
        )}
      </div>
      <div className="clients">
        Connected: {clients}
      </div>
    </div>
  </>
}
