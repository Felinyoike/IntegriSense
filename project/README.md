## Running the Project with Docker

This project includes a Docker setup for building and running the TypeScript/Vite frontend application in a production-ready environment.

### Project-Specific Docker Requirements
- **Node.js Version:** Uses Node.js `22.13.1-slim` (configurable via the `NODE_VERSION` build argument in the Dockerfile).
- **Build Process:** The Dockerfile builds the static files using `npm run build` and installs only production dependencies for the final image.
- **User Security:** Runs the app as a non-root user (`appuser`).

### Environment Variables
- No required environment variables are set by default in the Dockerfile or `docker-compose.yml`.
- If you need to provide environment variables, uncomment and use the `env_file: ./.env` line in the `docker-compose.yml`.

### Build and Run Instructions
1. **Build and start the app:**
   ```sh
   docker compose up --build
   ```
   This will build the Docker image and start the `typescript-app` service.

2. **Access the app:**
   - The app will be available at [http://localhost:4173](http://localhost:4173) by default.

### Ports
- **4173:** Exposed by the container and mapped to the host (default Vite preview port).

### Special Configuration
- No external dependencies or volumes are required for production.
- For development with hot-reloading, you may mount the source code as a volume (see commented `volumes` section in `docker-compose.yml`).

---
