import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  // Same-origin by default. Avoids cookie/domain mismatches when the app is
  // opened through 127.0.0.1, a LAN address, or a preview URL.
})

export const { signIn, signOut, useSession } = authClient
