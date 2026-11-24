import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import { generateRandomToken, hashToken } from '@/lib/auth/tokens'
import { sendVerificationEmail } from '@/lib/auth/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, companyName, password, confirmPassword, acceptTerms } = body

    // 1. Mandatory field validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
    }

    if (!email?.trim() || !email.includes('@') || email.length < 5) {
      return NextResponse.json({ error: 'A valid work email address is required.' }, { status: 400 })
    }

    if (!companyName?.trim()) {
      return NextResponse.json({ error: 'Organisation or company name is required.' }, { status: 400 })
    }

    if (!password || password.trim().length === 0) {
      return NextResponse.json(
        { error: 'Password is required.' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match. Please verify both entries.' },
        { status: 400 }
      )
    }

    if (!acceptTerms) {
      return NextResponse.json(
        { error: 'You must accept the terms of service and security policy.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

    // 2. Check email uniqueness
    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address is already registered. Please sign in or reset your password.' },
        { status: 409 }
      )
    }

    // 3. Hash password using bcrypt
    const hashedPassword = await hashPassword(password)

    // 4. Generate verification token (stored as SHA-256 hash, valid for 24 hours)
    const rawVerificationToken = generateRandomToken()
    const hashedVerificationToken = hashToken(rawVerificationToken)
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // 5. Organisation Handling
    // Check if company exists or create one
    const cleanCompanyName = companyName.trim()
    let company = await db.company.findFirst({
      where: { name: cleanCompanyName },
    })

    let assignedRole = 'fleet_manager'

    if (!company) {
      // First time this organisation is created, creator becomes owner
      company = await db.company.create({
        data: {
          name: cleanCompanyName,
          email: cleanEmail,
        },
      })
      assignedRole = 'owner'
    }

    // 6. Create User record in database (activated immediately without email verification)
    const newUser = await db.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: assignedRole,
        isActive: true,
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
        companyMemberships: {
          create: {
            companyId: company.id,
            role: assignedRole,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Account registered and activated successfully. You can sign in immediately.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          companyName: company.name,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An unexpected internal error occurred during registration. Please try again.' },
      { status: 500 }
    )
  }
}
