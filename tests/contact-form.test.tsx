/** @vitest-environment jsdom */
/**
 * ContactForm component test — covers:
 * 1. Validation errors shown inline when submit is attempted with empty fields
 * 2. Success state shown inline when API returns ok
 * 3. Server error for 429 rate limit
 */
import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// ── next-intl mock ────────────────────────────────────────────────────────────
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

// ── next/navigation mock ──────────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: () => null }),
}))

// ── i18n routing mock ─────────────────────────────────────────────────────────
vi.mock("@/i18n/routing", () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

// ── events mock ───────────────────────────────────────────────────────────────
vi.mock("@/lib/events", () => ({ track: vi.fn() }))

// ── sonner mock ───────────────────────────────────────────────────────────────
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

// ── fetch mock ────────────────────────────────────────────────────────────────
const mockFetch = vi.fn()
global.fetch = mockFetch

import { ContactForm } from "@/components/brand/contact-form"

const labels = {
  name: "Name",
  email: "Email",
  topic: "Topic",
  message: "Message",
  submit: "Send message",
  topics: {
    project: "Project",
    hiring: "Hiring",
    school: "School",
    other: "Other",
  },
}

describe("<ContactForm />", () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it("shows inline validation errors when required fields are empty", async () => {
    render(<ContactForm labels={labels} />)

    const submitBtn = screen.getByRole("button", { name: /send message/i })
    await userEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText("fieldRequired")).toBeInTheDocument()
      expect(screen.getByText("emailInvalid")).toBeInTheDocument()
      expect(screen.getByText("messageRequired")).toBeInTheDocument()
    })

    // fetch should NOT have been called — validation failed on client
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("shows success state after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 })

    render(<ContactForm labels={labels} />)

    await userEvent.type(screen.getByLabelText("Name"), "Andy")
    await userEvent.type(screen.getByLabelText("Email"), "andy@example.com")
    // topic defaults to "project" so no need to change
    await userEvent.type(screen.getByLabelText("Message"), "Hello, this is a test message.")

    const submitBtn = screen.getByRole("button", { name: /send message/i })
    await userEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument()
      expect(screen.getByText("successSent")).toBeInTheDocument()
    })
  })

  it("shows server error for 429 response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 429 })

    render(<ContactForm labels={labels} />)

    await userEvent.type(screen.getByLabelText("Name"), "Andy")
    await userEvent.type(screen.getByLabelText("Email"), "andy@example.com")
    await userEvent.type(screen.getByLabelText("Message"), "Hello, testing rate limit error.")

    const submitBtn = screen.getByRole("button", { name: /send message/i })
    await userEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument()
      expect(screen.getByText("errorRateLimit")).toBeInTheDocument()
    })
  })
})
