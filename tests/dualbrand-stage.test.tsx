/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DualBrandStage } from "@/components/brand/dualbrand-stage"

const layers = [
  { id: "parent", label: "Parent brand" },
  { id: "child-a", label: "Child brand A" },
  { id: "child-b", label: "Child brand B" },
]

describe("DualBrandStage", () => {
  it("keeps every package item while the selected brand changes", async () => {
    const user = userEvent.setup()
    render(
      <DualBrandStage
        groupLabel="Brand view"
        layers={layers}
        title="One parent brand. Two child brands."
        lead="A ready-made website package."
        items={["Source files", "License"]}
      />
    )

    expect(screen.getByRole("radio", { name: "Parent brand" })).toHaveAttribute("aria-checked", "true")
    expect(screen.getByText("Source files")).toBeInTheDocument()
    expect(screen.getByText("License")).toBeInTheDocument()

    await user.click(screen.getByRole("radio", { name: "Child brand B" }))
    expect(screen.getByRole("radio", { name: "Child brand B" })).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("radio", { name: "Parent brand" })).toHaveAttribute("aria-checked", "false")
    expect(screen.getByText("Source files")).toBeInTheDocument()
  })
})
