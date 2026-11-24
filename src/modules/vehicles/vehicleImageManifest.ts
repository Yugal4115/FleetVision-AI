/**
 * FLEETVISION AI — REAL COMMERCIAL HEAVY TRUCK MANIFEST
 * Every single fleet unit (FV-001 through FV-014, FV-017, FV-028) is mapped to
 * an authentic, high-definition photorealistic commercial heavy truck studio render.
 * ZERO cartoon / flat 2D SVGs anywhere.
 */

export interface IVehicleImageSet {
  slug: string
  vehicleNumber: string
  manufacturer: string
  model: string
  category: string
  colorDescription: string
  turntablePreview?: string
  dualStagePreview?: string
  has360View?: boolean
  angles: {
    front: string
    'driver-side': string
    rear: string
    'passenger-side': string
  }
}

export const VEHICLE_IMAGE_MAP: Record<string, IVehicleImageSet> = {
  // FV-001: Volvo FH Aero Electric
  'fv-001': {
    slug: 'volvo-fh-aero',
    vehicleNumber: 'FV-001',
    manufacturer: 'Volvo',
    model: 'Volvo FH Aero Electric',
    category: 'Heavy Electric Tractor-Trailer',
    colorDescription: 'Studio Teal Metallic',
    has360View: true,
    angles: {
      front: '/assets/vehicles/volvo-fh-aero/front.webp',
      'driver-side': '/assets/vehicles/volvo-fh-aero/driver-side.webp',
      rear: '/assets/vehicles/volvo-fh-aero/rear.webp',
      'passenger-side': '/assets/vehicles/volvo-fh-aero/passenger-side.webp',
    },
  },

  // FV-002: Scania Super 560 R 6x2 Hauler
  'fv-002': {
    slug: 'scania-560-r',
    vehicleNumber: 'FV-002',
    manufacturer: 'Scania',
    model: 'Scania Super 560 R 6x2 Hauler',
    category: 'Heavy Commercial Transport',
    colorDescription: 'Nordic Polar Silver Metallic',
    has360View: true,
    angles: {
      front: '/assets/vehicles/scania-560-r/front.webp',
      'driver-side': '/assets/vehicles/scania-560-r/driver-side.webp',
      rear: '/assets/vehicles/scania-560-r/rear.webp',
      'passenger-side': '/assets/vehicles/scania-560-r/passenger-side.webp',
    },
  },

  // FV-003: Mercedes-Benz Actros L 1863 Edition
  'fv-003': {
    slug: 'mercedes-actros-l',
    vehicleNumber: 'FV-003',
    manufacturer: 'Mercedes-Benz',
    model: 'Mercedes-Benz Actros L 1863 Edition',
    category: 'Flagship Long-Haul Tractor',
    colorDescription: 'Deep Sapphire Actros Blue',
    has360View: true,
    angles: {
      front: '/assets/vehicles/mercedes-actros-l/front.webp',
      'driver-side': '/assets/vehicles/mercedes-actros-l/driver-side.webp',
      rear: '/assets/vehicles/mercedes-actros-l/rear.webp',
      'passenger-side': '/assets/vehicles/mercedes-actros-l/passenger-side.webp',
    },
  },

  // FV-004: MAN TGX 18.640 PerformanceLine
  'fv-004': {
    slug: 'man-tgx-18640',
    vehicleNumber: 'FV-004',
    manufacturer: 'MAN',
    model: 'MAN TGX 18.640 PerformanceLine',
    category: 'Heavy Commercial Hauler',
    colorDescription: 'Commercial Amber Gold',
    has360View: true,
    angles: {
      front: '/assets/vehicles/man-tgx-18640/front.webp',
      'driver-side': '/assets/vehicles/man-tgx-18640/driver-side.webp',
      rear: '/assets/vehicles/man-tgx-18640/rear.webp',
      'passenger-side': '/assets/vehicles/man-tgx-18640/passenger-side.webp',
    },
  },

  // FV-005: MAN eTGX Ultra Electric Heavy Hauler
  'fv-005': {
    slug: 'man-etgx-ultra',
    vehicleNumber: 'FV-005',
    manufacturer: 'MAN',
    model: 'MAN eTGX Ultra Electric Heavy Hauler',
    category: 'Ultra Long-Range Electric Hauler',
    colorDescription: 'Arctic Pure White & Aerodynamic Package',
    has360View: true,
    angles: {
      front: '/assets/vehicles/man-etgx-ultra/front.webp',
      'driver-side': '/assets/vehicles/man-etgx-ultra/driver-side.webp',
      rear: '/assets/vehicles/man-etgx-ultra/rear.webp',
      'passenger-side': '/assets/vehicles/man-etgx-ultra/passenger-side.webp',
    },
  },

  // FV-006: Scania 770 S V8 Heavy Hauler
  'fv-006': {
    slug: 'scania-770-s',
    vehicleNumber: 'FV-006',
    manufacturer: 'Scania',
    model: 'Scania 770 S V8 Heavy Hauler',
    category: 'Flagship Heavy Tractor',
    colorDescription: 'Obsidian Black & V8 Grille',
    has360View: true,
    angles: {
      front: '/assets/vehicles/scania-770-s/front.webp',
      'driver-side': '/assets/vehicles/scania-770-s/driver-side.webp',
      rear: '/assets/vehicles/scania-770-s/rear.webp',
      'passenger-side': '/assets/vehicles/scania-770-s/passenger-side.webp',
    },
  },

  // FV-007: Volvo FM Electric 460 Globetrotter
  'fv-007': {
    slug: 'volvo-fm-electric',
    vehicleNumber: 'FV-007',
    manufacturer: 'Volvo',
    model: 'Volvo FM Electric 460 Globetrotter',
    category: 'Commercial Electric Hauler',
    colorDescription: 'Slate Granite Grey',
    has360View: true,
    angles: {
      front: '/assets/vehicles/volvo-fm-electric/front.webp',
      'driver-side': '/assets/vehicles/volvo-fm-electric/driver-side.webp',
      rear: '/assets/vehicles/volvo-fm-electric/rear.webp',
      'passenger-side': '/assets/vehicles/volvo-fm-electric/passenger-side.webp',
    },
  },

  // FV-008: DAF XG+ 530 Super Space Cab
  'fv-008': {
    slug: 'daf-xg-530',
    vehicleNumber: 'FV-008',
    manufacturer: 'DAF',
    model: 'DAF XG+ 530 Super Space Cab',
    category: 'Extended Sleeper Commercial Tractor',
    colorDescription: 'Platinum Champagne Metallic',
    has360View: true,
    angles: {
      front: '/assets/vehicles/daf-xg-530/front.webp',
      'driver-side': '/assets/vehicles/daf-xg-530/driver-side.webp',
      rear: '/assets/vehicles/daf-xg-530/rear.webp',
      'passenger-side': '/assets/vehicles/daf-xg-530/passenger-side.webp',
    },
  },

  // FV-009: Volvo FH 500 I-Save Euro 6d
  'fv-009': {
    slug: 'volvo-fh-500',
    vehicleNumber: 'FV-009',
    manufacturer: 'Volvo',
    model: 'Volvo FH 500 I-Save Euro 6d',
    category: 'Smart Long-Haul Truck',
    colorDescription: 'Deep Teal Cyan',
    has360View: true,
    angles: {
      front: '/assets/vehicles/volvo-fh-500/front.webp',
      'driver-side': '/assets/vehicles/volvo-fh-500/driver-side.webp',
      rear: '/assets/vehicles/volvo-fh-500/rear.webp',
      'passenger-side': '/assets/vehicles/volvo-fh-500/passenger-side.webp',
    },
  },

  // FV-010: Mercedes-Benz eActros 600 LongHaul
  'fv-010': {
    slug: 'mercedes-eactros-600',
    vehicleNumber: 'FV-010',
    manufacturer: 'Mercedes-Benz',
    model: 'Mercedes-Benz eActros 600 LongHaul',
    category: 'Heavy Electric Transport',
    colorDescription: 'Graphite Metallic & Aerodynamic Fairings',
    has360View: true,
    angles: {
      front: '/assets/vehicles/mercedes-eactros-600/front.webp',
      'driver-side': '/assets/vehicles/mercedes-eactros-600/driver-side.webp',
      rear: '/assets/vehicles/mercedes-eactros-600/rear.webp',
      'passenger-side': '/assets/vehicles/mercedes-eactros-600/passenger-side.webp',
    },
  },

  // FV-011: Iveco S-Way 570 Heavy Duty
  'fv-011': {
    slug: 'iveco-s-way-570',
    vehicleNumber: 'FV-011',
    manufacturer: 'Iveco',
    model: 'Iveco S-Way 570 Heavy Duty',
    category: 'Heavy Commercial Rig',
    colorDescription: 'Alpine Arctic White & Aerodynamic Cab',
    has360View: true,
    angles: {
      front: '/assets/vehicles/iveco-s-way-570/front.webp',
      'driver-side': '/assets/vehicles/iveco-s-way-570/driver-side.webp',
      rear: '/assets/vehicles/iveco-s-way-570/rear.webp',
      'passenger-side': '/assets/vehicles/iveco-s-way-570/passenger-side.webp',
    },
  },

  // FV-012: Renault Trucks T High 520
  'fv-012': {
    slug: 'renault-t-high',
    vehicleNumber: 'FV-012',
    manufacturer: 'Renault Trucks',
    model: 'Renault Trucks T High 520',
    category: 'High-Roof Commercial Sleeper',
    colorDescription: 'Champagne Gold & Chrome Grille',
    has360View: true,
    angles: {
      front: '/assets/vehicles/renault-t-high/front.webp',
      'driver-side': '/assets/vehicles/renault-t-high/driver-side.webp',
      rear: '/assets/vehicles/renault-t-high/rear.webp',
      'passenger-side': '/assets/vehicles/renault-t-high/passenger-side.webp',
    },
  },

  // FV-013: Scania 660 S V8 Highline Hauler
  'fv-013': {
    slug: 'scania-660-s',
    vehicleNumber: 'FV-013',
    manufacturer: 'Scania',
    model: 'Scania 660 S V8 Highline Hauler',
    category: 'Heavy Duty Commercial Hauler',
    colorDescription: 'Flame Sunset Orange & Black Trim',
    has360View: true,
    angles: {
      front: '/assets/vehicles/scania-660-s/front.webp',
      'driver-side': '/assets/vehicles/scania-660-s/driver-side.webp',
      rear: '/assets/vehicles/scania-660-s/rear.webp',
      'passenger-side': '/assets/vehicles/scania-660-s/passenger-side.webp',
    },
  },

  // FV-014: Volvo FH16 750 Euro 6
  'fv-014': {
    slug: 'volvo-fh16-750',
    vehicleNumber: 'FV-014',
    manufacturer: 'Volvo',
    model: 'Volvo FH16 750 Euro 6',
    category: 'Heavy Commercial Hauler',
    colorDescription: 'Baltic Slate Metallic & FH16 Banner',
    has360View: true,
    angles: {
      front: '/assets/vehicles/volvo-fh16-750/front.webp',
      'driver-side': '/assets/vehicles/volvo-fh16-750/driver-side.webp',
      rear: '/assets/vehicles/volvo-fh16-750/rear.webp',
      'passenger-side': '/assets/vehicles/volvo-fh16-750/passenger-side.webp',
    },
  },

  // FV-017: Mercedes-Benz Actros 1853
  'fv-017': {
    slug: 'mercedes-actros-1853',
    vehicleNumber: 'FV-017',
    manufacturer: 'Mercedes-Benz',
    model: 'Mercedes-Benz Actros 1853',
    category: 'Heavy Electric Tractor',
    colorDescription: 'Graphite Metallic on Halo Studio Podium',
    has360View: true,
    turntablePreview: '/assets/vehicles/mercedes-actros-1853/front.webp',
    angles: {
      front: '/assets/vehicles/mercedes-actros-1853/front.webp',
      'driver-side': '/assets/vehicles/mercedes-actros-1853/driver-side.webp',
      rear: '/assets/vehicles/mercedes-actros-1853/rear.webp',
      'passenger-side': '/assets/vehicles/mercedes-actros-1853/passenger-side.webp',
    },
  },

  // FV-028: Volvo FH Aero 780
  'fv-028': {
    slug: 'volvo-fh-aero-780',
    vehicleNumber: 'FV-028',
    manufacturer: 'Volvo',
    model: 'Volvo FH Aero 780',
    category: 'Heavy European 6x4 Tractor',
    colorDescription: 'Deep Sapphire Globetrotter Cab',
    has360View: true,
    dualStagePreview: '/assets/vehicles/volvo-fh-aero-780/dual-stage.webp',
    turntablePreview: '/assets/vehicles/volvo-fh-aero-780/turntable-side.webp',
    angles: {
      front: '/assets/vehicles/volvo-fh-aero-780/front.webp',
      'driver-side': '/assets/vehicles/volvo-fh-aero-780/turntable-side.webp',
      rear: '/assets/vehicles/volvo-fh-aero/rear.webp',
      'passenger-side': '/assets/vehicles/volvo-fh-aero/passenger-side.webp',
    },
  },
}

/**
 * Resolve full vehicle image set by ID or vehicleNumber or fuzzy match
 */
export function getVehicleImageSet(identifier: {
  id?: string
  vehicleNumber?: string
  model?: string
  manufacturer?: string
}): IVehicleImageSet {
  // 1. Direct vehicleNumber match (e.g. FV-001, FV-002 ... FV-028)
  if (identifier.vehicleNumber) {
    const key = identifier.vehicleNumber.toLowerCase()
    if (VEHICLE_IMAGE_MAP[key]) return VEHICLE_IMAGE_MAP[key]
    const found = Object.values(VEHICLE_IMAGE_MAP).find(
      (v) => v.vehicleNumber.toLowerCase() === key
    )
    if (found) return found
  }

  // 2. Direct ID match
  if (identifier.id && VEHICLE_IMAGE_MAP[identifier.id]) {
    return VEHICLE_IMAGE_MAP[identifier.id]
  }

  // 3. Match by model / manufacturer keywords
  const modelStr = `${identifier.manufacturer || ''} ${identifier.model || ''}`.toLowerCase()
  if (modelStr.includes('780') || modelStr.includes('aero 780')) {
    return VEHICLE_IMAGE_MAP['fv-028']
  }
  if (modelStr.includes('actros') || modelStr.includes('mercedes')) {
    return VEHICLE_IMAGE_MAP['fv-017']
  }
  if (modelStr.includes('fh16') || modelStr.includes('750')) {
    return VEHICLE_IMAGE_MAP['fv-014']
  }
  if (modelStr.includes('scania') || modelStr.includes('770')) {
    return VEHICLE_IMAGE_MAP['fv-006']
  }
  if (modelStr.includes('man') || modelStr.includes('tgx')) {
    return VEHICLE_IMAGE_MAP['fv-004']
  }
  if (modelStr.includes('daf') || modelStr.includes('xg')) {
    return VEHICLE_IMAGE_MAP['fv-008']
  }
  if (modelStr.includes('iveco') || modelStr.includes('way')) {
    return VEHICLE_IMAGE_MAP['fv-011']
  }
  if (modelStr.includes('renault')) {
    return VEHICLE_IMAGE_MAP['fv-012']
  }
  if (modelStr.includes('volvo')) {
    return VEHICLE_IMAGE_MAP['fv-001']
  }

  const fuzzy = Object.values(VEHICLE_IMAGE_MAP).find((v) =>
    modelStr.includes(v.model.toLowerCase()) || v.model.toLowerCase().includes(modelStr)
  )
  if (fuzzy) return fuzzy

  // Fallback to Volvo FH Aero heavy hauler
  return VEHICLE_IMAGE_MAP['fv-001']
}

/**
 * Get front image for Vehicle Collection card
 */
export function getVehicleCardFrontImage(identifier: {
  id?: string
  vehicleNumber?: string
  model?: string
  manufacturer?: string
}): string {
  const set = getVehicleImageSet(identifier)
  return set.angles.front
}
