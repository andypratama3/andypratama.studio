/** Degrees to add so a swipe settles on a side face. */
export function yawAdjustToFace(total: number) {
  const normalized = ((total % 360) + 360) % 360
  const snapped = Math.round(normalized / 90) * 90
  let adjust = snapped - normalized
  if (adjust > 180) adjust -= 360
  if (adjust < -180) adjust += 360
  return adjust
}
