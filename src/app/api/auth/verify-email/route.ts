import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashToken, generateRandomToken } from '@/lib/auth/tokens'
import { sendVerificationEmail } from '@/lib/auth/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, email, resend } = body

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    const user = await db.user.findUnique({
      where: { email: cleanEmail },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Account not found. Please verify your email address.' },
        { status: 404 }
      )
    }

    // Handle Resend Request
    if (resend) {
      if (user.emailVerified) {
        return NextResponse.json(
          { message: 'This email is already verified. You may proceed to sign in.' },
          { status: 200 }
        )
      }

      const rawToken = generateRandomToken()
      const hashedToken = hashToken(rawToken)
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

      await db.user.update({
        where: { id: user.id },
        data: {
          verificationToken: hashedToken,
          verificationExpires,
        },
      })

      const emailResult = await sendVerificationEmail(cleanEmail, rawToken, user.name)

      return NextResponse.json({
        success: true,
        message: 'A fresh verification token has been generated.',
        verification: {
          delivered: emailResult.delivered,
          providerConfigured: emailResult.providerConfigured,
          notice: emailResult.message,
          actionUrl: emailResult.actionUrl,
          token: emailResult.token,
        },
      })
    }

    // Handle Token Verification
    if (!token?.trim()) {
      return NextResponse.json(
        { error: 'Verification token is required.' },
        { status: 400 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: 'Your email address is already verified. You can sign in now.' },
        { status: 200 }
      )
    }

    const hashedInputToken = hashToken(token.trim())

    // Check matching token
    if (user.verificationToken !== hashedInputToken) {
      return NextResponse.json(
        { error: 'Invalid or already consumed verification token. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check expiration
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a fresh verification link.' },
        { status: 410 }
      )
    }

    // Successful Verification: consume token and mark verified
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email address verified successfully. Your FleetVision AI account is fully active.',
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal error processing verification request.' },
      { status: 500 }
    )
  }
}
