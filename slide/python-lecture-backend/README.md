# Python Lecture · Backend

Accounts, lesson progress and game history for the Python Lecture site.
Same stack as NGCP `common-backend`: Spring Boot 4, Java 25, Spring Security, JPA, Flyway, PostgreSQL, jjwt.

## Run locally

`local.properties` (git-ignored and excluded from Docker builds) holds the local settings: DB login, JWT secret, port 8090 and an optional
first teacher. Shared `application.properties` is safe to commit; Render supplies its credentials through environment variables. The `local` profile loads `local.properties`.

For a new checkout, copy `local.properties.example` to `local.properties` and enter your values. Existing local settings have been migrated. Then:

```sh
./scripts/create-local-db.sh   # once: creates the python_lecture role + database (asks for the postgres superuser password)
./scripts/run-local.sh         # starts the API on http://localhost:8090
```

The frontend's Vite dev server proxies `/api` to `http://localhost:8090`
(override with `API_PROXY_TARGET=http://localhost:<port> npm run dev`). Port 8080 is avoided
on purpose: NGCP's backend usually runs there.

## Tests

```sh
./mvnw test          # integration tests on an in-memory H2 database
./mvnw spotless:apply
```

## API (`/api/v1`)

| Method | Path | Who | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | anyone | Create a student account and sign in |
| POST | `/auth/login` | anyone | Sign in |
| POST | `/auth/refresh` | cookie | New access token (rotates the refresh cookie) |
| POST | `/auth/logout` | cookie | Revoke the session |
| GET | `/me` | signed in | Own profile |
| GET / PUT / DELETE | `/me/progress[/{lessonId}[/{sectionId}]]` | signed in | Own lesson progress |
| GET / POST | `/me/game-results` | signed in | Own game history (paged) / record a round |
| GET | `/me/game-results/best` | signed in | Own best round per game |
| GET | `/teacher/students[/{id}]` | teacher | Class overview / one student's progress and history |

## Security design

- **Passwords:** BCrypt (cost 12); 8–72 characters with a letter and a digit; emails are case-insensitive.
- **Access token:** HS256 JWT, valid for 15 minutes. It is returned in the response body and the frontend keeps it in memory only. The user is re-loaded on every request, so role changes and deletions apply immediately.
- **Refresh token:** 32 random bytes in an `HttpOnly; Secure; SameSite=Strict` cookie limited to `/api/v1/auth`. Only its SHA-256 hash is stored. It rotates on every refresh, and if an old token is replayed the whole session is revoked (with a 30-second grace window for two tabs refreshing at once). Logout revokes it for good.
- **CSRF:** the API itself uses Bearer tokens. The two cookie endpoints also require an `X-Requested-With` header, which cross-site forms cannot send.
- **Brute force:** 5 failed logins lock the account for 15 minutes. Login and register are limited to 60 requests per minute per IP. Unknown emails take as long as wrong passwords, so the response time doesn't reveal which emails exist.
- **Roles:** students can only read and write their own data. Teachers can't sign up through the API; the first one comes from `TEACHER_EMAIL` / `TEACHER_PASSWORD`.
- **Errors:** responses carry stable codes (`INVALID_CREDENTIALS`, …) and never stack traces or internal messages.

## Production checklist

- Serve the frontend and `/api` from the **same site** (reverse proxy or subdomains of one domain), over HTTPS.
- Set a strong, stable `JWT_SECRET` from a secret manager. Never commit it.
- Behind a proxy, set `server.forward-headers-strategy=framework` so rate limiting sees real client IPs.
- Game scores are calculated in the browser. The API rejects impossible values, but a determined student could still submit a fake score.

In IntelliJ, set the active Spring profile to `local` and the working directory to `python-lecture-backend`. From the command line, `./mvnw spring-boot:run -Dspring-boot.run.profiles=local` also works. Production must leave the `local` profile disabled.
