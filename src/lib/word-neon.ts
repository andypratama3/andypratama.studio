/** Each word owns its own slice of the scroll. Peaks do not stack. */
export function wordNeonWindow(index: number, count: number) {
  const slot = 0.78 / Math.max(count, 1)
  const start = 0.06 + index * slot
  const end = Math.min(0.98, start + slot * 0.92)
  return { start, mid: (start + end) / 2, end }
}
