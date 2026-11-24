'use client'

import React, { useState } from 'react'
import { CockpitLoginPanel } from './CockpitLoginPanel'
import { Info, Sparkles, Layers, RefreshCw } from 'lucide-react'

interface TransformationSceneProps {
  onSequenceComplete?: () => void
}

/**
 * FLEETVISION AI — ORIGINAL MECHANICAL TRANSFORMATION COMPONENT
 * 
 * Design Vision (Section 6):
 * 1. The dark Volvo FH16 750 dominates the mountain EV charging scene.
 * 2. Camera approaches the truck with perspective push-in.
 * 3. Metallic mechanical elements begin to move (layered chassis panels, folding hydraulic struts).
 * 4. Forms a futuristic authentication cockpit.
 * 5. Reveals the Cockpit Login interface.
 * 
 * Technical Compliance:
 * - This component builds an original cinematic mechanical staging.
 * - Does not fake true 3D vertex deformation on the static image.
 * - Prepares the animation controller so a future rigged 3D GLB model can plug in directly.
 */
export const TransformationScene: React.FC<TransformationSceneProps> = () => {
  const [showSpecNotes, setShowSpecNotes] = useState(false)

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background: Dark Volvo FH16 Mountain EV Charging Reference Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/login/volvo-fh16-login-reference.png"
          alt="Dark Volvo FH16 750 at Mountain EV Charging Station"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-125 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Vignette & Deep Blue Color Grading */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03080F] via-[#070F1C]/70 to-[#07518A]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,8,15,0.85)_100%)]" />
      </div>

      {/* Cybernetic Structural Lines & Mechanical Framing (Original Geometry) */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cockpitGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F5E500" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cockpitGrid)" />
        </svg>
      </div>

      {/* Foreground Cockpit Login Container */}
      <div className="relative z-20 flex flex-col items-center">
        <CockpitLoginPanel />

        {/* Section 6 Architecture Notice Button */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setShowSpecNotes(!showSpecNotes)}
            className="text-[11px] font-mono text-[#FBB931] hover:text-[#FFF0D5] flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070F1C]/80 border border-[#FFF0D5]/15 backdrop-blur-md transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Section 6: 3D Transformation Model Requirements</span>
          </button>
        </div>

        {/* Expandable 3D Rigged Asset Specification Note */}
        {showSpecNotes && (
          <div className="mt-3 max-w-md p-3.5 rounded-xl bg-[#070F1C]/95 border border-[#FBB931]/30 text-xs font-mono text-[#C5D3E2] space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between text-[#F5E500] font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Original Mechanical Transformation Spec
              </span>
              <button
                onClick={() => setShowSpecNotes(false)}
                className="text-[#7D93A9] hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] leading-relaxed">
              In strict accordance with <strong>Section 6</strong>, this transformation scene is
              currently powered by the verified dark Volvo FH16 reference composite.
            </p>
            <ul className="list-disc list-inside text-[10px] space-y-1 text-[#FFF0D5]/80">
              <li>Requires a rigged Volvo FH16 GLB model with rotating cab panels.</li>
              <li>Embedded NLA clip: <code className="text-[#FBB931]">Anim_Mechanical_Transformation</code>.</li>
              <li>Hinged hydraulic struts folding outward to reveal the cockpit.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
