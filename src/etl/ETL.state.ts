import StateMachine, { STATES } from "../StateMachine.js";

export default class EtlState extends StateMachine {
  constructor(initialState: STATES) {
    super(initialState);
    this.initTransitions();
  }

  initTransitions() {
    super.addTransition(STATES.IDLE, [STATES.READY, STATES.FAILED]);
    super.addTransition(STATES.READY, [STATES.RUNNING]);
    super.addTransition(STATES.RUNNING, [STATES.COMPLETED, STATES.FAILED]);
    super.addTransition(STATES.FAILED, [STATES.READY]);
    super.addTransition(STATES.COMPLETED, [STATES.READY]);
  }
}
