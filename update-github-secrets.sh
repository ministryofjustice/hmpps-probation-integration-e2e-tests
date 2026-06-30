#!/usr/bin/env bash
set -euo pipefail
##
## Copy passwords from 1Password into GitHub repository secrets for use in CI
##
## Usage:
##    gh auth login
##    op signin --account ministryofjustice.1password.eu
##    ./update-github-secrets.sh
##
## Requires: GitHub CLI (`gh`), 1Password CLI (`op`)
##

grep -E '^[A-Za-z_][A-Za-z0-9_]*="op://' '.env.1password' | while IFS='=' read -r var raw_path; do
  # strip quotes
  op_path="${raw_path%\"}"
  op_path="${op_path#\"}"
  # set secret
  gh secret set "E2E_$var" --body "$(op read --account ministryofjustice.1password.eu "$op_path")"
done

echo Done