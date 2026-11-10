/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Fact } from "@/components/brand/fact"

describe("<Fact />", () => {
  it("renders a stated fact value", () => {
    render(<Fact id="students" />)
    expect(screen.getByText("1,000+")).toBeTruthy()
  })
})
