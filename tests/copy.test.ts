import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_EN = [
  "seamless",
  "elevate",
  "unlock",
  "leverage",
  "cutting-edge",
  "revolutionize",
  "next-level",
  "game-changer",
  "supercharge",
  "empower",
  "robust",
  "delve",
  "in today's fast-paced world",
];

const FORBIDDEN_ID = [
  "revolusioner",
  "solusi terdepan",
  "transformasi digital",
  "sinergi",
  "era digital ini",
  "kami berkomitmen",
];

function getFilesRecursively(dir: string, extension: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFilesRecursively(fullPath, extension));
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  return files;
}

function checkContentForForbidden(
  filePath: string,
  content: string,
  forbiddenWords: string[]
): string[] {
  const violations: string[] = [];
  for (const word of forbiddenWords) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(content)) {
      violations.push(`${filePath} contains forbidden word: "${word}"`);
    }
  }
  return violations;
}

describe("Copy checks: forbidden AI/marketing buzzwords", () => {
  const rootDir = process.cwd();
  const messagesDir = path.join(rootDir, "src", "messages");
  const contentDir = path.join(rootDir, "src", "content");

  const jsonFiles = getFilesRecursively(messagesDir, ".json");
  const tsFiles = getFilesRecursively(contentDir, ".ts");

  it("messages/*.json must not contain forbidden words", () => {
    const allForbidden = [...FORBIDDEN_EN, ...FORBIDDEN_ID];
    const violations: string[] = [];

    for (const file of jsonFiles) {
      const content = fs.readFileSync(file, "utf-8");
      violations.push(...checkContentForForbidden(file, content, allForbidden));
    }

    expect(violations).toEqual([]);
  });

  it("content/**/*.ts must not contain forbidden words", () => {
    const allForbidden = [...FORBIDDEN_EN, ...FORBIDDEN_ID];
    const violations: string[] = [];

    for (const file of tsFiles) {
      const content = fs.readFileSync(file, "utf-8");
      violations.push(...checkContentForForbidden(file, content, allForbidden));
    }

    expect(violations).toEqual([]);
  });

  it("en.json strictly avoids English forbidden words", () => {
    const enFile = path.join(messagesDir, "en.json");
    if (fs.existsSync(enFile)) {
      const content = fs.readFileSync(enFile, "utf-8");
      const violations = checkContentForForbidden(
        enFile,
        content,
        FORBIDDEN_EN
      );
      expect(violations).toEqual([]);
    }
  });

  it("id.json strictly avoids Indonesian forbidden words", () => {
    const idFile = path.join(messagesDir, "id.json");
    if (fs.existsSync(idFile)) {
      const content = fs.readFileSync(idFile, "utf-8");
      const violations = checkContentForForbidden(
        idFile,
        content,
        FORBIDDEN_ID
      );
      expect(violations).toEqual([]);
    }
  });
});
