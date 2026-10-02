#!/usr/bin/env bash
# One-time setup: creates the python_lecture role and database in your local PostgreSQL,
# using the password stored in local.properties. Asks for the PostgreSQL superuser password.
set -euo pipefail
cd "$(dirname "$0")/.."

# Read values as data: Java properties files are not shell scripts.
read_property() {
    python3 - "$1" <<'PY'
import sys
from pathlib import Path
for line in Path('local.properties').read_text().splitlines():
    if line.strip().startswith(('#', '!')) or '=' not in line:
        continue
    key, value = line.split('=', 1)
    if key.strip() == sys.argv[1]:
        print(value.strip())
        break
else:
    raise SystemExit('Missing property: ' + sys.argv[1])
PY
}
DB_USERNAME="$(read_property DB_USERNAME)"
DB_PASSWORD="$(read_property DB_PASSWORD)"
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
