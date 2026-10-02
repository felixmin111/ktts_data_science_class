#!/usr/bin/env bash
# Starts the API with the settings in .env.local (http://localhost:8090 by default).
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; source .env.local; set +a
export JAVA_HOME="${JAVA_HOME:-$(/usr/libexec/java_home -v 25)}"
exec ./mvnw spring-boot:run
