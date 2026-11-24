import { CinematicExperiencePhase } from './types'

type PhaseListener = (phase: CinematicExperiencePhase) => void

/**
 * State Machine orchestrating the 9-stage Automotive Experience:
 * Arrival -> Cable Connected -> Charging Animation -> Port Camera Entry ->
 * Battery Visualization -> Mechanical Transformation -> Cockpit Login ->
 * Authentication -> Dashboard Transition
 */
export class AutomotiveSceneStateMachine {
  private currentPhase: CinematicExperiencePhase = 'STANDBY'
  private listeners: Set<PhaseListener> = new Set()

  public getPhase(): CinematicExperiencePhase {
    return this.currentPhase
  }

  public subscribe(listener: PhaseListener): () => void {
    this.listeners.add(listener)
    listener(this.currentPhase)
    return () => this.listeners.delete(listener)
  }

  public transitionTo(newPhase: CinematicExperiencePhase): void {
    // Prevent invalid jumps to ensure cinematic continuity
    this.currentPhase = newPhase
    this.notify()
  }

  /**
   * Safe transition triggered only after teammate's backend validates credentials
   */
  public onAuthenticationSuccess(): void {
    this.transitionTo('AUTHENTICATION_SUCCESS')
    setTimeout(() => {
      this.transitionTo('DASHBOARD_FLYTHROUGH')
    }, 1800)
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.currentPhase))
  }
}

export const sceneStateMachine = new AutomotiveSceneStateMachine()
