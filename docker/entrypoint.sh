#!/bin/sh

set -e

echo "Starting frontend"
echo "Link libraries"
npm link ./coghent-vue-3-component-library
# npm link ./session-vue-3-oidc-library
exec npm run serve