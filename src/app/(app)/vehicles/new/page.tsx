'use client'

import React from 'react'
import { ModulePlaceholder } from '@/modules/layout/ModulePlaceholder'
import { Truck } from 'lucide-react'

export default function AddVehiclePage() {
  return (
    <ModulePlaceholder
      title="Register New Vehicle"
      subtitle="Commission new commercial tractor or trailer into the digital registry"
      section="Fleet Operations"
      icon={Truck}
      subphaseBadge="Subphase 3 Target"
      statusNote="Register New Vehicle interface initialized. Connected to FleetVision AI telemetry services."
      highlights={[
        { label: 'Sub-Module', value: 'AddVehicle', detail: 'Route ready' },
        { label: 'Security Context', value: 'Operator Tier-1', detail: 'Token verified' },
        { label: 'API Gateway', value: 'REST / Telemetry', detail: 'Backend linked' },
      ]}
    />
  )
}
