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

# CI/CD Pipeline & Security Scanning

This repository implements an automated Continuous Integration (CI) pipeline that checks out source code, installs dependencies, runs automated tests, builds a Docker image, and scans it for security vulnerabilities before deployment.

---

## 🔄 Pipeline Workflow

The pipeline runs sequentially through five key stages:
1. **Checkout Code:** Fetches the repository source code onto the CI runner.
2. **Install Dependencies:** Resolves and installs required packages (e.g., `npm ci`, `pip install`, `go mod download`).
3. **Run Tests:** Executes unit and integration test suites to verify functionality before containerization.
4. **Docker Build:** Packages the application and its runtime environment into a Docker container image.
5. **Trivy Security Scan:** Scans the newly created Docker image for OS/library vulnerabilities and misconfigurations.

---

## 🛠️ Prerequisites

To run this pipeline locally or configure it on a CI platform, ensure you have:

* **Git:** For source control checkout.
* **Node.js / Python / Go (Application Language):** Required for local testing and dependency installation.
* **Docker Engine:** Version 20.10+ required for container builds.
* **Trivy CLI:** Required for running local security scans. [Installation Guide](https://aquasecurity.github.io/trivy/latest/getting-started/installation/)

---

## 💻 Running Locally

You can execute the entire pipeline sequence locally using the following steps:

```bash
# 1. Checkout repository (or clone)
git clone [https://github.com/your-username/your-repo.git](https://github.com/your-username/your-repo.git)
cd your-repo

# 2. Install dependencies
npm ci

# 3. Run test suite
npm test

# 4. Build Docker image
docker build -t my-app:local .

# 5. Run Trivy vulnerability scan
trivy image --severity HIGH,CRITICAL my-app:local
- The image runs as a non-root user by default.
- No secrets are baked into the image; everything sensitive is injected at
  runtime, so candidates should be marked down if they hardcode `API_KEY`
  anywhere in the Dockerfile or source.
- `test.js` is a dependency-free smoke test so the CI pipeline's "Run Tests"
  stage has something real and fast to execute (`node test.js`).
