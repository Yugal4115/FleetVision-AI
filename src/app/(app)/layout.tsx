import React from 'react'
import { AppLayout } from '@/modules/layout/AppLayout'

export default function AuthenticatedRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
