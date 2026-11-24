/**
 * FLEETVISION AI — OFFICIAL 12-SWATCH SUNSET COLOR DESIGN SYSTEM
 * 
 * Sourced directly from approved brand palette swatch:
 * Row 1:
 * - Rich Earth Rust:       #84492d (Structural titles, grounded badges, rich borders)
 * - Deep Crimson Rust:     #a02515 (High-priority alerts, dark crimson highlights)
 * - Vibrant Tangerine:     #f7801b (Primary interactive CTA, active magnetic pill, key highlights)
 * - Golden Amber:          #fba41c (Status badges, telemetry metrics, warm hover states)
 * 
 * Row 2:
 * - Copper Sienna:         #af6438 (Warm secondary accents, category badges)
 * - Crimson Sunset:        #d33e1b (Active tabs, gradient endpoints, primary alerts)
 * - Deep Espresso:         #4d2e2a (Primary text, high-contrast headings, dark structural chrome)
 * - Burnt Orange:          #e35020 (Accent buttons, active states, quick action pills)
 * 
 * Row 3:
 * - Warm Ochre:            #d2833f (Warm neutral surfaces, secondary indicators)
 * - Sunburst Gold:         #fcbf28 (EV charging, battery voltage, optimum score ratings)
 * - Sunset Gold:           #fcb234 (Warning indicators, secondary gold accents)
 * - Warm Sandstone:        #bf7e4d (Dividers, borders, subtle line accents)
 * 
 * Neutral Canvas:
 * - Pure White:            #FFFFFF (Card backgrounds, clean negative space)
 * - Warm Cream Ground:     #FFF8F2 (Soft ambient background, clean canvas)
 * - Warm Peach:            #FFF1E6 (Subtle container surface, pill backgrounds)
 */

export const FLEET_COLORS = {
  // 12 Swatch Palette Core
  richEarthRust: '#84492d',
  deepCrimsonRust: '#a02515',
  vibrantTangerine: '#f7801b',
  goldenAmber: '#fba41c',
  copperSienna: '#af6438',
  crimsonSunset: '#d33e1b',
  deepEspresso: '#4d2e2a',
  burntOrange: '#e35020',
  warmOchre: '#d2833f',
  sunburstGold: '#fcbf28',
  sunsetGold: '#fcb234',
  warmSandstone: '#bf7e4d',

  // Surface Neutrals
  white: '#FFFFFF',
  warmCreamGround: '#FFF8F2',
  warmPeach: '#FFF1E6',
  softNeutral: '#FAFAF9',
  subtleLine: '#E5DFD7',

  // Semantic Design Aliases
  primary: '#f7801b',       // Vibrant Tangerine
  primaryDark: '#e35020',   // Burnt Orange
  primaryCrimson: '#d33e1b',// Crimson Sunset
  deepText: '#4d2e2a',      // Deep Espresso
  deepHeading: '#84492d',   // Rich Earth Rust
  warning: '#fcb234',       // Sunset Gold
  voltageGold: '#fcbf28',   // Sunburst Gold (EV / Live Voltage)
  border: '#bf7e4d',        // Warm Sandstone

  // Legacy Compatibility Mappings
  deepBlue: '#4d2e2a',      // Mapped to Deep Espresso
  deepSlate: '#4d2e2a',
  charcoal: '#4d2e2a',
  sunsetOrange: '#f7801b',  // Mapped to Vibrant Tangerine
  vibrantOrange: '#e35020', // Mapped to Burnt Orange
  electricYellow: '#fcbf28',// Mapped to Sunburst Gold
  warmCream: '#FFF8F2',
  sunsetCream: '#FFF1E6',

  // Functional Semantic Surfaces
  surfaceVoid: '#FFF8F2',
  surfaceBase: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceOverlay: '#FFF1E6',
  surfaceBorder: '#E5DFD7',
  surfaceBorderStrong: '#bf7e4d',

  // Text Hierarchy
  textPrimary: '#4d2e2a',
  textSecondary: '#84492d',
  textMuted: '#af6438',
  textInverted: '#FFFFFF',

  // Graphite Icon & Hardware Pod System
  graphite: {
    podBg: 'linear-gradient(135deg, #2D3139 0%, #1E2128 50%, #101216 100%)',
    podBorder: '#3E4452',
    podBorderHover: '#6B7280',
    iconColor: '#F3F4F6',
    iconColorMuted: '#9CA3AF',
    glow: 'rgba(30, 41, 59, 0.5)',
  },
} as const

export const MODULE_COLOR_MAP = {
  dashboard: {
    primary: FLEET_COLORS.deepEspresso,
    accent: FLEET_COLORS.vibrantTangerine,
    highlight: FLEET_COLORS.goldenAmber,
  },
  vehicleExplorer: {
    primary: FLEET_COLORS.deepEspresso,
    accent: FLEET_COLORS.vibrantTangerine,
    highlight: FLEET_COLORS.goldenAmber,
  },
} as const
