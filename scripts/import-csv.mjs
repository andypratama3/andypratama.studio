import { importAllCsv } from "../src/db/import-csv.ts"

importAllCsv()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
