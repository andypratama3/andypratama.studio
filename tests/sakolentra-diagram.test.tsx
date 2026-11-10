/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MotionProvider } from "@/components/providers/motion-provider"
import { SakolentraDiagram } from "@/components/brand/sakolentra-diagram"

const nodes = [
  { step: "01", title: "Billing", description: "Tuition and school fee schedule" },
  { step: "02", title: "Pay via bank", description: "A unique pay number per student" },
]

describe("SakolentraDiagram", () => {
  it("selects a step and keeps the full description", async () => {
    const user = userEvent.setup()
    render(
      <MotionProvider>
        <SakolentraDiagram title="Flow" subtitle="Bill to parent" nodes={nodes} />
      </MotionProvider>
    )

    const first = screen.getByRole("radio", { name: /billing/i })
    const second = screen.getByRole("radio", { name: /pay via bank/i })
    expect(first).toHaveAttribute("aria-checked", "true")
    expect(second).toHaveAttribute("aria-checked", "false")
    expect(second).toHaveTextContent("A unique pay number per student")

    await user.click(second)
    expect(second).toHaveAttribute("aria-checked", "true")
    expect(first).toHaveAttribute("aria-checked", "false")
  })
})
