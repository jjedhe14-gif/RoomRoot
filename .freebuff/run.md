# RoomRoot Dev Server

## Prerequisites

- MySQL running on `localhost:3306` with a `roomroot` database
  (see `roomroot-backend/src/main/resources/application.properties`).
- Node + npm (frontend) and a JDK 21+ (backend). `node_modules` must exist
  (`npm install`) and `roomroot-backend/target/` must be built by Maven.

## How to reproduce artifacts

1. Frontend: `cd /Users/jayesh/Documents/RoomRoot && npm install && npm run build`
   (builds `dist/` — includes the student app and the `/admin/*` console).
2. Backend jar:
   `cd roomroot-backend && ./mvnw -DskipTests package`
   → `roomroot-backend/target/roomroot-backend-0.0.1-SNAPSHOT.jar`.

## How to run the server

### Option A: Preview (static build, launchd — verified working)

```bash
# Prepare artifacts
mkdir -p /tmp/rr-app
rsync -a --delete dist/ /tmp/rr-app/dist/

# Frontend preview on :3001
launchctl submit -l com.roomroot.preview-3001 -- \
  /bin/sh -c "exec /opt/homebrew/bin/node /tmp/rr-app/server-3001.js > /tmp/rr-preview-3001.log 2>&1"

# Stop:
launchctl remove com.roomroot.preview-3001
```

Note: port 3000 may be held by another thread's preview. Use 3001 or higher.

### Option B: Full stack (static frontend + Spring Boot backend)

```bash
mkdir -p /tmp/rr-app
cp roomroot-backend/target/roomroot-backend-0.0.1-SNAPSHOT.jar /tmp/rr-app/
rsync -a --delete dist/ /tmp/rr-app/dist/
cp .freebuff/server.js /tmp/rr-app/server.js   # SPA fallback static server

# Backend (Spring Boot, :8080) — MySQL must be up
launchctl submit -l com.roomroot.backend -- \
  /bin/sh -c "exec /usr/bin/java -jar /tmp/rr-app/roomroot-backend-0.0.1-SNAPSHOT.jar > /tmp/rr-boot.log 2>&1"

# Stop:
launchctl remove com.roomroot.backend
```

Health checks: `curl http://localhost:8080/api/health`, `curl http://localhost:3001/`.

### Option C: Dev server (hot reload, backend optional)

```bash
# Backend
cd roomroot-backend && ./mvnw spring-boot:run   # :8080

# Frontend (Vite, :3000)
cd /Users/jayesh/Documents/RoomRoot && npx vite --port 3000 --host
```

## OTP / Email Configuration

The backend sends OTP emails via the EmailJS REST API, reusing the credentials
from the standalone OTP project (`/Users/jayesh/Documents/OTP/`). The OTP is
sent directly to the USER's email address — never to an admin.

Configuration in `application.properties`:
```
roomroot.email.js-public-key=${EMAILJS_PUBLIC_KEY:TO1RULgL1bEz9k0oV}
roomroot.email.js-service-id=${EMAILJS_SERVICE_ID:service_xj8d7el}
roomroot.email.js-template-id=${EMAILJS_TEMPLATE_ID:template_oo5843q}
```

Override via environment variables if needed. For local development without
the backend running, use the Discord/WhatsApp quick-login buttons on the
login page.
