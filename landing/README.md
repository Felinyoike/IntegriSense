## Running This Project with Docker

This project is a static web application (HTML, CSS, JS) served using **nginx:1.25-alpine** in Docker. The setup is designed for production use, running nginx as a non-root user for improved security.

### Requirements
- Docker and Docker Compose installed
- No environment variables are required by default (the `.env` file is optional and not used unless you uncomment the relevant line in `docker-compose.yml`)
- Uses **nginx:1.25-alpine** as the base image

### Build and Run Instructions
1. **Build and start the application:**
   ```sh
   docker compose up --build
   ```
   This will build the Docker image and start the `javascript-app` service.

2. **Access the application:**
   - The static site will be available at [http://localhost](http://localhost) (port 80).

### Configuration Details
- **Static files** (`index.html`, `script.js`, `styles.css`, and the `images/` directory) are copied into the nginx web root at build time.
- The container runs as a non-root user (`appuser`) for security.
- No volumes or external dependencies are required.
- If you need to use environment variables, create a `.env` file and uncomment the `env_file` line in `docker-compose.yml`.

### Ports
- **80:80** – The application is exposed on port 80 of your host machine.

---

*This section was updated to reflect the current Docker-based setup for this project.*