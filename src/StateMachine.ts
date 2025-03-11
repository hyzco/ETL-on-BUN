// File: lib/etl/StateMachine.ts

/**
 * Enum defining the possible states of the ETL process
 */
export enum STATES {
  IDLE = "IDLE",
  READY = "READY",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

/**
 * Generic state machine implementation to manage ETL state transitions
 */
export default class StateMachine {
  #state: STATES;
  readonly #allowedTransitions: Map<STATES, STATES[]> = new Map();

  /**
   * Create a new state machine with the specified initial state
   * @param initialState The initial state for the machine
   */
  constructor(initialState: STATES) {
    this.#state = initialState;
  }

  /**
   * Get the current state
   * @returns Current state
   */
  getState(): STATES {
    return this.#state;
  }

  /**
   * Define allowed state transitions
   * @param fromState The starting state
   * @param toStates Array of states that can be transitioned to
   */
  addTransition(fromState: STATES, toStates: STATES[]) {
    this.#allowedTransitions.set(fromState, toStates);
  }

  /**
   * Attempt to transition to a new state
   * @param newState The target state
   * @returns true if transition successful, false otherwise
   */
  transitionTo(newState: STATES): boolean {
    const allowedStates = this.#allowedTransitions.get(this.#state);
    
    if (!allowedStates) {
      console.error(`No transitions defined for state: ${this.#state}`);
      return false;
    }
    
    if (!allowedStates.includes(newState)) {
      console.error(`Transition from ${this.#state} to ${newState} not allowed`);
      console.error(`Allowed transitions: ${allowedStates.join(', ')}`);
      return false;
    }
    
    console.log(`State transition: ${this.#state} -> ${newState}`);
    this.#state = newState;
    return true;
  }
}