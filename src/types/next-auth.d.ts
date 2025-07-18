declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      subscription?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    subscription?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid: string
  }
} 