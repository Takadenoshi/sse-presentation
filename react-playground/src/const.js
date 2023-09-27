export const READY_STATES = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSED',
};

export const API_SERVER = process.env.REACT_APP_ENDPOINT ?? 'http://localhost:3001';
