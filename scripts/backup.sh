#!/usr/bin/env bash
set -euo pipefail

# Database backup for andypratama.studio
# Usage:
#   DATABASE_URL=mysql://user:pass@host:3306/db GPG_RECIPIENT="owner@example.com" ./scripts/backup.sh
#   BACKUP_ENCRYPT=0 BACKUP_DIR=./tmp/backups ./scripts/backup.sh   # local test only
#
# Retention: files older than BACKUP_RETENTION_DAYS (default 14) are removed.

BACKUP_DIR="${BACKUP_DIR:-./backups}"
GPG_RECIPIENT="${GPG_RECIPIENT:-andypratamaworkspace@gmail.com}"
BACKUP_ENCRYPT="${BACKUP_ENCRYPT:-1}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ DATABASE_URL not set. Set it before running backup."
  exit 1
fi

DB_URL="${DATABASE_URL#mysql://}"
AUTH="${DB_URL%%@*}"
HOSTPORT_DB="${DB_URL#*@}"
DB_USER="${AUTH%%:*}"
DB_PASS="${AUTH#*:}"
DB_HOSTPORT="${HOSTPORT_DB%%/*}"
DB_NAME="${HOSTPORT_DB#*/}"
DB_HOST="${DB_HOSTPORT%%:*}"
DB_PORT="${DB_HOSTPORT##*:}"
[ "$DB_PORT" = "$DB_HOSTPORT" ] && DB_PORT=3306
DB_NAME="${DB_NAME%%\?*}"

DUMP_FILE="${BACKUP_DIR}/${DB_NAME}-${TIMESTAMP}.sql"
ENC_FILE="${DUMP_FILE}.gpg"

mkdir -p "$BACKUP_DIR"

if [ "$BACKUP_ENCRYPT" = "1" ]; then
  if ! gpg --list-keys "$GPG_RECIPIENT" >/dev/null 2>&1; then
    echo "❌ GPG public key for ${GPG_RECIPIENT} not found."
    echo "   Import one, set GPG_RECIPIENT, or run with BACKUP_ENCRYPT=0 (local only)."
    exit 1
  fi
fi

echo "🗄️  Dumping ${DB_NAME} from ${DB_HOST}:${DB_PORT}..."
mysqldump \
  -u "$DB_USER" -p"$DB_PASS" -h "$DB_HOST" -P "$DB_PORT" \
  --single-transaction --quick --routines --no-tablespaces \
  --set-gtid-purged=OFF \
  "$DB_NAME" > "$DUMP_FILE" 2>/dev/null

chmod 600 "$DUMP_FILE"

if [ "$BACKUP_ENCRYPT" = "1" ]; then
  echo "🔐 Encrypting with ${GPG_RECIPIENT}..."
  gpg --batch --yes --trust-model always --recipient "$GPG_RECIPIENT" --encrypt "$DUMP_FILE"
  rm -f "$DUMP_FILE"
  echo "✅ Backup complete: ${ENC_FILE}"
else
  echo "⚠️  BACKUP_ENCRYPT=0 — plaintext dump kept at ${DUMP_FILE}"
  echo "✅ Backup complete: ${DUMP_FILE}"
fi

if [ "$BACKUP_RETENTION_DAYS" -gt 0 ]; then
  find "$BACKUP_DIR" -maxdepth 1 -type f \( -name "*.sql" -o -name "*.sql.gpg" \) \
    -mtime "+${BACKUP_RETENTION_DAYS}" -print -delete
fi
