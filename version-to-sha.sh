#!/usr/bin/env bash
set -euo pipefail

command -v gh >/dev/null 2>&1 || { echo "Error: gh CLI not found. Install GitHub CLI first." >&2; exit 1; }

declare -A CACHE=()

resolve_sha() {
  local owner_repo="$1" ref="$2"
  local cache_key="${owner_repo}@${ref}"
  if [[ -z "${CACHE[$cache_key]:-}" ]]; then
    local sha
    sha="$(gh api "repos/${owner_repo}/commits/${ref}" --jq '.sha' 2>/dev/null)" || {
      echo "  Warning: could not resolve ${owner_repo}@${ref} (skipping)" >&2
      return 1
    }
    CACHE[$cache_key]="$sha"
  fi
  echo "${CACHE[$cache_key]}"
}

pin_file() {
  local file="$1"
  echo "Processing $file..."

  while IFS= read -r line; do
    # Skip lines that don't contain "uses:"
    [[ "$line" != *"uses:"* ]] && continue

    # Extract the token after "uses:" (no whitespace, strip trailing comment)
    local token
    token=$(echo "$line" | sed -E 's/.*uses:[[:space:]]+([^[:space:]#]+).*/\1/')
    [[ "$token" == "$line" ]] && continue  # no match

    # --- Format 1: reusable workflow with SHA concatenated directly (no @) ---
    # e.g. owner/repo/.github/workflows/foo.yml<40-char-sha> - skip, we only pin actions
    if [[ ${#token} -gt 40 ]] && [[ "${token: -40}" =~ ^[0-9a-fA-F]{40}$ ]]; then
      continue

    # --- Format 2: owner/repo/path@ref (standard @ syntax) ---
    # e.g. github/codeql-action/analyze@v3 or actions/checkout@abc123...
    elif [[ "$token" == *"@"* ]]; then
      local slug="${token%@*}"
      local ref="${token##*@}"
      local owner_repo
      owner_repo="$(echo "$slug" | cut -d/ -f1-2)"

      # Skip local and docker actions
      [[ "$slug" == "./"* || "$token" == "docker://"* ]] && continue

      # Skip reusable workflows (keep tag reference) — only pin actions to SHA
      if [[ "$slug" == *".github/workflows/"* ]]; then
        echo "  Skipped workflow (keeping tag): ${slug}@${ref}"
        continue
      fi

      # Migrate actions from hmpps-github-actions to hmpps-github-shared-actions
      local new_slug="$slug"
      local resolve_repo="$owner_repo"
      local ref_label="$ref"
      if [[ "$owner_repo" == "ministryofjustice/hmpps-github-actions" ]]; then
        new_slug="${slug/ministryofjustice\/hmpps-github-actions/ministryofjustice\/hmpps-github-shared-actions}"
        resolve_repo="ministryofjustice/hmpps-github-shared-actions"
        # For migration, always resolve from main of the new repo
        local new_sha
        new_sha="$(resolve_sha "$resolve_repo" "main")" || continue
        # Preserve the original tag label from the comment if present, otherwise use the ref
        local comment_label
        comment_label=$(echo "$line" | sed -n 's/.*#[[:space:]]*\(.*\)/\1/p' | xargs)
        [[ -n "$comment_label" ]] && ref_label="$comment_label" || ref_label="$ref"
        sed -i '' "s|${slug}@${ref}[[:space:]]*#.*|${new_slug}@${new_sha} # ${ref_label}|g; s|${slug}@${ref}$|${new_slug}@${new_sha} # ${ref_label}|g" "$file"
        echo "  Migrated action: ${slug}@${ref} -> ${new_slug}@${new_sha:0:7}"
        continue
      fi

      # Skip if already a full SHA (non-migration case)
      [[ "$ref" =~ ^[0-9a-fA-F]{40}$ ]] && continue

      local new_sha
      new_sha="$(resolve_sha "$resolve_repo" "$ref")" || continue

      sed -i '' "s|${slug}@${ref}[[:space:]]*#.*|${new_slug}@${new_sha} # ${ref}|g; s|${slug}@${ref}$|${new_slug}@${new_sha} # ${ref}|g" "$file"
      echo "  Pinned action: ${slug}@${ref} -> ${new_sha:0:7}"
    fi

  done < "$file"
}

mapfile -t workflow_files < <(find .github -name "*.yml" -o -name "*.yaml" 2>/dev/null | sort)

if [[ ${#workflow_files[@]} -eq 0 ]]; then
  echo "No workflow files found under .github/" >&2
  exit 1
fi

for file in "${workflow_files[@]}"; do
  pin_file "$file"
done

echo "Done."
