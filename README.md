# Smart Real-Time DevOps Monitoring Dashboard (NexusOps)

This is a production-grade, cloud-native web application providing real-time monitoring and logging using a containerized microservices architecture. It includes a fully automated CI/CD pipeline ensuring seamless deployment with near-zero downtime.

## 🌟 Premium Features
- **Microservices Architecture:** Independently scalable Frontend (React+Vite), Backend API (Node.js/Express), and Hardware Monitoring Service (Node.js).
- **Beautiful Glassmorphism UI:** Built with custom vanilla CSS features like blur backdrops, pulse animations, and real-time updating smooth progress bars.
- **Auto-Healing Containers:** Managed by Docker-Compose with `restart: always` and health checks.
- **Nginx Reverse Proxy:** Secures internal traffic mapping and handles cross-origin proxying via a single port.
- **Infrastructure as Code (Bonus):** Complete Terraform provisioning scripts to deploy an Ubuntu AWS EC2 ready for Docker.
- **CI/CD Pipeline:** Fully configured GitHub Actions workflow deploying updates via Docker Hub.

---

## 🚀 Local Development setup

1. **Clone the repository.**
2. **Launch with Docker Compose:**
   ```bash
   docker-compose up --build
   ```
3. Wait for the containers to spin up.
4. **Access the application:**
   - Frontend Dashboard: `http://localhost:8080/` (Through external Nginx proxy) or `http://localhost:80/` (Direct Frontend mapping)
   - Backend API: `http://localhost:8080/api/status`
   - Monitoring Metrics: `http://localhost:8080/monitor/metrics`

---

## ☁️ Cloud Deployment (AWS EC2)

### 1. Provision Infrastructure
Use the provided Terraform scripts to dynamically provision your EC2 instance with Docker pre-installed.
```bash
cd terraform
terraform init
terraform apply -var="key_name=YOUR_AWS_SSH_KEY_NAME"
```

### 2. Configure GitHub Secrets
Go to your GitHub repository -> Settings -> Secrets and variables -> Actions.
Add the following repository secrets:
* `DOCKER_USERNAME`: Your Docker Hub username.
* `DOCKER_PASSWORD`: Your Docker Hub Access Token.
* `EC2_HOST`: The Public Elastic IP outputted by Terraform.
* `EC2_USER`: Default `ubuntu` for Ubuntu EC2.
* `EC2_SSH_KEY`: The raw private SSH key content used to access the server (`.pem` format).

### 3. Deploy
Push changes to the `main` branch. GitHub Actions will automatically:
- Build Multi-Stage Docker containers.
- Push images to Docker Hub.
- SSH into the provisioned EC2.
- Pull the newest containers and perform a secure rolling update utilizing `docker-compose`.

---

## 💡 Concept Explanation: Auto-Scaling and Rolling Deployments

### Zero-Downtime Rolling Updates
In our containerized environment, the CI/CD pipeline employs `docker-compose up -d --remove-orphans`. Here’s why this is impactful for continuous operations:
1. Docker Compose identifies if any image layers have changed without dropping traffic.
2. It creates the new updated container before directing traffic away from the old one, ensuring no active requests enter a dead end.
3. If the health checks fail on the new container, Docker will rollback or restart.

### How we would achieve Cloud Auto-Scaling
Although currently provisioned as a monolithic entrypoint (one EC2 server orchestrating containers), the microservices design lays the foundational bedrock for Horizontal Auto-Scaling. To enable Auto-Scaling on this project architecture:
1. Move the `docker-compose` manifest to **AWS ECS** (Elastic Container Service) or **AWS EKS** (Kubernetes).
2. Attach an Application Load Balancer (ALB) acting in place of the Nginx Gateway.
3. Configure **Auto Scaling Groups (ASGs)** utilizing CloudWatch. If Average CPU utilization crosses >75% for 3 minutes, the ASG will spin up additional identical Backend or Frontend containers to divide the traffic burden automatically without manual oversight.
