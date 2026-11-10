import {
  boolean,
  date,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core"

const id = () =>
  varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
const createdAt = () => timestamp("created_at").defaultNow().notNull()

// ==========================================
// 1. Better Auth tables (Owner authentication)
// ==========================================
export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: varchar("role", { length: 30 }).default("owner").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})

export const session = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 36 })
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [index("session_user_idx").on(t.userId)]
)

export const account = mysqlTable(
  "account",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 36 })
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [index("account_user_idx").on(t.userId)]
)

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})

// ==========================================
// 2. Operational Core tables
// ==========================================

export const agents = mysqlTable("agents", {
  id: id(),
  slug: varchar("slug", { length: 40 }).notNull().unique(),
  displayName: varchar("display_name", { length: 80 }).notNull(),
  role: varchar("role", { length: 120 }).notNull(),
  scope: text("scope").notNull(),
  canWrite: json("can_write").$type<string[]>().notNull(),
  requiresApproval: json("requires_approval").$type<string[]>().notNull(),
  apiKeyHash: varchar("api_key_hash", { length: 128 }),
  active: boolean("active").default(true).notNull(),
  createdAt: createdAt(),
})

export const tasks = mysqlTable(
  "tasks",
  {
    id: id(),
    title: varchar("title", { length: 255 }).notNull(),
    plannedDate: date("planned_date", { mode: "string" }),
    session: mysqlEnum("session", ["pagi", "siang", "malam"]),
    lane: mysqlEnum("lane", [
      "produk",
      "video",
      "karier",
      "distribusi",
      "review",
    ]).notNull(),
    durationMin: int("duration_min"),
    priority: mysqlEnum("priority", ["kritis", "tinggi", "fleksibel"])
      .default("tinggi")
      .notNull(),
    status: mysqlEnum("status", ["belum", "jalan", "selesai", "ditunda"])
      .default("belum")
      .notNull(),
    doneCriteria: text("done_criteria"),
    notes: text("notes"),
    completedAt: timestamp("completed_at"),
    createdAt: createdAt(),
  },
  (t) => [
    index("tasks_date_idx").on(t.plannedDate),
    index("tasks_status_idx").on(t.status),
  ]
)

export const agentTasks = mysqlTable("agent_tasks", {
  id: id(),
  taskId: varchar("task_id", { length: 36 }).references(() => tasks.id),
  agentId: varchar("agent_id", { length: 36 })
    .references(() => agents.id)
    .notNull(),
  status: mysqlEnum("status", [
    "antri",
    "dikerjakan",
    "butuh_persetujuan",
    "selesai",
    "ditolak",
  ])
    .default("antri")
    .notNull(),
  summary: text("summary").notNull(),
  evidence: text("evidence"),
  approvalGate: varchar("approval_gate", { length: 60 }),
  approvedAt: timestamp("approved_at"),
  createdAt: createdAt(),
})

export const agentMessages = mysqlTable("agent_messages", {
  id: id(),
  fromAgentId: varchar("from_agent_id", { length: 36 }).references(
    () => agents.id
  ),
  toAgentId: varchar("to_agent_id", { length: 36 }).references(() => agents.id),
  agentTaskId: varchar("agent_task_id", { length: 36 }).references(
    () => agentTasks.id
  ),
  body: text("body").notNull(),
  createdAt: createdAt(),
})

export const leads = mysqlTable(
  "leads",
  {
    id: id(),
    name: varchar("name", { length: 120 }).notNull(),
    handle: varchar("handle", { length: 120 }),
    platform: mysqlEnum("platform", [
      "linkedin",
      "tiktok",
      "instagram",
      "threads",
      "email",
      "lainnya",
    ]).notNull(),
    segment: mysqlEnum("segment", [
      "freelancer",
      "agency",
      "multi_brand",
      "sekolah",
      "perekrut",
      "lainnya",
    ]).notNull(),
    stage: mysqlEnum("stage", [
      "baru",
      "dihubungi",
      "balas",
      "diskusi",
      "penawaran",
      "menang",
      "kalah",
    ])
      .default("baru")
      .notNull(),
    sourceUtm: varchar("source_utm", { length: 120 }),
    url: varchar("url", { length: 500 }),
    notes: text("notes"),
    lastContactAt: timestamp("last_contact_at"),
    nextActionAt: timestamp("next_action_at"),
    createdAt: createdAt(),
  },
  (t) => [index("leads_stage_idx").on(t.stage)]
)

export const outreachEvents = mysqlTable("outreach_events", {
  id: id(),
  leadId: varchar("lead_id", { length: 36 })
    .references(() => leads.id)
    .notNull(),
  channel: varchar("channel", { length: 30 }).notNull(),
  direction: mysqlEnum("direction", ["keluar", "masuk"]).notNull(),
  body: text("body"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  createdBy: mysqlEnum("created_by", ["owner", "agent"])
    .default("owner")
    .notNull(),
  approvedByOwner: boolean("approved_by_owner").default(false).notNull(),
})

export const applications = mysqlTable("applications", {
  id: id(),
  company: varchar("company", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  url: varchar("url", { length: 500 }),
  channel: varchar("channel", { length: 40 }),
  status: mysqlEnum("status", [
    "terkirim",
    "balasan",
    "wawancara",
    "tes",
    "tawaran",
    "ditolak",
    "tidak_ada_kabar",
  ])
    .default("terkirim")
    .notNull(),
  sentAt: timestamp("sent_at"),
  followUpAt: timestamp("follow_up_at"),
  notes: text("notes"),
  createdAt: createdAt(),
})

export const contentItems = mysqlTable("content_items", {
  id: id(),
  title: varchar("title", { length: 200 }).notNull(),
  platform: mysqlEnum("platform", [
    "tiktok",
    "instagram",
    "threads",
    "linkedin",
    "youtube",
    "website",
  ]).notNull(),
  format: mysqlEnum("format", ["video", "post", "carousel", "artikel"]).notNull(),
  series: mysqlEnum("series", [
    "build_in_public",
    "production_notes",
    "remotion_tips",
    "case_study",
    "lainnya",
  ]),
  hook: text("hook"),
  status: mysqlEnum("status", ["ide", "naskah", "produksi", "terjadwal", "tayang"])
    .default("ide")
    .notNull(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  url: varchar("url", { length: 500 }),
  utmCampaign: varchar("utm_campaign", { length: 80 }),
  createdAt: createdAt(),
})

export const metricsDaily = mysqlTable(
  "metrics_daily",
  {
    id: id(),
    date: date("date", { mode: "string" }).notNull(),
    platform: mysqlEnum("platform", [
      "all",
      "tiktok",
      "instagram",
      "threads",
      "linkedin",
      "youtube",
      "gumroad",
      "lynk",
      "website",
    ]).notNull(),
    metric: varchar("metric", { length: 40 }).notNull(),
    value: decimal("value", { precision: 14, scale: 2 }).notNull(),
    source: mysqlEnum("source", ["manual", "import", "api"])
      .default("manual")
      .notNull(),
  },
  (t) => [uniqueIndex("metrics_unique").on(t.date, t.platform, t.metric)]
)

export const links = mysqlTable("links", {
  id: id(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  destination: varchar("destination", { length: 800 }).notNull(),
  platform: varchar("platform", { length: 30 }),
  campaign: varchar("campaign", { length: 80 }),
  medium: varchar("medium", { length: 30 }).default("organic"),
  createdAt: createdAt(),
})

export const linkClicks = mysqlTable(
  "link_clicks",
  {
    id: id(),
    linkId: varchar("link_id", { length: 36 })
      .references(() => links.id)
      .notNull(),
    clickedAt: timestamp("clicked_at").defaultNow().notNull(),
    referrerHost: varchar("referrer_host", { length: 120 }),
    deviceType: varchar("device_type", { length: 20 }),
  },
  (t) => [index("clicks_link_time").on(t.linkId, t.clickedAt)]
)

export const products = mysqlTable("products", {
  id: id(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["draft", "live", "arsip"])
    .default("draft")
    .notNull(),
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }),
  gumroadUrl: varchar("gumroad_url", { length: 500 }),
  lynkUrl: varchar("lynk_url", { length: 500 }),
  demoUrl: varchar("demo_url", { length: 500 }),
  licenseNote: text("license_note"),
  createdAt: createdAt(),
})

export const sales = mysqlTable(
  "sales",
  {
    id: id(),
    productId: varchar("product_id", { length: 36 })
      .references(() => products.id)
      .notNull(),
    platform: mysqlEnum("platform", [
      "gumroad",
      "lynk",
      "etsy",
      "payhip",
      "direct",
    ]).notNull(),
    occurredAt: timestamp("occurred_at").notNull(),
    grossUsd: decimal("gross_usd", { precision: 10, scale: 2 }),
    netUsd: decimal("net_usd", { precision: 10, scale: 2 }),
    referrerUtm: varchar("referrer_utm", { length: 120 }),
    externalId: varchar("external_id", { length: 120 }),
    source: mysqlEnum("source", ["manual", "import", "ping"])
      .default("manual")
      .notNull(),
  },
  (t) => [uniqueIndex("sales_ext").on(t.platform, t.externalId)]
)

export const projects = mysqlTable("projects", {
  id: id(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  kind: mysqlEnum("kind", ["jasa", "produk", "konten", "internal"]).notNull(),
  stage: mysqlEnum("stage", [
    "ide",
    "validasi",
    "bangun",
    "pilot",
    "jalan",
    "arsip",
  ])
    .default("ide")
    .notNull(),
  summary: text("summary"),
  nextStep: text("next_step"),
  createdAt: createdAt(),
})

export const subscribers = mysqlTable("subscribers", {
  id: id(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  locale: mysqlEnum("locale", ["en", "id"]).default("en").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "unsubscribed"])
    .default("pending")
    .notNull(),
  sourceUtm: varchar("source_utm", { length: 120 }),
  confirmTokenHash: varchar("confirm_token_hash", { length: 128 }),
  confirmedAt: timestamp("confirmed_at"),
  createdAt: createdAt(),
})

export const siteSettings = mysqlTable("site_settings", {
  key: varchar("key", { length: 60 }).primaryKey(),
  value: json("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})
