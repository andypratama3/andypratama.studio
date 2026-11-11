"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Reveal } from "@/components/brand/reveal"
import { track } from "@/lib/events"

export type FaqAccordionItem = {
  id: string
  question: string
  answer: string
}

export function FaqAccordion({
  items,
  defaultOpenId,
}: {
  items: FaqAccordionItem[]
  defaultOpenId?: string
}) {
  if (items.length === 0) return null

  return (
    <Reveal>
      <Accordion
        className="divide-y divide-border border-y border-border"
        defaultValue={defaultOpenId ? [defaultOpenId] : []}
      >
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-0 px-0">
            <AccordionTrigger
              className="min-h-11 rounded-xl py-5 text-left text-sm font-medium hover:no-underline hover:text-brand data-[panel-open]:text-foreground sm:text-base"
              onClick={() => track("faq_open", { id: item.id })}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <p className="text-body-measure max-w-[52ch] pr-8 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  )
}
