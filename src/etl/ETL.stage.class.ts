import Step from "./ETL.step.class.js";

export default class Stage {
  #executed = false;
  #stageData = null;
  stageName: any;
  steps: Step[];
  stepResponses: Map<any, any>;
  executionTime: Date | null;

  constructor(stageName: string) {
    this.stageName = stageName;
    this.steps = [];
    this.stepResponses = new Map();
    this.executionTime = null;

    console.log(`[ETL][STAGE]: ${stageName} - initialized..`);
  }

  setIsExecuted(isExecuted: boolean) {
    this.#executed = isExecuted;
  }

  getIsExecuted() {
    return this.#executed;
  }

  setStageData(stageData: null) {
    this.#stageData = stageData;
  }

  getStageData() {
    return this.#stageData;
  }

  addStep(step: Step) {
    if (!(step instanceof Step)) {
      throw new Error("Invalid step type. Must be an instance of Step.");
    }
    this.steps.push(step);
  }

  removeStep(stepName: any) {
    const index = this.steps.findIndex((step: Step) => step.name === stepName);
    if (index !== -1) {
      this.steps.splice(index, 1);
      console.log(`[ETL][STAGE]: Step ${stepName} removed.`);
    }
  }

  // Execute all steps within this stage
  async execute(data: any) {
    console.log(`[ETL][STAGE]: ${this.stageName} - executing..`);

    let stageData = data;
    try {
      for (const step of this.steps) {
        const executedStepData = await step.execute(stageData);
        stageData =
          executedStepData !== undefined ? executedStepData : stageData;
      }

      this.setIsExecuted(true);
      this.setStageData(stageData);
      this.executionTime = new Date();

      console.log(`[ETL][STAGE]: ${this.stageName} - execution completed.`);
      return stageData;
    } catch (err) {
      console.error(
        `[ETL][STAGE]: ${this.stageName} - failed with error: ${err.message}`
      );
      throw err;
    }
  }

  getStepResponses() {
    return new Map(this.stepResponses); // Return a copy to prevent external mutations
  }

  setStepResponse(stepName: any, stepResponse: any) {
    this.stepResponses.set(stepName, stepResponse);
  }
}
