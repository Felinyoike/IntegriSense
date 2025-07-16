## Running This Project with Docker

This project is containerized using Docker and Docker Compose for easy deployment and consistent environments. Below are the instructions and details specific to this project:

### Project-Specific Docker Requirements
- **Python Version:** 3.9 (as specified in the Dockerfile: `FROM python:3.9-slim`)
- **System Dependencies:** Installs `build-essential` and `libpq-dev` (for building Python packages and PostgreSQL support, though no external DB is configured by default)
- **Virtual Environment:** The application runs inside a Python virtual environment created during the build process.
- **Static Files:** Static files are collected during the build (`python manage.py collectstatic --noinput`).

### Environment Variables
- The following environment variables are set in the Dockerfile:
  - `PYTHONDONTWRITEBYTECODE=1`
  - `PYTHONUNBUFFERED=1`
  - `DJANGO_ENV=production`
  - `PIP_CACHE_DIR=/root/.cache/pip`
- **No required environment variables** are specified in the Docker or Compose files for this project. If you use a `.env` file, uncomment the `env_file` line in `docker-compose.yml` and provide your variables as needed.

### Build and Run Instructions
1. **Build and start the application:**
   ```sh
   docker-compose up --build
   ```
   This will build the Docker image and start the Django application in a container named `python-web`.

2. **Access the application:**
   - The Django app will be available at [http://localhost:8000](http://localhost:8000) on your host machine.

### Ports
- **8000:** The Django application is exposed on port 8000 (`ports: - "8000:8000"`).

### Special Configuration Notes
- **No external database service** is configured by default. The project uses a local `db.sqlite3` file. If you wish to use a different database (e.g., PostgreSQL), you will need to:
  - Add a database service to `docker-compose.yml`
  - Update `Website/settings.py` accordingly
  - Uncomment and configure the `depends_on` and `environment` sections in the Compose file
- **Static and media directories** are created and permissions set for the non-root user `appuser`.
- **No code mounting/volume for live reload** is enabled by default. Uncomment and configure the `volumes` section in `docker-compose.yml` if you need this for development.

---

_If you update the Docker or Compose files, please ensure this section stays in sync with any changes to the build or run process._
