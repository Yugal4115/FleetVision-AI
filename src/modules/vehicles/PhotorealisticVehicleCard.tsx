'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  RotateCw,
  Gauge,
  Navigation,
  Globe,
  ArrowRight,
  Zap,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import { getVehicleImageSet, IVehicleImageSet } from './vehicleImageManifest'

export interface IVehicleCardData {
  id: string
  vehicleNumber: string
  model: string
  manufacturer: string
  registrationNumber: string
  fuelType: string
  engineDetails?: string | null
  odometer: number | null
  status: string
  company?: { name: string } | null
  _count?: { trips: number; maintenanceRecords?: number; fuelLogs?: number }
}

interface PhotorealisticVehicleCardProps {
  vehicle: IVehicleCardData
}

export const PhotorealisticVehicleCard: React.FC<PhotorealisticVehicleCardProps> = ({ vehicle }) => {
  const imageSet = getVehicleImageSet(vehicle)
  const isElectric = (vehicle.fuelType || '').toLowerCase() === 'electric'
  const isDiesel = (vehicle.fuelType || '').toLowerCase() === 'diesel'
  const isEuropean =
    vehicle.vehicleNumber === 'FV-028' ||
    (vehicle.engineDetails || '').toLowerCase().includes('euro') ||
    (vehicle.model || '').toLowerCase().includes('aero')

  // Interactive 360 preview state
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0)
  const [isRotating, setIsRotating] = useState(false)

  // Multi-angle rotation list for quick turntable inspection
  const availableAngles = [
    imageSet.angles.front,
    imageSet.turntablePreview || imageSet.angles['driver-side'],
    imageSet.angles.rear,
    imageSet.angles['passenger-side'],
  ]

  const handleNextAngle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveAngleIndex((prev) => (prev + 1) % availableAngles.length)
  }

  const handlePrevAngle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveAngleIndex((prev) => (prev - 1 + availableAngles.length) % availableAngles.length)
  }

  const currentDisplayImage = availableAngles[activeAngleIndex] || imageSet.angles.front

  const displayTitle = vehicle.model.toLowerCase().startsWith(vehicle.manufacturer.toLowerCase())
    ? vehicle.model
    : `${vehicle.manufacturer} ${vehicle.model}`

  return (
    <Link
      href={`/vehicles/${vehicle.id}`}
      className="group block rounded-3xl bg-white border border-[#EFE5DB] p-6 shadow-sm shadow-[#EA6113]/5 hover:shadow-xl hover:shadow-[#EA6113]/12 hover:border-[#EA6113]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EA6113] select-none relative"
    >
      <div>
        {/* 1. Header: Vehicle ID + Status and Powertrain Badges */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-sm font-extrabold text-[#C2410C] tracking-wide group-hover:text-[#EA6113] transition-colors">
            {vehicle.vehicleNumber}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Status Badge */}
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EAF7EE] text-[#1E7E34] border border-[#BDE7C7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28A745] animate-pulse" />
              {vehicle.status.toUpperCase()}
            </span>

            {/* Powertrain / Category Badge */}
            {isElectric ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                <Zap className="w-3 h-3 text-[#F59E0B]" />
                ELECTRIC
              </span>
            ) : isEuropean ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FFF1E6] text-[#C2410C] border border-[#FDBA74]">
                EUROPE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EDF5FD] text-[#0369A1] border border-[#BAE6FD]">
                {vehicle.fuelType.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* 2. Commercial Vehicle Title & Specifications */}
        <h3 className="text-xl sm:text-2xl font-bold font-inter text-[#1E293B] tracking-tight group-hover:text-[#EA6113] transition-colors mb-1 line-clamp-1">
          {displayTitle}
        </h3>
        <p className="text-xs font-mono text-[#64748B] mb-4 font-medium line-clamp-1">
          {vehicle.registrationNumber} · {vehicle.engineDetails || 'Heavy Commercial Powertrain'}
        </p>

        {/* 3. Photorealistic Commercial Vehicle Stage */}
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-white to-[#FFF6EE] border border-[#EFE5DB] mb-5 p-3 flex items-center justify-center group-hover:border-[#EA6113]/40 transition-colors shadow-inner">
          {/* Subtle Turntable Shadow & Orange Ring for Studio Realism */}
          <div className="absolute -bottom-6 w-3/4 h-12 rounded-[100%] bg-gradient-to-t from-[#EA6113]/10 to-transparent blur-md pointer-events-none" />

          {/* Conditional Dual-Stage View for FV-028 (User Image 4 exact match) */}
          {vehicle.vehicleNumber === 'FV-028' && imageSet.dualStagePreview ? (
            <div className="w-full h-full flex items-center justify-between relative">
              <img
                src={imageSet.dualStagePreview}
                alt={`${vehicle.manufacturer} ${vehicle.model} Dual View`}
                className="w-full h-full object-contain filter contrast-105 group-hover:scale-102 transition-transform duration-500"
              />
            </div>
          ) : (
            /* Single High-Definition Studio View */
            <div className="w-full h-full flex items-center justify-center relative">
              <img
                src={currentDisplayImage}
                alt={`${vehicle.manufacturer} ${vehicle.model}`}
                className="w-full h-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {/* Overlay: 360° Interactive View Indicator */}
          {imageSet.has360View && (
            <>
              {/* Bottom-Left 360° Badge (Image 2 style) */}
              {vehicle.vehicleNumber === 'FV-014' ? (
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[10px] font-mono font-bold text-[#EA6113] border border-[#FDBA74]/50 shadow-xs flex items-center gap-1.5">
                  <RotateCw className="w-3 h-3 text-[#EA6113] animate-spin-slow" />
                  <span>360° View</span>
                </div>
              ) : vehicle.vehicleNumber === 'FV-017' ? (
                /* Top-Right 360° Arc Badge (Image 3 style) */
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono font-bold text-[#1E293B] border border-[#E2E8F0] shadow-xs flex items-center gap-1">
                  <RotateCw className="w-3 h-3 text-[#EA6113]" />
                  <span>360°</span>
                </div>
              ) : null}
            </>
          )}

          {/* Overlay: Interactive Quick Rotation Buttons on Hover */}
          {availableAngles.length > 1 && vehicle.vehicleNumber !== 'FV-028' && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <button
                type="button"
                onClick={handlePrevAngle}
                className="w-7 h-7 rounded-full bg-white/95 shadow-md border border-[#E2E8F0] flex items-center justify-center text-[#EA6113] hover:bg-[#EA6113] hover:text-white transition-colors"
                title="Rotate View Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextAngle}
                className="w-7 h-7 rounded-full bg-white/95 shadow-md border border-[#E2E8F0] flex items-center justify-center text-[#EA6113] hover:bg-[#EA6113] hover:text-white transition-colors"
                title="Rotate View Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Overlay: VIEW UNIT Pill Button (Bottom Right) */}
          <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-mono font-extrabold text-[#1E293B] border border-[#E2E8F0] shadow-xs group-hover:bg-[#EA6113] group-hover:text-white group-hover:border-[#EA6113] transition-all flex items-center gap-1">
            <span>VIEW UNIT</span>
            <span className="text-[#EA6113] group-hover:text-white">→</span>
          </div>
        </div>

        {/* 4. Metric Telemetry Strip (Exact match to User Images 2, 3, 4) */}
        <div className="grid grid-cols-2 gap-3 pb-4 border-b border-[#EFE5DB] text-xs font-mono">
          {/* Odometer Box with Speedometer Icon */}
          <div className="p-3 rounded-2xl bg-[#FFF6EE] border border-[#F6E1D1] group-hover:bg-[#FFF1E6] transition-colors flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#F6E1D1] flex items-center justify-center text-[#EA6113] shrink-0 shadow-2xs">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#84492D] font-bold font-manrope block leading-tight">
                ODOMETER
              </span>
              <span className="font-extrabold font-inter text-sm text-[#1E293B]">
                {vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : '0 km'}
              </span>
            </div>
          </div>

          {/* Mission Trips Box with Route Pin Icon */}
          <div className="p-3 rounded-2xl bg-[#FFF6EE] border border-[#F6E1D1] group-hover:bg-[#FFF1E6] transition-colors flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#F6E1D1] flex items-center justify-center text-[#EA6113] shrink-0 shadow-2xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#84492D] font-bold font-manrope block leading-tight">
                MISSION TRIPS
              </span>
              <span className="font-extrabold font-inter text-sm text-[#EA6113]">
                {vehicle._count?.trips || 0} Trips
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Card Footer: Operational Hub Unit & Open Detail Console */}
      <div className="pt-3.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-[#78716C]">
          <Globe className="w-3.5 h-3.5 text-[#A8A29E]" />
          <span className="font-medium">Operational Hub Unit</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-bold font-manrope text-[#EA6113] group-hover:text-[#C2410C] transition-colors">
          <span>Open Detail Console</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
        </span>
      </div>
    </Link>
  )
}
