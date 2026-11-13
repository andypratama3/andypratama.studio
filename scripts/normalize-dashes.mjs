import { readFileSync, writeFileSync } from "node:fs"

const files = ["src/messages/en.json", "src/messages/id.json", "src/content/faq.ts"]
for (const file of files) {
  const before = readFileSync(file, "utf8")
  const hits = (before.match(/ +— +/g) ?? []).length
  const after = before.replace(/ +— +/g, "—")
  if (after !== before) {
    writeFileSync(file, after)
    console.log(`${file}: ${hits} tempat diubah`)
  }
}
