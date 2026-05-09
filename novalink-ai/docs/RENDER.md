# Render Deployment

NovaLink uses two Render web services:

- `novalink-backend`: Express, Socket.IO, MongoDB Atlas.
- `novalink-frontend`: Next.js.

## Backend service

Use these settings if you create it manually:

- Root directory: repo root
- If deploying from the `rashmiranjanaiet/video` repo, set Root Directory to `novalink-ai`
- Build command: `npm ci && npm run build --workspace=backend`
- Start command: `npm start --workspace=backend`

Environment variables:

- `NODE_ENV=production`
- `DATABASE_URL=<your MongoDB Atlas URI with /novalink database name>`
- `JWT_SECRET=<long random secret>`
- `JWT_EXPIRE=7d`
- `FRONTEND_URL=https://<your-frontend-service>.onrender.com`
- `LOG_LEVEL=info`

## Frontend service

Use these settings if you create it manually:

- Root directory: repo root
- If deploying from the `rashmiranjanaiet/video` repo, set Root Directory to `novalink-ai`
- Build command: `npm ci && npm run build --workspace=frontend`
- Start command: `npm start --workspace=frontend`

Environment variables:

- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL=https://<your-backend-service>.onrender.com`
- `NEXT_PUBLIC_SOCKET_URL=https://<your-backend-service>.onrender.com`

After both services are created, update the backend `FRONTEND_URL` to the exact frontend Render URL, then redeploy the backend.
