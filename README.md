# Junior DevOps Engineer – Sample App

A deliberately minimal Node.js/Express app, built to give candidates something
real to containerize, deploy, and monitor — without spending assessment time
writing application code.



## Build & run locally

```bash
docker build -t myapp .
docker run -p 8080:8080 -e APP_MESSAGE="Hello Kubernetes" -e API_KEY="dummy" myapp

```

## Suggested Kubernetes wiring

- **ConfigMap**: `APP_MESSAGE`, `PORT`
- **Secret**: `API_KEY`
- **Readiness probe**: `GET /readyz`
- **Liveness probe**: `GET /healthz`
- **Service**: expose port 8080
- **Prometheus**: scrape `/metrics`

## CI Pipeline
Checkout
↓
Install Dependencies
↓
Run Tests
↓
Docker Build
↓
Trivy Security Scan
- The image runs as a non-root user by default.
- No secrets are baked into the image; everything sensitive is injected at
  runtime, so candidates should be marked down if they hardcode `API_KEY`
  anywhere in the Dockerfile or source.
- `test.js` is a dependency-free smoke test so the CI pipeline's "Run Tests"
  stage has something real and fast to execute (`node test.js`).
