/**
 * FLEETVISION AI — 3D ASSET SPECIFICATION CONTRACT
 * 
 * Instructions for 3D Artists / Blender Engineers supplying the Volvo FH Aero Electric asset:
 * 
 * 1. File Format:
 *    - Binary glTF (.glb) with Draco mesh compression & KTX2 texture compression.
 *    - Target polycount: < 180,000 tris for desktop real-time rendering.
 * 
 * 2. Hierarchy & Node Naming:
 *    - Root: "Volvo_FH_Aero_Electric_Root"
 *    - Cabin: "Body_Cabin", "Door_Left", "Door_Right", "Windshield_Aero"
 *    - Interior: "Interior_Cockpit", "Steering_Wheel", "HUD_Display_Mesh", "Driver_Seat"
 *    - Powertrain: "Quad_Electric_Motors", "Drive_Shaft", "Inverter_Unit"
 *    - Energy Storage: "Battery_Pack_Side_Left", "Battery_Pack_Side_Right", "Charging_Port_Door", "CCS2_Socket"
 *    - Wheels: "Wheel_FL", "Wheel_FR", "Wheel_RL", "Wheel_RR"
 *    - Transformation Parts: "Aero_Foil_Left", "Aero_Foil_Right", "Front_Grille_Active_Aero"
 * 
 * 3. Required Animation Clips (embedded in GLB):
 *    - "Anim_Arrival_Roll" (Duration: 3.5s)
 *    - "Anim_Charging_Port_Open" (Duration: 1.2s)
 *    - "Anim_Door_Left_Open" (Duration: 1.5s)
 *    - "Anim_Door_Right_Open" (Duration: 1.5s)
 *    - "Anim_Mechanical_Transformation" (Duration: 4.0s - Transformers inspired sequence)
 * 
 * 4. PBR Materials:
 *    - CarPaint (Metallic Flake): Principled BSDF, Metallic 0.85, Roughness 0.25
 *    - Glass (Cockpit & Cameras): Transmission 0.95, Roughness 0.05, IOR 1.52
 *    - Emissive (Aero lights & charging indicator): Emissive strength 5.0 (#F5E500 / #07518A)
 */

export interface IVolvoAssetValidation {
  isValid: boolean
  missingNodes: string[]
  missingAnimations: string[]
  triCount?: number
  fileSizeBytes?: number
}

export const MANDATORY_GLTF_NODES = [
  'Volvo_FH_Aero_Electric_Root',
  'Body_Cabin',
  'Interior_Cockpit',
  'Charging_Port_Door',
  'Battery_Pack_Side_Left',
  'Battery_Pack_Side_Right',
] as const

export const MANDATORY_ANIMATION_CLIPS = [
  'Anim_Charging_Port_Open',
  'Anim_Mechanical_Transformation',
] as const
