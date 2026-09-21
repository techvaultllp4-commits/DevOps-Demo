const express = require('express');
const os = require('os');
const client = require('prom-client');

const app = express();

// ---- Configuration via environment variables ----
// PORT and APP_MESSAGE are intended to come from a ConfigMap in Kubernetes.
// API_KEY is intended to come from a Secret. It is never logged or returned raw.
const PORT = process.env.PORT || 8080;
const APP_MESSAGE = process.env.APP_MESSAGE || 'Hello from the Junior DevOps sample app!';
const API_KEY = process.env.API_KEY || '';

// ---- Prometheus metrics ----
const register = new client.Registry();
client.collectDefaultMetrics({ register }); // process CPU, memory, event loop lag, etc.

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestCounter);

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// Simulate a short startup delay so readiness vs liveness actually behaves differently.
let isReady = false;
const STARTUP_DELAY_MS = Number(process.env.STARTUP_DELAY_MS || 5000);
setTimeout(() => { isReady = true; }, STARTUP_DELAY_MS);

// ---- Routes ----
app.get('/', (req, res) => {
  res.json({
    message: APP_MESSAGE,
    hasApiKey: Boolean(API_KEY), // proves the Secret was mounted, without leaking it
    hostname: os.hostname(),     // useful for demonstrating load-balancing across replicas
    timestamp: new Date().toISOString(),
  });
});

// Liveness: is the process alive at all? Should almost never fail once started.
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Readiness: is the app ready to serve traffic? False during simulated startup.
app.get('/readyz', (req, res) => {
  if (isReady) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

// Metrics endpoint for Prometheus to scrape.
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
