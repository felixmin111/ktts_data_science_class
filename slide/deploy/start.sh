#!/usr/bin/env bash
set -euo pipefail

: "${PORT:=10000}"
export PORT
envsubst '${PORT}' < /app/nginx.conf.template > /etc/nginx/sites-enabled/default

# Keep the API private; nginx serves the app and API on Render's public port.
java -XX:MaxRAMPercentage=60 -XX:+ExitOnOutOfMemoryError -jar /app/app.jar \
    --server.port=8090 --server.address=127.0.0.1 \
    --server.forward-headers-strategy=framework \
    --spring.datasource.hikari.maximum-pool-size=3 \
    --spring.datasource.hikari.minimum-idle=0 &
api_pid=$!
nginx_pid=''
cleanup() {
    kill "$api_pid" ${nginx_pid:+"$nginx_pid"} 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 0' TERM INT

nginx -g 'daemon off;' &
nginx_pid=$!
# Shut down the whole service if either process exits.
wait -n "$api_pid" "$nginx_pid"
exit 1
