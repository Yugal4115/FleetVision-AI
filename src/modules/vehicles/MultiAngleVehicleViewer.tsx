'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Activity,
  CheckCircle2,
  Info,
  MoveHorizontal,
  LayoutGrid,
  Eye,
  EyeOff,
  Compass,
} from 'lucide-react'
import { VehicleViewAngle, IComponentHotspot, ComponentCategory } from './types'
import { VOLVO_FH_HOTSPOTS } from './vehicleHotspotsData'
import { ComponentInspectionSheet } from './ComponentInspectionSheet'
import { getVehicleImageSet } from './vehicleImageManifest'

interface MultiAngleVehicleViewerProps {
  vehicleId?: string
  vehicleNumber?: string
  vehicleModel?: string
  manufacturer?: string
  registrationNumber?: string
  className?: string
  onSelectHotspot?: (hotspot: IComponentHotspot) => void
}

export const MultiAngleVehicleViewer: React.FC<MultiAngleVehicleViewerProps> = ({
  vehicleId = 'FV-001',
  vehicleNumber = 'FV-001',
  vehicleModel = 'Volvo FH Aero Electric',
  manufacturer = 'Volvo',
  registrationNumber = 'DL-01-AB-1234',
  className = '',
  onSelectHotspot,
}) => {
  // Resolve vehicle-specific image set dynamically from clean assets
  const imageSet = getVehicleImageSet({
    id: vehicleId,
    vehicleNumber,
    model: vehicleModel,
    manufacturer,
  })

  const VIEW_ANGLES: Array<{
    id: VehicleViewAngle
    degree: string
    label: string
    subtitle: string
    imageSrc: string
  }> = [
    {
      id: 'front',
      degree: '0°',
      label: 'Front Fascia',
      subtitle: `${imageSet.manufacturer} Front Signature`,
      imageSrc: imageSet.angles.front,
    },
    {
      id: 'driver-side',
      degree: '90°',
      label: 'Driver Profile',
      subtitle: `${imageSet.colorDescription} Flank`,
      imageSrc: imageSet.angles['driver-side'],
    },
    {
      id: 'rear',
      degree: '180°',
      label: 'Rear Chassis',
      subtitle: 'Fifth Wheel & Aerodynamics',
      imageSrc: imageSet.angles.rear,
    },
    {
      id: 'passenger-side',
      degree: '270°',
      label: 'Passenger Profile',
      subtitle: 'Side Fairing & Power Unit',
      imageSrc: imageSet.angles['passenger-side'],
    },
  ]

  const [currentAngle, setCurrentAngle] = useState<VehicleViewAngle>('front')
  const [selectedHotspot, setSelectedHotspot] = useState<IComponentHotspot | null>(null)
  const [showHotspots, setShowHotspots] = useState(false)
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all')
  const [isRotating, setIsRotating] = useState(false)
  const [isQuadView, setIsQuadView] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [hoveredHotspot, setHoveredHotspot] = useState<IComponentHotspot | null>(null)

  // Drag interaction state
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)

  const angleOrder: VehicleViewAngle[] = ['front', 'driver-side', 'rear', 'passenger-side']

  // Auto-tour rotation timer
  useEffect(() => {
    if (!isRotating || isQuadView) return

    const interval = setInterval(() => {
      setCurrentAngle((prev) => {
        const nextIdx = (angleOrder.indexOf(prev) + 1) % angleOrder.length
        return angleOrder[nextIdx]
      })
    }, 2800)

    return () => clearInterval(interval)
  }, [isRotating, isQuadView])

  const nextAngle = () => {
    if (isRotating) setIsRotating(false)
    setCurrentAngle((prev) => {
      const idx = angleOrder.indexOf(prev)
      return angleOrder[(idx + 1) % angleOrder.length]
    })
  }

  const prevAngle = () => {
    if (isRotating) setIsRotating(false)
    setCurrentAngle((prev) => {
      const idx = angleOrder.indexOf(prev)
      return angleOrder[(idx - 1 + angleOrder.length) % angleOrder.length]
    })
  }

  // Pointer drag events for horizontal angle rotation (smooth 35px threshold)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isQuadView) return
    if (isRotating) setIsRotating(false)
    setIsDragging(true)
    setDragStartX(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isQuadView) return
    const diff = e.clientX - dragStartX
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        prevAngle()
      } else {
        nextAngle()
      }
      setDragStartX(e.clientX)
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextAngle()
      if (e.key === 'ArrowLeft') prevAngle()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const activeHotspots = VOLVO_FH_HOTSPOTS[currentAngle] || []
  const filteredHotspots = activeHotspots.filter(
    (hs) => activeCategory === 'all' || (hs.category as string) === activeCategory
  )

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(1, prev + delta), 2.2))
  }

  const resetZoom = () => setZoomLevel(1)

  const handleHotspotClick = (hs: IComponentHotspot) => {
    setSelectedHotspot(hs)
    if (onSelectHotspot) onSelectHotspot(hs)
  }

  const currentViewMeta = VIEW_ANGLES.find((v) => v.id === currentAngle)!

  return (
    <div
      className={`relative rounded-3xl bg-white border border-[#EADCD0] p-4 sm:p-6 shadow-sm flex flex-col ${className}`}
    >
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADCD0]">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EA6113] text-white">
              {imageSet.vehicleNumber}
            </span>
            <span className="text-xs font-mono font-bold text-[#EA6113] bg-[#FFF5EC] px-2.5 py-0.5 rounded-full border border-[#EA6113]/30">
              360° LIVE COMMERCIAL STUDIO TOUR
            </span>
            <span className="text-xs font-mono text-[#64748B]">
              {registrationNumber} · {imageSet.category}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-inter text-[#1E293B]">
            {imageSet.manufacturer} {imageSet.model}
          </h2>
          <span className="text-xs font-mono text-[#84492D] font-semibold">
            Color Specification: {imageSet.colorDescription}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Angle Switcher Buttons (0°, 90°, 180°, 270°) */}
          <div className="inline-flex rounded-xl bg-[#FFF5EC] border border-[#EADCD0] p-1">
            {VIEW_ANGLES.map((angle) => (
              <button
                key={angle.id}
                onClick={() => {
                  if (isRotating) setIsRotating(false)
                  setCurrentAngle(angle.id)
                  setIsQuadView(false)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                  currentAngle === angle.id && !isQuadView
                    ? 'bg-[#EA6113] text-white shadow-xs'
                    : 'text-[#84492D] hover:text-[#EA6113]'
                }`}
              >
                <span>{angle.degree}</span>
                <span className="hidden md:inline">{angle.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Hotspots Toggle */}
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              showHotspots
                ? 'bg-[#07518A] text-white border-[#07518A]'
                : 'bg-[#FFF5EC] border-[#EADCD0] text-[#07518A] hover:bg-white'
            }`}
            title="Toggle Component Diagnostics Hotspots"
          >
            {showHotspots ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">Hotspots</span>
          </button>

          {/* Quad View Toggle */}
          <button
            onClick={() => {
              if (isRotating) setIsRotating(false)
              setIsQuadView(!isQuadView)
            }}
            className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              isQuadView
                ? 'bg-[#84492D] text-white border-[#84492D]'
                : 'bg-[#FFF5EC] border-[#EADCD0] text-[#84492D] hover:bg-white'
            }`}
            title="Toggle 4-View Quad Display"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Quad View</span>
          </button>

          {/* Auto Tour Toggle */}
          <button
            onClick={() => {
              setIsQuadView(false)
              setIsRotating(!isRotating)
            }}
            className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              isRotating
                ? 'bg-[#EA6113] text-white border-[#EA6113]'
                : 'bg-[#FFF5EC] border-[#EADCD0] text-[#84492D] hover:bg-white'
            }`}
            title="Auto-Rotate Tour"
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isRotating ? 'Pause' : 'Tour'}</span>
          </button>

          {/* Zoom Controls */}
          {!isQuadView && (
            <div className="flex items-center rounded-xl bg-[#FFF5EC] border border-[#EADCD0] p-0.5">
              <button
                onClick={() => handleZoom(0.2)}
                className="p-1.5 rounded-lg hover:bg-white text-[#84492D] transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom(-0.2)}
                className="p-1.5 rounded-lg hover:bg-white text-[#84492D] transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="p-1.5 rounded-lg hover:bg-white text-[#84492D] transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Stage Area */}
      {isQuadView ? (
        /* 4-ANGLE QUAD VIEW MATRIX (Orthographic 90° Slices) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {VIEW_ANGLES.map((angle) => (
            <div
              key={angle.id}
              onClick={() => {
                setCurrentAngle(angle.id)
                setIsQuadView(false)
              }}
              className="group relative rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-white to-[#FFF6EE] border border-[#EADCD0] p-3 flex flex-col items-center justify-center cursor-pointer hover:border-[#EA6113] hover:shadow-md transition-all aspect-[16/10]"
            >
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-[#EA6113] border border-[#EADCD0] shadow-2xs">
                {angle.degree} · {angle.label}
              </div>
              <img
                src={angle.imageSrc}
                alt={`${imageSet.manufacturer} ${imageSet.model} - ${angle.label}`}
                className="w-full h-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="text-[10px] font-mono text-[#64748B] text-center mt-1">
                {angle.subtitle}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* SINGLE ANGLE INTERACTIVE VIEW WITH LIVE 360° TURNTABLE */
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: 'none' }}
          className="relative my-4 aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-white to-[#FFF6EE] border border-[#EADCD0] overflow-hidden select-none cursor-grab active:cursor-grabbing flex items-center justify-center group"
        >
          {/* Turntable Studio Floor with Glowing Ring */}
          <div className="absolute bottom-4 w-3/5 h-14 rounded-[100%] bg-gradient-to-t from-[#EA6113]/15 to-transparent blur-md pointer-events-none" />
          <div className="absolute bottom-6 w-1/2 h-8 rounded-[100%] border border-[#EA6113]/30 pointer-events-none" />

          {/* Interactive Vehicle Frame strictly constrained to vehicle aspect ratio */}
          <div
            className="relative w-full max-w-[620px] aspect-[512/341] transition-transform duration-300 flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={currentViewMeta.imageSrc}
              alt={`${imageSet.manufacturer} ${imageSet.model} - ${currentViewMeta.label}`}
              className="w-full h-full object-contain pointer-events-none transition-opacity duration-300 filter contrast-105"
            />

            {/* Hotspot Markers (Toggled via button, anchored cleanly on truck body) */}
            {showHotspots &&
              filteredHotspots.map((hs) => (
                <div
                  key={hs.id}
                  style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  onMouseEnter={() => setHoveredHotspot(hs)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleHotspotClick(hs)
                    }}
                    className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#EA6113] text-white shadow-lg border-2 border-white hover:scale-125 transition-transform"
                    aria-label={hs.name}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping absolute" />
                    <span className="w-2 h-2 rounded-full bg-white relative z-10" />
                  </button>

                  {/* Floating Tooltip */}
                  {hoveredHotspot?.id === hs.id && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 px-3 py-1.5 rounded-xl bg-[#0C1E36] text-white text-xs font-mono font-bold whitespace-nowrap shadow-xl border border-white/20 animate-in fade-in-50 zoom-in-95 pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EA6113]" />
                        <span>{hs.name}</span>
                      </div>
                      <span className="text-[10px] text-[#FED7AA] uppercase block font-normal">
                        {hs.condition.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Drag Helper Cue */}
          <div className="absolute top-3 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#EADCD0] text-[11px] font-mono text-[#84492D] shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#EA6113] animate-spin-slow" />
            <span>DRAG / SWIPE TO ROTATE 360° ({currentViewMeta.degree})</span>
          </div>

          {/* Quick Rotation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevAngle()
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#84492D] hover:text-[#EA6113] border border-[#EADCD0] flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95"
            aria-label="Previous viewing angle"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextAngle()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#84492D] hover:text-[#EA6113] border border-[#EADCD0] flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95"
            aria-label="Next viewing angle"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Angle Indicator Pill (Bottom Left) */}
          <div className="absolute bottom-3 left-4 z-10 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#EADCD0] text-xs font-mono text-[#84492D] shadow-xs flex items-center gap-2">
            <span className="font-extrabold text-[#EA6113]">{currentViewMeta.degree}</span>
            <span className="font-bold text-[#1E293B]">{currentViewMeta.label}</span>
            <span className="text-[#64748B] hidden sm:inline">· {currentViewMeta.subtitle}</span>
          </div>
        </div>
      )}

      {/* Component Inspection Sheet Drawer */}
      {selectedHotspot && (
        <ComponentInspectionSheet
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
        />
      )}
    </div>
  )
}
