import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const messages = {
  en: JSON.parse(fs.readFileSync(path.join(root, "src/messages/en.json"), "utf8")),
  id: JSON.parse(fs.readFileSync(path.join(root, "src/messages/id.json"), "utf8")),
}

function flatten(obj, prefix = "") {
  const out = new Set()
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const leaf of flatten(value, full)) out.add(leaf)
    } else {
      out.add(full)
    }
  }
  return out
}

const keys = { en: flatten(messages.en), id: flatten(messages.id) }

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full)
  }
  return files
}

const files = walk(path.join(root, "src"))
const problems = []
const dynamic = []
const used = new Set()

for (const file of files) {
  const source = fs.readFileSync(file, "utf8")
  const bindings = new Map()
  const declRe = /(?:const|let|var)\s+(\w+)\s*=\s*(?:await\s+)?(?:getTranslations|useTranslations)\(\s*(?:\{[^}]*namespace:\s*)?["'`]([\w.]+)["'`]/g
  let match
  while ((match = declRe.exec(source))) bindings.set(match[1], match[2])

  for (const [name, namespace] of bindings) {
    const callRe = new RegExp(`\\b${name}\\s*(?:\\.rich|\\.markup|\\.raw)?\\(\\s*([\\s\\S]{0,120}?)\\)`, "g")
    let call
    while ((call = callRe.exec(source))) {
      const arg = call[1].trim()
      const literal = arg.match(/^["'`]([^"'`$]+)["'`]/)
      if (!literal) {
        if (!/^[{)\w]/.test(arg) && arg.length > 0) dynamic.push({ file, ns: namespace, arg: arg.slice(0, 60) })
        continue
      }
      const key = `${namespace}.${literal[1]}`
      used.add(key)
      if (!keys.en.has(key)) problems.push({ file, key, lang: "en" })
      if (!keys.id.has(key)) problems.push({ file, key, lang: "id" })
    }
  }
}

const rel = (f) => path.relative(root, f)
console.log("files scanned:", files.length)
console.log("bindings resolved keys:", used.size)
if (dynamic.length) {
  console.log("\nDynamic key expressions (manual review):", dynamic.length)
  for (const d of dynamic) console.log(`  ${rel(d.file)} [${d.ns}] ${d.arg}`)
}
if (problems.length) {
  console.log("\nMISSING KEYS:", problems.length)
  for (const p of problems) console.log(`  ${rel(p.file)} -> ${p.key} (${p.lang})`)
  process.exitCode = 1
} else {
  console.log("\nNo missing static translation keys.")
}

const unused = [...keys.en].filter((key) => {
  return ![...used].some((u) => u === key) && ![...used].some((u) => key.startsWith(u + "."))
})
console.log("\nKeys not hit statically (may be used dynamically):", unused.length)
