#!/bin/sh

set -e

echo "Starting frontend"
npm link ./coghent-vue-3-component-library &&
npm link ./session-vue-3-oidc-library &&
exec npm run serve