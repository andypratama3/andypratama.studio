/** Escapes a single CSV cell and neutralises spreadsheet formula injection. */
export function csvCell(value: string | null): string {
  if (!value) return ""
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}
