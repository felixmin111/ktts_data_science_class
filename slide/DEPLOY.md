# Free deployment: Render + Neon

One Render Docker service serves both the Vue site and Spring Boot API from the
same HTTPS address. Neon stores accounts, progress and game history. Both use
free plans; stay within their usage limits and use the included Render address.
The backend sleeps when idle, so the first visit can be slow.

## Deploy

1. Create a free Neon project in Singapore (or the nearest available region).
   In its Connect dialog, select Java/JDBC and copy the database settings.
2. Commit and push the application and these deployment files to the existing
   GitHub repository. Do not commit `python-lecture-backend/.env.local` or secrets.
3. In Render, choose **New > Blueprint**, connect
   `felixmin111/ktts_data_science_class`, and set **Blueprint Path** to
   `slide/render.yaml`. The paths in this file are relative to the GitHub repo
   root, which contains the `slide` directory.
4. Enter the prompted secrets in Render:

   | Variable | Value |
   | --- | --- |
   | `DB_URL` | `jdbc:postgresql://YOUR_NEON_HOST/neondb?sslmode=require` (use your actual database name) |
   | `DB_USERNAME` | Neon database role |
   | `DB_PASSWORD` | Neon database password |
   | `TEACHER_EMAIL` | Your teacher login email |
   | `TEACHER_PASSWORD` | A strong password with a letter and digit, 8–72 characters |

   Keep credentials separate from the JDBC URL. Render generates `JWT_SECRET`.
   Do not paste passwords into chat. No Render database or paid service is needed.
5. Deploy, open the supplied HTTPS address, log in as the teacher, and create
   student accounts via Register. Verify a completed lesson and quiz still appear
   after logout/login. Refresh a lesson page to check direct links work.

## Local container check

From `slide`, with Docker running:

```sh
docker build -t ktts-python-lecture .
docker run --rm -p 10000:10000 --env-file python-lecture-backend/.env.local ktts-python-lecture
```

For this HTTP-only local check, set `COOKIE_SECURE=false` in the container's
environment. A local database must be reachable from Docker (use
`host.docker.internal` rather than `localhost` in `DB_URL`). Production keeps
secure cookies enabled. Never change the production JWT secret casually: it
invalidates existing access tokens.
