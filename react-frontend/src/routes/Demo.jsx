import { useState, useEffect, useCallback, } from 'react';
import { READY_STATES, EMOJI_MAP, API_SERVER, } from '../util.js';
import './Demo.css';

const path = `/demo/emoji`;
const endpoint = `${API_SERVER}${path}`;

export default function Demo() {
  const [eventSource, setEventSource] = useState();
  const [clients, setClients] = useState(0);
  const [logs, setLogs] = useState([]);

  const appendLogs = useCallback((...args) => setLogs((logs) => [...logs, [new Date().toISOString(), ...args].join(' ')]), []);

  useEffect(() => {
    let eventSource;
    function init() {
      console.log('endpoint', endpoint);
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
        appendLogs(`error, disconnected`);
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
      <div className="container">
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
        {clients}
      </div>
    </div>
  </>
}
