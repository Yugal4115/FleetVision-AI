/**
 * FLEETVISION AI — 3D MECHANICAL TRANSFORMATION ASSET SPECIFICATION
 * 
 * Target Vehicle: Dark Volvo FH16 750 (Electric Commercial Rig)
 * Purpose: Original Mechanical Transformation to Cockpit HUD Login Interface
 * 
 * Strict Compliance:
 * - Original mechanical engineering design.
 * - NO copying of copyrighted Transformer characters, Autobots, Decepticons, or specific robot forms.
 * - The transformation is purely functional industrial/mechanical restructuring into a digital telemetry cockpit.
 */

export interface ITransformationRigRequirement {
  format: 'glTF 2.0 Binary (.glb)'
  dracoCompression: true
  polycountBudget: number // < 200,000 triangles
  pbrMaterials: {
    darkMetallicChassis: string
    highVoltageOrangeAccents: string
    illuminatedElectricYellowEmissive: string
    cockpitGlassTransmission: string
  }
  requiredDeformingNodes: string[]
  nlaAnimationClips: Array<{
    name: string
    durationSeconds: number
    description: string
  }>
}

export const VOLVO_FH16_TRANSFORMATION_SPEC: ITransformationRigRequirement = {
  format: 'glTF 2.0 Binary (.glb)',
  dracoCompression: true,
  polycountBudget: 185000,
  pbrMaterials: {
    darkMetallicChassis: 'Metallic 0.9, Roughness 0.2, Hex #0B1118',
    highVoltageOrangeAccents: 'Metallic 0.7, Roughness 0.3, Hex #EA6113',
    illuminatedElectricYellowEmissive: 'Emissive Strength 4.5, Hex #F5E500',
    cockpitGlassTransmission: 'Transmission 0.96, Roughness 0.04, IOR 1.52',
  },
  requiredDeformingNodes: [
    'Volvo_FH16_Chassis_Base',
    'Cab_Upper_Aero_Shell',
    'Left_Front_Fender_Hinged',
    'Right_Front_Fender_Hinged',
    'Front_Grille_Split_Upper',
    'Front_Grille_Split_Lower',
    'Left_A_Pillar_Hydraulic_Strut',
    'Right_A_Pillar_Hydraulic_Strut',
    'Cockpit_Frame_Folding_Arm_L',
    'Cockpit_Frame_Folding_Arm_R',
    'HUD_Primary_Hologram_Emitter',
    'Battery_Side_Fairing_L_Slide',
    'Battery_Side_Fairing_R_Slide',
  ],
  nlaAnimationClips: [
    {
      name: 'Anim_Stage1_TruckApproach',
      durationSeconds: 2.5,
      description: 'Truck rolls smoothly to a stop, air suspension releases with realistic pneumatic hiss.',
    },
    {
      name: 'Anim_Stage2_MechanicalUnlock',
      durationSeconds: 1.5,
      description: 'Side fairings slide rearward, front grille splits along center axis with hydraulic unlatching.',
    },
    {
      name: 'Anim_Stage3_CockpitAssembly',
      durationSeconds: 3.0,
      description: 'Cab shell tilts back, hydraulic struts articulate forward, locking into the Cockpit HUD frame.',
    },
    {
      name: 'Anim_Stage4_AuthSuccessEngage',
      durationSeconds: 2.0,
      description: 'HUD displays power up to full luminosity, energy pulse flows through orange conduits into the dashboard.',
    },
  ],
}
