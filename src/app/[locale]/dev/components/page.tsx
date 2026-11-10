import { FaqAccordion } from "@/components/brand/faq-accordion"
import { PillButton } from "@/components/brand/pill-button"
import { StatsGrid } from "@/components/brand/stats-grid"
import { StickySteps } from "@/components/brand/sticky-steps"
import { WordmarkMarquee } from "@/components/brand/wordmark-marquee"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function StatePanel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4 border border-border p-5 sm:p-6">
      <h2 className="text-section text-foreground">{title}</h2>
      {children}
    </section>
  )
}

function StateRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-3 border-b border-border/60 py-4 last:border-0 sm:grid-cols-[8rem_1fr] sm:items-center">
      <p className="text-label text-muted-foreground">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

/**
 * Galeri keadaan komponen (Lampiran D.5 /dev/components).
 */
export default function DevComponentsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-label text-muted-foreground">Lampiran D.5</p>
        <h1 className="text-display text-foreground">Component gallery</h1>
        <p className="text-body-measure text-muted-foreground">
          D.4 states across brand + shadcn primitives. Toggle theme from the site
          header (or OS preference) to check light/dark.
        </p>
      </header>

      <StatePanel title="Button / PillButton">
        <StateRow label="idle">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <PillButton href="/contact">Pill CTA</PillButton>
          </div>
        </StateRow>
        <StateRow label="hover / focus">
          <p className="text-sm text-muted-foreground">
            Tab to focus; hover for lift. Focus ring uses --ring.
          </p>
        </StateRow>
        <StateRow label="loading">
          <Button disabled aria-busy="true">
            Sending…
          </Button>
        </StateRow>
        <StateRow label="disabled">
          <Button disabled>Disabled</Button>
        </StateRow>
        <StateRow label="destructive">
          <Button variant="destructive">Destructive</Button>
        </StateRow>
        <StateRow label="touch target">
          <Button className="h-11 min-h-11 rounded-full px-6">
            h-11 CTA (≥44 px)
          </Button>
        </StateRow>
      </StatePanel>

      <StatePanel title="Form primitives (Input / Textarea / Label)">
        <StateRow label="idle">
          <div className="max-w-xs space-y-2">
            <Label htmlFor="dev-input-idle">Name</Label>
            <Input id="dev-input-idle" placeholder="Andy Pratama" className="border-input-border" />
          </div>
        </StateRow>
        <StateRow label="focus">
          <p className="text-sm text-muted-foreground">
            Tab to Input above — focus ring uses --ring / --brand.
          </p>
        </StateRow>
        <StateRow label="error / aria-invalid">
          <div className="max-w-xs space-y-2">
            <Label htmlFor="dev-input-error" className="text-destructive">
              Email
            </Label>
            <Input
              id="dev-input-error"
              type="email"
              defaultValue="not-an-email"
              aria-invalid
              className="border-input-border"
            />
            <p className="text-sm font-medium text-destructive">
              Please enter a valid email address.
            </p>
          </div>
        </StateRow>
        <StateRow label="disabled">
          <div className="max-w-xs space-y-2">
            <Label htmlFor="dev-input-disabled">Message</Label>
            <Input id="dev-input-disabled" disabled placeholder="Disabled input" className="border-input-border" />
          </div>
        </StateRow>
        <StateRow label="textarea idle">
          <div className="max-w-xs space-y-2">
            <Label htmlFor="dev-textarea">Message</Label>
            <Textarea id="dev-textarea" rows={3} placeholder="Your message…" className="border-input-border" />
          </div>
        </StateRow>
        <StateRow label="success state">
          <div
            role="status"
            className="flex max-w-xs items-start gap-3 rounded-lg border border-border bg-muted/40 p-4"
          >
            <p className="text-sm font-medium text-foreground">
              Message received. I will reply by email.
            </p>
          </div>
        </StateRow>
      </StatePanel>

      <StatePanel title="Skeleton / empty / success">
        <StateRow label="loading">
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </StateRow>
        <StateRow label="empty">
          <p className="border border-dashed border-border p-6 text-sm text-muted-foreground">
            No journal entries yet.
          </p>
        </StateRow>
        <StateRow label="success">
          <p
            role="status"
            className="border border-border bg-muted/40 p-4 text-sm text-foreground"
          >
            Message queued. Check tmp/outbox.json in file-transport mode.
          </p>
        </StateRow>
      </StatePanel>

      <StatePanel title="Tabs + Tooltip">
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Build</TabsTrigger>
            <TabsTrigger value="b">Hire</TabsTrigger>
            <TabsTrigger value="c" disabled>
              Soon
            </TabsTrigger>
          </TabsList>
          <TabsContent value="a" className="pt-4 text-sm text-muted-foreground">
            Product and school systems.
          </TabsContent>
          <TabsContent value="b" className="pt-4 text-sm text-muted-foreground">
            Roles and collaboration.
          </TabsContent>
        </Tabs>
        <div className="pt-4">
          <Tooltip>
            <TooltipTrigger
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Hover tip
            </TooltipTrigger>
            <TooltipContent>Uses TooltipProvider from locale layout</TooltipContent>
          </Tooltip>
        </div>
      </StatePanel>

      <StatePanel title="FaqAccordion">
        <FaqAccordion
          defaultOpenId="g1"
          items={[
            {
              id: "g1",
              question: "What is this gallery for?",
              answer:
                "Manual D.4 checks: keyboard, themes, loading, empty, error, success.",
            },
            {
              id: "g2",
              question: "Where is wiring status?",
              answer: "See /dev/wiring for plugin inventory and runtime probes.",
            },
          ]}
        />
      </StatePanel>

      <StatePanel title="StatsGrid (facts.ts only)">
        <StatsGrid
          items={[
            { id: "students", label: "Students taught" },
            { id: "yearsBuilding", label: "Years building" },
            { id: "modules", label: "Modules shipped" },
          ]}
        />
      </StatePanel>

      <StatePanel title="StickySteps">
        <StickySteps
          steps={[
            { title: "Clarify", description: "Scope and acceptance first." },
            { title: "Build", description: "Smallest change that proves it." },
            { title: "Verify", description: "Lint, test, build, e2e." },
          ]}
        />
      </StatePanel>

      <StatePanel title="WordmarkMarquee">
        <div className="overflow-hidden border border-border bg-surface-contrast py-6 text-surface-contrast-foreground">
          <WordmarkMarquee text="ANDY PRATAMA" />
        </div>
      </StatePanel>

      <StatePanel title="Table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>State</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>idle</TableCell>
              <TableCell>Default row</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>hover</TableCell>
              <TableCell>Pointer over row</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </StatePanel>
    </div>
  )
}
