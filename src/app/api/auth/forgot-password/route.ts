import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateRandomToken, hashToken } from '@/lib/auth/tokens'
import { sendPasswordResetEmail } from '@/lib/auth/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email?.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    const user = await db.user.findUnique({
      where: { email: cleanEmail },
    })

    // Strict security requirement: Do not reveal account existence through reset responses
    if (!user || !user.isActive) {
      return NextResponse.json({
        success: true,
        message:
          'If an account is associated with this email, instructions to reset your password have been dispatched.',
      })
    }

    // Generate secure reset token with 1-hour expiration
    const rawResetToken = generateRandomToken()
    const hashedResetToken = hashToken(rawResetToken)
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedResetToken,
        resetPasswordExpires,
      },
    })

    const emailResult = await sendPasswordResetEmail(cleanEmail, rawResetToken, user.name)

    return NextResponse.json({
      success: true,
      message:
        'If an account is associated with this email, instructions to reset your password have been dispatched.',
      reset: {
        delivered: emailResult.delivered,
        providerConfigured: emailResult.providerConfigured,
        notice: emailResult.message,
        actionUrl: emailResult.actionUrl,
        token: emailResult.token,
      },
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An unexpected internal error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
