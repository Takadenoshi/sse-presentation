export const READY_STATES = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSED',
};

export const EMOJI_MAP = {
  1: "🙂",
  2: "😆",
  3: "🤠",
  4: "😱",
  5: "🙃",
  6: "🥸",
}

export const API_SERVER = process.env.REACT_APP_ENDPOINT ?? 'http://localhost:3001';
