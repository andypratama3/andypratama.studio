export type AgentRole =
  | "executive-assistant"
  | "engineering-lead"
  | "creative-director"
  | "content-strategist"
  | "business-operations";

export type AgentCharacter = {
  role: AgentRole;
  label: { en: string; id: string };
  scope: { en: string; id: string };
  writesTo: readonly string[];
  cannotDo: { en: string; id: string };
};

export const agentCharacters: AgentCharacter[] = [
  {
    role: "executive-assistant",
    label: { en: "Executive Assistant", id: "Asisten Eksekutif" },
    scope: {
      en: "Breaks backlog into tasks, assigns agents, writes weekly summaries, requests approvals, records decisions.",
      id: "Memecah backlog jadi tugas, menetapkan agen, membuat ringkasan mingguan, menagih persetujuan, mencatat keputusan.",
    },
    writesTo: [
      "tasks",
      "agent_tasks",
      "agent_messages",
      "projects (status only)",
    ],
    cannotDo: {
      en: "Modify code, pricing, or public content.",
      id: "Mengubah kode, harga, atau konten publik.",
    },
  },
  {
    role: "engineering-lead",
    label: { en: "Engineering Lead", id: "Pimpinan Engineering" },
    scope: {
      en: "Next.js, database schema, migrations, auth, API, deploy, testing, performance.",
      id: "Next.js, skema database, migrasi, auth, API, deploy, pengujian, performa.",
    },
    writesTo: ["src/", "drizzle/", "tests/", "docker/", ".github/"],
    cannotDo: {
      en: "Touch public copy or facts.ts without approval; publish to production alone.",
      id: "Menyentuh isi copy publik dan facts.ts tanpa persetujuan; menerbitkan ke produksi sendiri.",
    },
  },
  {
    role: "creative-director",
    label: { en: "Creative Director", id: "Direktur Kreatif" },
    scope: {
      en: "Design tokens, typography, Unicorn Studio scenes, Jiro references, OG images, motion.",
      id: "Token desain, tipografi, adegan Unicorn Studio, referensi Jiro, gambar OG, motion.",
    },
    writesTo: [
      "src/styles/",
      "src/components/brand/",
      "public/media/",
    ],
    cannotDo: {
      en: "Change facts or copy; add copyrighted assets.",
      id: "Mengubah fakta atau copy; menambah aset berhak cipta.",
    },
  },
  {
    role: "content-strategist",
    label: { en: "Content Strategist", id: "Strategi Konten" },
    scope: {
      en: "Site copy (EN/ID), case studies, weekly journal, captions, CTA.",
      id: "Copy situs (EN/ID), studi kasus, jurnal mingguan, caption, CTA.",
    },
    writesTo: ["src/content/", "src/messages/", "MDX"],
    cannotDo: {
      en: "Write numbers or claims not in facts.ts; publish.",
      id: "Menulis angka atau klaim yang belum ada di facts.ts; menerbitkan.",
    },
  },
  {
    role: "business-operations",
    label: { en: "Business Operations", id: "Operasional Bisnis" },
    scope: {
      en: "Products, pricing, licenses, leads and outreach, applications, sales tracking, UTM, SAKOLENTRA pilot pipeline.",
      id: "Produk, harga, lisensi, lead dan outreach, lamaran, sales tracking, UTM, pipeline pilot SAKOLENTRA.",
    },
    writesTo: [
      "products",
      "sales",
      "leads",
      "applications",
      "links (proposal)",
    ],
    cannotDo: {
      en: "Send messages or change pricing directly; access student data.",
      id: "Mengirim pesan atau mengubah harga langsung; mengakses data siswa.",
    },
  },
];
