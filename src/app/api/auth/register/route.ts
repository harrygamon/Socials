import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10)
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        age: 18, // default, can be updated later
        gender: 'OTHER', // default, can be updated later
        onboarded: false, // User must complete onboarding
      },
    })
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 