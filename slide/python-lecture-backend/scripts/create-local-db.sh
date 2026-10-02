#!/usr/bin/env bash
# One-time setup: creates the python_lecture role and database in your local PostgreSQL,
# using the password stored in .env.local. Asks for the PostgreSQL superuser password.
set -euo pipefail
cd "$(dirname "$0")/.."

set -a; source .env.local; set +a
PSQL="${PSQL:-/Library/PostgreSQL/16/bin/psql}"
[ -x "$PSQL" ] || PSQL="$(command -v psql)"
SUPERUSER="${PG_SUPERUSER:-postgres}"

"$PSQL" -h localhost -U "$SUPERUSER" -d postgres -v ON_ERROR_STOP=1 \
  -v role="$DB_USERNAME" -v password="$DB_PASSWORD" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'role', :'password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'role') \gexec
SELECT format('ALTER ROLE %I PASSWORD %L', :'role', :'password') \gexec
SELECT format('CREATE DATABASE python_lecture OWNER %I', :'role')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'python_lecture') \gexec
SQL
echo "Database python_lecture is ready for role $DB_USERNAME."
