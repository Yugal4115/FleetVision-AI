'use client'

import React from 'react'
import { ModulePlaceholder } from '@/modules/layout/ModulePlaceholder'
import { UserPlus } from 'lucide-react'

export default function AddDriverPage() {
  return (
    <ModulePlaceholder
      title="Onboard New Driver"
      subtitle="Enroll commercial operator with HGV license and biometric verification"
      section="Fleet Operations"
      icon={UserPlus}
      subphaseBadge="Subphase 4 Target"
      statusNote="Onboard New Driver interface initialized. Connected to FleetVision AI telemetry services."
      highlights={[
        { label: 'Sub-Module', value: 'AddDriver', detail: 'Route ready' },
        { label: 'Security Context', value: 'Operator Tier-1', detail: 'Token verified' },
        { label: 'API Gateway', value: 'REST / Telemetry', detail: 'Backend linked' },
      ]}
    />
  )
}
