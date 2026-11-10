/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MotionProvider } from "@/components/providers/motion-provider"
import { Reveal } from "@/components/brand/reveal"

describe("Reveal", () => {
  it("renders children visible before any scroll animation", () => {
    render(
      <MotionProvider>
        <Reveal>Proof line</Reveal>
      </MotionProvider>
    )
    expect(screen.getByText("Proof line")).toBeInTheDocument()
  })
})
