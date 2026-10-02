#!/usr/bin/env bash
# Starts the API with the local profile and private local.properties settings.
set -euo pipefail
cd "$(dirname "$0")/.."
if [ ! -f local.properties ]; then
    echo 'Missing local.properties. Copy local.properties.example and fill in your settings.' >&2
    exit 1
fi
export JAVA_HOME="${JAVA_HOME:-$(/usr/libexec/java_home -v 25)}"
exec ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
