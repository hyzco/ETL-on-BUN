// File: lib/etl/ETL.class.ts
import { STATES } from "../StateMachine.js";
import Stage from "./ETL.stage.class.js";
import EtlState from "./ETL.state.js";
import Step from "./ETL.step.class.js";

/**
 * Main ETL class to manage the entire pipeline
 * Provides methods for adding stages, setting data, and executing the ETL process
 */
class ETL {
  #etlData: any = null;
  readonly #state: EtlState = new EtlState(STATES.IDLE);
  stages: Stage[] = [];

  constructor() {
    this.init();
  }

  /**
   * Initialize the ETL process and set state to READY
   */
  init() {
    console.log("Current State: ", this.#state.getState());
    this.#state.transitionTo(STATES.READY);
  }

  /**
   * Add a stage to the ETL pipeline
   * @param stage The stage to add
   */
  addStage(stage: Stage) {
    this.stages.push(stage);
  }

  /**
   * Get all stages in the ETL pipeline
   * @returns Array of stages
   */
  getStages() {
    return this.stages;
  }

  /**
   * Set initial data for the ETL pipeline
   * @param data Initial data to set
   */
  setEtlData(data: any) {
    this.#etlData = data;
  }

  /**
   * Get the current ETL data
   * @returns Current ETL data
   */
  getEtlData() {
    return this.#etlData;
  }

  /**
   * Execute all stages in the ETL pipeline
   * @returns Result after all stages complete
   */
  async execute() {
    try {
      let data = null;
      data = this.#etlData !== null ? this.#etlData : null;

      for (const stage of this.stages) {
        data = await stage.execute(data);
        this.setEtlData(data);
      }

      return this.getEtlData();
    } catch (err: any) {
      console.error(`[ETL] failed.. ${err}`);
      console.error(err.stack);
      return err;
    }
  }

  /**
   * Create a step executor with logging and timing
   * @param name Name of the step
   * @returns Function that wraps a step function with logging and timing
   */
  executeStep = (name: any) => {
    return (step: (arg0: any) => any) => {
      return async (params: any) => {
        try {
          console.log(`[ETL][STEP]: ${name} - executing..`);

          const start = Date.now();
          const stepResponse = await step(params);

          Promise.resolve(stepResponse);
          const end = Date.now();

          console.log(`[ETL][STEP]: ${name} - executed..`);
          console.info(
            `[ETL][STEP]: ${name} - execution time: ${end - start} ms.`
          );

          return stepResponse;
        } catch (err) {
          console.error(`[ETL][STEP]: ${name} - could not executed.. ${err}`);
          return false;
        }
      };
    };
  };

  /**
   * Create a stage executor with logging and timing
   * @param stageName Name of the stage
   * @returns Function that wraps a stage executor with logging and timing
   */
  executeStage =
    (stageName: any) =>
    (stageExecutor: (arg0: any) => any) =>
    (params: any) => {
      console.log(`[ETL][STAGE]: ${stageName} - executing..`);
      return async (params: any) => {
        try {
          const start = Date.now();

          const stageResponse = await stageExecutor(params);
          Promise.resolve(stageResponse);

          const end = Date.now();
          console.log(`[ETL][STAGE]: ${stageName} - executed..`);
          console.info(
            `[ETL][STAGE]: ${stageName} - execution time: ${end - start} ms.`
          );

          return stageResponse;
        } catch (err) {
          console.error(
            `[ETL][STAGE]: ${stageName} - could not executed.. ${err}`
          );
          throw new Error("Execution failed..");
        }
      };
    };

  /**
   * Start the ETL process
   * @returns Promise that resolves when ETL completes
   */
  async start() {
    if (this.#state.getState() === "RUNNING") {
      console.error("ETL IS ALREADY RUNNING....");
      return;
    }

    if (this.#state.getState() !== "READY") {
      console.error(`[ETL] start() - init() is not completed.`);
      this.retryStart();
      return false;
    }

    try {
      this.#state.transitionTo(STATES.RUNNING);

      const result = await this.execute();

      this.#state.transitionTo(STATES.COMPLETED);
      return result;
    } catch (err: any) {
      this.#state.transitionTo(STATES.FAILED);
      console.error(`[ETL] start() - ${err}`);
      console.error(err.stack);
      return err;
    }
  }

  /**
   * Retry starting the ETL process after a delay
   */
  retryStart() {
    let sec = 2;
    const interval = setInterval(() => {
      console.info(`[ETL] start() - trying again in ${sec} second.`);
      sec--;
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      console.info(`[ETL] start() - starting.....`);
      this.start();
    }, 3000);
  }

  /**
   * Reset the ETL pipeline by clearing all stages
   */
  clean = async () => {
    this.stages = [];
  };
}

export default ETL;
