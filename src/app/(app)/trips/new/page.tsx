'use client'

import React from 'react'
import { ModulePlaceholder } from '@/modules/layout/ModulePlaceholder'
import { PlusCircle } from 'lucide-react'

export default function CreateTripPage() {
  return (
    <ModulePlaceholder
      title="Create & Dispatch Trip"
      subtitle="Assign tractor-trailer combinations, drivers, and cargo manifests"
      section="Fleet Operations"
      icon={PlusCircle}
      subphaseBadge="Subphase 5 Target"
      statusNote="Create & Dispatch Trip interface initialized. Connected to FleetVision AI telemetry services."
      highlights={[
        { label: 'Sub-Module', value: 'CreateTrip', detail: 'Route ready' },
        { label: 'Security Context', value: 'Operator Tier-1', detail: 'Token verified' },
        { label: 'API Gateway', value: 'REST / Telemetry', detail: 'Backend linked' },
      ]}
    />
  )
}
