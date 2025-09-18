#!/bin/bash

set -e

pnpm add -dw tsx
pnpm i --frozen-lockfile
pnpm update-version

pnpm build

cd packages/core
npm publish
cd -

echo "✅ publish core package done"