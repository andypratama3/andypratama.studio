import { describe, it, expect } from "vitest";
import { facts, type FactStatus, type Fact } from "@/content/facts";

describe("facts", () => {
  it("exports a valid record of Fact objects", () => {
    const validStatuses: FactStatus[] = ["verified", "stated", "unverified"];
    for (const [, fact] of Object.entries(facts) as [string, Fact][]) {
      expect(typeof fact.value).toBe("string");
      expect(validStatuses).toContain(fact.status);
      if (fact.verifiedAt !== undefined) {
        expect(typeof fact.verifiedAt).toBe("string");
      }
      if (fact.note !== undefined) {
        expect(typeof fact.note).toBe("string");
      }
    }
  });

  it("known facts have correct values and statuses", () => {
    expect(facts.students.value).toBe("1,000+");
    expect(facts.students.status).toBe("stated");

    expect(facts.yearsBuilding.value).toBe("3+");
    expect(facts.yearsBuilding.status).toBe("stated");

    expect(facts.school.value).toBe("SD Muhammadiyah 3 Samarinda");
    expect(facts.school.status).toBe("stated");

    expect(facts.modules.value).toBe("52");
    expect(facts.modules.status).toBe("stated");
  });

  it("unverified facts have empty values and are not publishable", () => {
    const unverified = Object.entries(facts).filter(
      ([, fact]) => fact.status === "unverified"
    );
    expect(unverified.length).toBeGreaterThan(0);
    for (const [, fact] of unverified) {
      expect(fact.value).toBe("");
    }
  });
});

describe("Fact component logic", () => {
  it("should NOT render unverified facts", () => {
    for (const [, fact] of Object.entries(facts) as [string, Fact][]) {
      if (fact.status === "unverified") {
        expect(fact.value).toBe("");
      }
    }
  });

  it("should render verified and stated facts", () => {
    const renderableFacts = (Object.entries(facts) as [string, Fact][]).filter(
      ([, f]) => f.status === "verified" || f.status === "stated"
    );
    expect(renderableFacts.length).toBeGreaterThan(0);
    for (const [, fact] of renderableFacts) {
      expect(fact.value.length).toBeGreaterThan(0);
    }
  });

  it("known unverified fact ids are endpoints and tests", () => {
    expect(facts.endpoints.status).toBe("unverified");
    expect(facts.tests.status).toBe("unverified");
  });
});
