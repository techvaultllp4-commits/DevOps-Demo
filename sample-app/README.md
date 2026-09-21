# Junior DevOps Engineer – Sample App

A deliberately minimal Node.js/Express app, built to give candidates something
real to containerize, deploy, and monitor — without spending assessment time
writing application code.

## What it does

| Endpoint   | Purpose                                                              |
|------------|-----------------------------------------------------------------------|
| `GET /`        | Returns a JSON message, hostname, and whether an API key is set     |
| `GET /healthz` | Liveness probe target — returns 200 once the process is up          |
| `GET /readyz`  | Readiness probe target — returns 503 for the first few seconds, then 200 (simulates real startup) |
| `GET /metrics` | Prometheus-formatted metrics (CPU, memory, event loop, request count) |

## Environment variables

| Variable          | Meant to come from | Description                          |
|-------------------|---------------------|---------------------------------------|
| `PORT`            | ConfigMap           | Port the app listens on (default 8080)|
| `APP_MESSAGE`     | ConfigMap           | Message returned by `/`               |
| `API_KEY`         | Secret              | Never logged or echoed back raw       |
| `STARTUP_DELAY_MS`| (optional)          | Simulated startup delay, default 5000 |

This split is intentional — it gives candidates a genuine reason to create
both a ConfigMap and a Secret in Task 4, rather than one of them being empty
busywork.

## Build & run locally

```bash
docker build -t myapp .
docker run -p 8080:8080 -e APP_MESSAGE="Hello Kubernetes" -e API_KEY="dummy" myapp
curl http://localhost:8080/
curl http://localhost:8080/healthz
curl http://localhost:8080/readyz
curl http://localhost:8080/metrics
```

## Suggested Kubernetes wiring

- **ConfigMap**: `APP_MESSAGE`, `PORT`
- **Secret**: `API_KEY`
- **Readiness probe**: `GET /readyz`
- **Liveness probe**: `GET /healthz`
- **Service**: expose port 8080
- **Prometheus**: scrape `/metrics`

## Notes for evaluators

- The image runs as a non-root user by default.
- No secrets are baked into the image; everything sensitive is injected at
  runtime, so candidates should be marked down if they hardcode `API_KEY`
  anywhere in the Dockerfile or source.
- `test.js` is a dependency-free smoke test so the CI pipeline's "Run Tests"
  stage has something real and fast to execute (`node test.js`).
