DevSecOps Node.js CI/CD & Monitoring Pipeline

A simple, secure DevSecOps pipeline for a Node.js application deployed on Kubernetes (Minikube) using Helm, with security scanning via Trivy and observability using Prometheus and Grafana.

🏗️ Tech Stack

Application: Node.js (Port 8080)

Version Control: GitHub

CI/CD Automation: Jenkins

Containerization: Docker

Security Scanning: Trivy

Orchestration: Kubernetes (Minikube)

Deployment Manager: Helm (2 Replicas)

Monitoring & Metrics: Prometheus & Grafana

🛠️ Project Architecture Workflow

Developer: Pushes code changes to GitHub.

Jenkins: Triggers the pipeline automatically.

Containerization: Builds the Docker image for the Node.js application.

Security Scan: Uses Trivy to scan the Docker image for vulnerabilities before deployment.

Helm Deployment: Deploys the application to Minikube with 2 replicas.

Monitoring: Prometheus scrapes application and cluster metrics; Grafana displays visual dashboards.

🚀 Getting Started

Prerequisites

Ensure you have the following installed locally or on your server:

Node.js (v18+)

Docker

Jenkins

Trivy

Minikube & kubectl

Helm

🔧 Local Setup & Running

1. Run Node.js Application Locally

# Install dependencies
npm install

# Start application
npm start


The app will run on http://localhost:8080.

2. Docker Build & Run

# Build Docker image
docker build -t nodejs-devsecops-app:latest .

# Scan image using Trivy
trivy image nodejs-devsecops-app:latest

# Run Docker container locally
docker run -d -p 8080:8080 nodejs-devsecops-app:latest


☸️ Kubernetes & Helm Deployment

1. Start Minikube

minikube start


2. Deploy Application via Helm

# Install / Upgrade Helm Release
helm upgrade --install nodejs-app ./helm-chart --set replicaCount=2

# Check deployed pods (Should display 2 running replicas)
kubectl get pods


3. Access Application

minikube service nodejs-app-service --url


📊 Monitoring Setup (Prometheus & Grafana)

Add Prometheus Helm Repository:

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update


Deploy Monitoring Stack:

helm install monitoring prometheus-community/kube-prometheus-stack
Access Prometheus Dashboard:
kubectl port-forward pod/prometheus-prometheus-stack-kube-prom-prometheus-0 9090:9090 -n monitoring
Access Grafana Dashboard:

kubectl port-forward svc/monitoring-grafana 3000:80


Open http://localhost:3000 in your browser.

📝 License

This project is open-source and available under the MIT License.
