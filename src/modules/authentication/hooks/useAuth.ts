'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface IAuthUser {
  id: string
  email: string
  name: string
  role: string
  phone?: string | null
  avatar?: string | null
  isActive?: boolean
  emailVerified?: boolean
  createdAt?: string
  company?: {
    id: string
    name: string
    role?: string
  } | null
}

export type AuthStage =
  | 'idle'
  | 'submitting'
  | 'authenticating'
  | 'access_granted'
  | 'system_initialization'
  | 'transitioning'
  | 'error'

/**
 * FLEETVISION AI — AUTHENTICATION HOOK
 *
 * Rules Compliance:
 * - Server-managed session via HTTP-only cookies and /api/auth/me
 * - Fully synchronized with database user records and roles
 * - Manages multi-stage automotive cockpit verification states
 */
export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<IAuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [stage, setStage] = useState<AuthStage>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [initStep, setInitStep] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch verified session profile from server
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setToken('session-active')
        if (typeof window !== 'undefined') {
          localStorage.setItem('fleetvision_user', JSON.stringify(data.user))
          localStorage.setItem('fleetvision_token', 'session-active')
        }
      } else {
        setUser(null)
        setToken(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('fleetvision_user')
          localStorage.removeItem('fleetvision_token')
        }
      }
    } catch (err) {
      console.warn('Session check failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setErrorMessage(null)

      if (!email.trim() || !password) {
        setErrorMessage('Email and password credentials are required.')
        setStage('error')
        return false
      }

      setStage('submitting')

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        })

        const data = await res.json()

        if (!res.ok) {
          setErrorMessage(data.error || 'Authentication rejected by security gateway.')
          setStage('error')
          return false
        }

        // Genuine authentication verified by server
        setUser(data.user)
        setToken(data.token)

        if (typeof window !== 'undefined') {
          localStorage.setItem('fleetvision_user', JSON.stringify(data.user))
          localStorage.setItem('fleetvision_token', data.token)
        }

        // Trigger Access Granted cockpit sequence
        setStage('access_granted')

        // Multi-stage system initialization
        setTimeout(() => {
          setStage('system_initialization')
          setInitStep(1) // Establishing encrypted session
        }, 800)

        setTimeout(() => {
          setInitStep(2) // Loading authorized fleet profile
        }, 1600)

        setTimeout(() => {
          setInitStep(3) // Connecting live vehicle telemetry & AI services
        }, 2400)

        setTimeout(() => {
          setInitStep(4) // Launching Dashboard
          setStage('transitioning')
        }, 3200)

        setTimeout(() => {
          // Final transition to authenticated dashboard
          router.push('/dashboard')
        }, 3800)

        return true
      } catch (err: any) {
        console.error('Login network error:', err)
        setErrorMessage('Secure gateway unreachable. Please verify server status.')
        setStage('error')
        return false
      }
    },
    [router]
  )

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.warn('Logout network error:', err)
    } finally {
      setUser(null)
      setToken(null)
      setStage('idle')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fleetvision_token')
        localStorage.removeItem('fleetvision_user')
      }
      router.push('/')
    }
  }, [router])

  return {
    token,
    user,
    stage,
    initStep,
    errorMessage,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshUser,
    resetError: () => {
      setErrorMessage(null)
      setStage('idle')
    },
  }
}
