# Local development and deployment

The app has separate API settings for local development and the installable
Railway-connected Android APK:

- Expo local development reads `frontend/.env` (ignored by Git). Its example
  points to the local backend.
- The EAS `preview` profile sets `EXPO_PUBLIC_API_URL` to the Railway API URL
  and builds an APK with `npm run build:apk`.
- The backend runs locally on port `8080` or on Railway's assigned `PORT`.
- Railway launches the backend with its `railway` Spring profile, which
  requires Railway database credentials and a production JWT secret. Local
  runs keep using the existing local defaults.

The frontend requires `EXPO_PUBLIC_API_URL` and fails fast if it is missing,
rather than silently sending local requests to production.

## Run locally

1. Start local PostgreSQL with database `attendance_db`, then run:

   ```sh
   cd backend
   ./mvnw spring-boot:run
   ```

   The backend reads its local database connection defaults from
   `src/main/resources/application.properties`. Override them with
   `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` if your local PostgreSQL differs.

2. Configure the local frontend URL:

   ```sh
   cd frontend
   cp .env.example .env
   ```

   `.env.example` defaults to `http://10.0.2.2:8080/api` for the Android
   emulator. Use `http://localhost:8080/api` for the iOS simulator, or your
   computer's LAN IP (for example, `http://192.168.1.20:8080/api`) for a
   physical device connected to the same network.

3. Start Expo:

   ```sh
   npm run start:local
   ```

## Deploy the backend to Railway

Create a Railway project with a PostgreSQL service and a backend service linked
to this repository:

1. Set the backend service's **Root Directory** to `/backend`. The included
   `railway.toml` selects the Dockerfile build, starts Spring with the
   `railway` profile, and configures the `/health` health check.
2. Set the backend service variables. Use Railway's variable references to
   your PostgreSQL service (replace `Postgres` with its exact service name):

   ```text
   DB_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   DB_USERNAME=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   JWT_SECRET=<a unique base64-encoded secret of at least 32 bytes>
   ```

   Generate a JWT secret locally with `openssl rand -base64 32` and enter the
   result directly in Railway. Do not commit production credentials or use
   local database/JWT values for Railway. The Railway profile intentionally
   fails to start if any required variable is missing.
3. Deploy and wait for the `/health` check to pass. Generate a public domain for
   the backend service. The API base URL used by the mobile app is that domain
   plus `/api` (for example, `https://<your-service>.up.railway.app/api`).

## Build the APK with Expo EAS

The EAS `preview` profile builds an internal-distribution Android APK and sets
its API URL to the configured Railway service. Run:

```sh
cd frontend
npm run build:apk
```

Sign in to Expo/EAS when prompted, then download the APK from the build result.
If Railway gives the backend a different domain, update the URL in
`frontend/eas.json` before building. The local `.env` setting does not change
the URL in this EAS profile.
