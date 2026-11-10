export type FactStatus = "verified" | "stated" | "unverified";
export type Fact = {
  value: string;
  status: FactStatus;
  verifiedAt?: string;
  note?: string;
  publicNote?: { en: string; id: string };
};

export const facts = {
  students: {
    value: "1,000+",
    status: "stated",
    note: "CV terbaru; ukur ulang bila ada angka aktif",
  },
  yearsBuilding: {
    value: "3+",
    status: "stated",
  },
  school: {
    value: "SD Muhammadiyah 3 Samarinda",
    status: "stated",
    note: "boleh disebut sebagai nama; tanpa logo/foto/data",
  },
  modules: {
    value: "52",
    status: "stated",
    note: "CV terbaru",
  },
  endpoints: {
    value: "",
    status: "unverified",
  },
  tests: {
    value: "",
    status: "unverified",
  },
} satisfies Record<string, Fact>;

export type FactId = keyof typeof facts;
