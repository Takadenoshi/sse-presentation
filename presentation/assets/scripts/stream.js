const sse = new SSE('http://localhost:3001');

sse.on('clients', ({ data }) => {
  const numElem = document.getElementById('num-clients');
  numElem.innerText = data;
});
