/** Each word owns its own slice of the scroll. Peaks do not stack. */
export function wordNeonWindow(index: number, count: number) {
  const slot = 1 / Math.max(count, 1)
  const start = index * slot
  const end = start + slot
  return { start, mid: (start + end) / 2, end }
}
