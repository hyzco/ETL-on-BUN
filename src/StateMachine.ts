export enum STATES {
  IDLE = "IDLE",
  READY = "READY",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

type transitionMap = Map<STATES, STATES[]>;

export default class StateMachine {
  currState: STATES;
  transitions: transitionMap;
  constructor(initialState: STATES) {
    this.currState = initialState;
    this.transitions = new Map<STATES, STATES[]>();
  }

  getState() {
    return this.currState;
  }

  addTransition(state: STATES, allowedTransitions: STATES[]) {
    this.transitions.set(state, allowedTransitions);
  }

  canTransitionTo(state: STATES) {
    const allowed = this.transitions.get(this.getState());
    return allowed.includes(state);
  }

  transitionTo(state: STATES) {
    if (this.canTransitionTo(state)) {
      console.info(`Transitioning from ${this.currState} to ${state}.`);
      this.currState = state; // Update currState consistently
    } else {
      throw new Error(
        `Invalid state transition from ${this.currState} to ${state}`
      );
    }
  }
}
