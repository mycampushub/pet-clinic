import NextAuth, { type DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// Extend the session type to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      tenantId: string
      clinicId?: string
      permissions?: string[]
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    tenantId: string
    clinicId?: string
    permissions?: string[]
  }
}

// Extend the JWT type to include our custom fields
declare module "next-auth/jwt" {
  interface JWT {
    role: string
    tenantId: string
    clinicId?: string
    permissions?: string[]
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            },
            include: {
              tenant: true,
              clinic: true
            }
          })

          if (!user || !user.isActive) {
            return null
          }

          // Proper password validation with bcrypt
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            clinicId: user.clinicId,
            permissions: user.permissions
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.tenantId = user.tenantId
        token.clinicId = user.clinicId
        token.permissions = user.permissions || []
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string
        session.user.clinicId = token.clinicId as string || null
        session.user.permissions = token.permissions as string[] || []
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }