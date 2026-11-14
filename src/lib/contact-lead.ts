import type { ContactTopic } from "@/lib/schemas/contact"

export type LeadSegment =
  | "freelancer"
  | "agency"
  | "multi_brand"
  | "sekolah"
  | "perekrut"
  | "lainnya"

const TOPIC_TO_SEGMENT: Record<ContactTopic, LeadSegment> = {
  project: "multi_brand",
  hiring: "perekrut",
  school: "sekolah",
  other: "lainnya",
}

export function contactTopicToSegment(topic: ContactTopic): LeadSegment {
  return TOPIC_TO_SEGMENT[topic]
}

export function buildLeadNotes(topic: ContactTopic, message: string): string {
  return `[${topic}] ${message}`.trim()
}
