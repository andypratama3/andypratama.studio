/** @vitest-environment jsdom */
/**
 * PracticeCube native-drag regression.
 *
 * Root cause: the cube faces are links (`<a href>`). Dragging a face in Chromium
 * starts the native HTML5 drag-and-drop, which fires `pointercancel` and aborts
 * the rotation gesture before the drag reaches its snap target.
 */
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { PracticeCube, type PracticeFace } from "@/components/brand/practice-cube"

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverStub)

vi.mock("@/i18n/routing", () => ({
  Link: ({
    href,
    children,
    className,
    ...props
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}))

const faces: PracticeFace[] = [
  { index: "I", title: "One", body: "First face", href: "/work" },
  { index: "II", title: "Two", body: "Second face", href: "/services" },
  { index: "III", title: "Three", body: "Third face", href: "/products" },
  { index: "IV", title: "Four", body: "Fourth face", href: "/start" },
]

describe("PracticeCube", () => {
  it("marks every face link as not natively draggable", () => {
    render(<PracticeCube faces={faces} caption="Practice" />)

    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(faces.length)
    for (const link of links) {
      expect(link).toHaveAttribute("draggable", "false")
    }
  })

  it("cancels native dragstart inside the scene", () => {
    const { container } = render(<PracticeCube faces={faces} caption="Practice" />)

    const scene = container.querySelector(".practice-scene")
    expect(scene).not.toBeNull()

    const event = new Event("dragstart", { bubbles: true, cancelable: true })
    scene?.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
  })
})
