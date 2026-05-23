#!/usr/bin/env bash
# Seed the two default users (kumar-user, varsha-user) idempotently.
# Usage:  bash scripts/seed-defaults.sh [BASE_URL]
# Defaults: BASE_URL=http://localhost:3000
#
# Reads SEED_TOKEN from .env.local in the project root.

set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"

# Locate .env.local relative to the script
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found. Copy .env.local.example to .env.local and fill it in." >&2
  exit 1
fi

# Pull SEED_TOKEN out without sourcing the whole file (private key contains weird chars).
SEED_TOKEN="$(grep -E '^SEED_TOKEN=' "$ENV_FILE" | head -n1 | cut -d= -f2- | tr -d '"' || true)"
if [[ -z "$SEED_TOKEN" ]]; then
  echo "ERROR: SEED_TOKEN is empty in $ENV_FILE." >&2
  exit 1
fi

create_user() {
  local username="$1"
  local password="$2"
  local displayName="$3"
  echo "→ Seeding $username..."
  curl -sS -X POST "$BASE_URL/api/seed?token=$SEED_TOKEN" \
    -H 'Content-Type: application/json' \
    -d "{\"username\":\"$username\",\"password\":\"$password\",\"displayName\":\"$displayName\"}"
  echo
}

create_user "kumar-user"  "SecureHigh" "Kumar"
create_user "varsha-user" "SecureHigh" "Varsha"

echo "Done."
