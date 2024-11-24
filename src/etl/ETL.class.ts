import Stage from "./ETL.stage.class.ts";
import EtlState from "./ETL.state.ts";
import Step from "./ETL.step.class.ts";
import { STATES } from "../StateMachine.ts";
//TODO: Sync-up jobs - which will update existing objects if the coming data is different than current
//TODO: Make static functions to expose individual pieces / stages - steps etc.
//it willbe used to update VM table

class ETL {
  #etlData: any = null;

  #state: EtlState = new EtlState(STATES.IDLE);
  stages: Stage[] = [];

  constructor() {
    this.init();
  }

  init() {
    console.log("Current State: ", this.#state.getState());
    this.#state.transitionTo(STATES.READY);
  }

  addStage(stage: Stage) {
    this.stages.push(stage);
  }

  getStages() {
    return this.stages;
  }

  setEtlData(data: { initialData: string } | null) {
    this.#etlData = data;
  }

  getEtlData() {
    return this.#etlData;
  }

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

  // ETL Steps  Utils Start
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
        } catch (err) {
          console.error(`[ETL][STEP]: ${name} - could not executed.. ${err}`);
          Promise.reject(err);
        }
      };
    };
  };

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
        } catch (err) {
          console.error(
            `[ETL][STAGE]: ${stageName} - could not executed.. ${err}`
          );
          throw new Error("Execution failed..");
        }
      };
    };
  ///////////// ETL Steps Utils END

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

      await this.execute();

      this.#state.transitionTo(STATES.COMPLETED);
      return true;
    } catch (err: any) {
      this.#state.transitionTo(STATES.FAILED);
      console.error(`[ETL] start() - ${err}`);
      console.error(err.stack);
      return err;
    }
  }

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

  clean = async () => {
    this.stages = [];
  };
}

export default ETL;
