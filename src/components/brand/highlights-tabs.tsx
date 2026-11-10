"use client"

import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type HighlightTab = {
  id: string
  label: string
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
}

export function HighlightsTabs({
  tabs,
  className,
}: {
  tabs: HighlightTab[]
  className?: string
}) {
  const visible = tabs.slice(0, 5)
  if (visible.length === 0) return null

  return (
    <Tabs defaultValue={visible[0]?.id} className={cn("w-full", className)}>
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
        {visible.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="min-h-11 rounded-full border border-border px-4 data-active:border-brand data-active:bg-brand/10"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {visible.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-5">
              <h3 className="text-section text-foreground">{tab.title}</h3>
              <p className="text-body-measure text-base leading-relaxed text-muted-foreground">
                {tab.description}
              </p>
            </div>
            {tab.imageSrc ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(var(--radius)*2)] border border-border lg:col-span-7">
                <Image
                  src={tab.imageSrc}
                  alt={tab.imageAlt ?? tab.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            ) : null}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
