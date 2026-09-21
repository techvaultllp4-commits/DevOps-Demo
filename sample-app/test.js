// Minimal smoke test — no test framework dependency, keeps CI fast and simple.
// Candidates are welcome to replace this with Jest/Mocha if they prefer.

const http = require('http');
const { spawn } = require('child_process');

const PORT = 8099;
const server = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: String(PORT), STARTUP_DELAY_MS: '0' },
  stdio: 'inherit',
});

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  await new Promise((r) => setTimeout(r, 800)); // let the server boot

  try {
    const health = await get('/healthz');
    if (health.status !== 200) throw new Error(`/healthz returned ${health.status}`);

    const ready = await get('/readyz');
    if (ready.status !== 200) throw new Error(`/readyz returned ${ready.status}`);

    const root = await get('/');
    if (root.status !== 200) throw new Error(`/ returned ${root.status}`);

    console.log('All smoke tests passed.');
    process.exitCode = 0;
  } catch (err) {
    console.error('Test failed:', err.message);
    process.exitCode = 1;
  } finally {
    server.kill();
  }
}

run();
