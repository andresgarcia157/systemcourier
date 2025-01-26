#!/bin/bash
export NODE_OPTIONS="--max-old-space-size=4096"
rm -rf .next
NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production npx next build
