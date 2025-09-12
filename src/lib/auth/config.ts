import { NextAuthOptions } from "next-auth"
import { UserRole } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { mockDb } from "@/lib/mock-db"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        clinicCode: { label: "Clinic Code", type: "text", optional: true }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Handle clinic code login
          if (credentials.clinicCode) {
            // Find user by email (mock implementation doesn't have clinic codes)
            const user = await mockDb.findUserByEmail(credentials.email)

            if (!user || !user.isActive) {
              return null
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!isPasswordValid) {
              return null
            }

            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              role: user.role,
              clinicId: user.clinicId,
              tenantId: user.tenantId
            }
          } else {
            // Handle regular email login
            const user = await mockDb.findUserByEmail(credentials.email)

            if (!user || !user.isActive) {
              return null
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!isPasswordValid) {
              return null
            }

            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              role: user.role,
              clinicId: user.clinicId,
              tenantId: user.tenantId
            }
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.clinicId = user.clinicId
        token.tenantId = user.tenantId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.clinicId = token.clinicId as string | null
        session.user.tenantId = token.tenantId as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
    error: "/login"
  }
}