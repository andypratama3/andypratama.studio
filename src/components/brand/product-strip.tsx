import Image from "next/image"
import { MarqueePause } from "@/components/brand/marquee-pause"
import { Link } from "@/lib/navigation"
import { productCatalog, type ProductCatalogItem } from "@/content/product-catalog"
import { cn } from "@/lib/utils"

export type ProductStripCard = ProductCatalogItem & {
  title: string
  blurb: string
}

function ProductCardFace({
  item,
  liveLabel,
  soonLabel,
  interactive,
}: {
  item: ProductStripCard
  liveLabel: string
  soonLabel: string
  interactive: boolean
}) {
  const status = item.status === "live" ? liveLabel : soonLabel
  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-muted">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="260px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3 space-y-1 px-0.5">
        <p className="text-xs tabular-nums text-muted-foreground">{status}</p>
        <p className="text-sm leading-snug font-medium text-foreground">{item.title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{item.blurb}</p>
      </div>
    </>
  )

  if (!interactive) {
    return <div className="w-[15.5rem] shrink-0">{body}</div>
  }

  return (
    <Link
      href={item.href}
      className="group w-[15.5rem] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {body}
    </Link>
  )
}

export function ProductStrip({
  items,
  liveLabel,
  soonLabel,
  browseLabel,
  className,
}: {
  items: ProductStripCard[]
  liveLabel: string
  soonLabel: string
  browseLabel: string
  className?: string
}) {
  const shelf = items.length > 0 ? items : productCatalog.map((item) => ({
    ...item,
    title: item.id,
    blurb: "",
  }))

  return (
    <div
      data-nav-theme="light"
      data-decor=""
      className={cn("relative overflow-hidden border-b border-border bg-background py-7", className)}
    >
      <MarqueePause />
      <div className="edge-fade-x overflow-hidden">
        <div className="fluid-marquee-track flex w-max items-start gap-5">
          <div className="flex items-start gap-5 pr-5">
            {shelf.map((item) => (
              <ProductCardFace
                key={`live-${item.id}`}
                item={item}
                liveLabel={liveLabel}
                soonLabel={soonLabel}
                interactive
              />
            ))}
          </div>
          <div className="flex items-start gap-5 pr-5" aria-hidden>
            {shelf.map((item) => (
              <ProductCardFace
                key={`dup-${item.id}`}
                item={item}
                liveLabel={liveLabel}
                soonLabel={soonLabel}
                interactive={false}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-center px-[clamp(20px,4vw,40px)]">
        <Link
          href="/products"
          className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {browseLabel}
        </Link>
      </div>
    </div>
  )
}
