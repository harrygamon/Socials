import type { AuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { resend } from './resend'
import type { User as PrismaUser } from '@prisma/client'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 587,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY || 're_dADWfsPi_5s721x8DSB88MgCt69assjjW',
        },
      },
      from: "onboarding@resend.dev",
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } }) as any
        if (!user || !user.password) {
          return null
        }
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          return null
        }
        // Return user object (omit password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      // Add subscription to session
      if (session.user) {
        if ('subscription' in token) {
          (session.user as typeof session.user & { subscription?: string | null }).subscription = (token as { subscription?: string | null }).subscription ?? null;
        }
      }
      return session
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.sub = user.id
        // Add subscription to JWT
        if ('subscription' in user) {
          (token as typeof token & { subscription?: string | null }).subscription = (user as { subscription?: string | null }).subscription ?? null;
        }
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Helper for protecting server components/routes
export async function requireAuth(session: unknown) {
  if (!session || typeof session !== 'object' || !('user' in session)) {
    throw new Error('Not authenticated')
  }
  return session
} 