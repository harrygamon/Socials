import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { resend } from './resend'

export const authOptions = {
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
      sendVerificationRequest: async ({ identifier, url }) => {
        const html = `
          <body style="background: #f6f6f9; font-family: 'Helvetica Neue', sans-serif; padding: 2rem;">
            <table role="presentation" style="max-width: 480px; margin: auto; background: #ffffff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
              <tr>
                <td style="text-align: center;">
                  <h2 style="color: #111; font-size: 24px; margin-bottom: 0;">Welcome back to</h2>
                  <h1 style="color: #e91e63; font-size: 36px; margin-top: 0;">Social ❤️</h1>
                  <p style="font-size: 16px; color: #444; margin: 1rem 0;">
                    Click the button below to log in. This magic link will expire in 10 minutes.
                  </p>
                  <a href="${url}" style="display: inline-block; background-color: #e91e63; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 16px; border-radius: 8px; font-weight: bold; margin-top: 1rem;">
                    Login to Social
                  </a>
                  <p style="margin-top: 1.5rem; font-size: 13px; color: #999;">
                    Or paste this URL into your browser:
                    <br/>
                    <a href="${url}" style="color: #e91e63;">${url}</a>
                  </p>
                  <hr style="margin: 2rem 0; border: none; border-top: 1px solid #eee;" />
                  <p style="font-size: 12px; color: #aaa;">
                    This email was sent by Social. If you didn't request this login, you can safely ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </body>
        `;

        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: identifier,
          subject: "Login to Social",
          html: html,
          text: `Login to Social\n${url}\n\n`,
        });
      },
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
        const user = await prisma.user.findUnique({ where: { email: credentials.email } }) as unknown as { id: string; name: string; email: string; image: string; password: string } | null
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
    strategy: 'jwt' as const,
  },
  callbacks: {
    async session({ session, token }: { session: unknown; token: unknown }) {
      if (session && typeof session === 'object' && 'user' in session && token && typeof token === 'object' && 'sub' in token) {
        (session as { user: { id: string } }).user.id = (token as { sub: string }).sub
      }
      // Add subscription to session
      if (session && typeof session === 'object' && 'user' in session) {
        if ('subscription' in (session as { user: { subscription?: string | null } }).user) {
          (session as { user: { subscription?: string | null } }).user.subscription = (token as { subscription?: string | null }).subscription ?? null;
        }
      }
      return session
    },
    async jwt({ token, user }: { token: unknown; user: unknown }) {
      if (user) {
        (token as { sub: string }).sub = (user as { id: string }).id
        // Add subscription to JWT
        if ('subscription' in (user as { subscription?: string | null })) {
          (token as { subscription?: string | null }).subscription = (user as { subscription?: string | null }).subscription ?? null;
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