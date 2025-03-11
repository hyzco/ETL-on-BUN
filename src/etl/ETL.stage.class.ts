// File: lib/etl/ETL.stage.class.ts
import Step from "./ETL.step.class.js";

/**
 * Represents a stage in the ETL pipeline
 * A stage groups related steps together and executes them in sequence
 */
export default class Stage {
  #executed = false;
  #stageData = null;
  stageName: string;
  steps: Step[];
  stepResponses: Map<any, any>;
  executionTime: Date | null;

  /**
   * Create a new stage
   * @param stageName Name of the stage
   */
  constructor(stageName: string) {
    this.stageName = stageName;
    this.steps = [];
    this.stepResponses = new Map();
    this.executionTime = null;

    console.log(`[ETL][STAGE]: ${stageName} - initialized..`);
  }

  /**
   * Set execution status
   * @param isExecuted Whether the stage has been executed
   */
  setIsExecuted(isExecuted: boolean) {
    this.#executed = isExecuted;
  }

  /**
   * Get execution status
   * @returns Whether the stage has been executed
   */
  getIsExecuted() {
    return this.#executed;
  }

  /**
   * Set stage data
   * @param stageData Data to store for this stage
   */
  setStageData(stageData: any) {
    this.#stageData = stageData;
  }

  /**
   * Get stage data
   * @returns Data for this stage
   */
  getStageData() {
    return this.#stageData;
  }

  /**
   * Get the name of the stage
   */
  getName(): string {
    return this.stageName;
  }

  /**
   * Add a step to this stage
   * @param step The step to add
   */
  addStep(step: Step) {
    if (!(step instanceof Step)) {
      throw new Error("Invalid step type. Must be an instance of Step.");
    }
    this.steps.push(step);
  }

  /**
   * Remove a step from this stage
   * @param stepName Name of the step to remove
   */
  removeStep(stepName: any) {
    const index = this.steps.findIndex((step: Step) => step.name === stepName);
    if (index !== -1) {
      this.steps.splice(index, 1);
      console.log(`[ETL][STAGE]: Step ${stepName} removed.`);
    }
  }

  /**
   * Execute all steps in this stage
   * @param data Data from the previous stage
   * @returns Result after all steps complete
   */
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
    } catch (err: any) {
      console.error(
        `[ETL][STAGE]: ${this.stageName} - failed with error: ${err.message}`
      );
      throw err;
    }
  }

  /**
   * Get all step responses
   * @returns Map of step responses
   */
  getStepResponses() {
    return new Map(this.stepResponses); // Return a copy to prevent external mutations
  }

  /**
   * Set a step response
   * @param stepName Name of the step
   * @param stepResponse Response from the step
   */
  setStepResponse(stepName: any, stepResponse: any) {
    this.stepResponses.set(stepName, stepResponse);
  }
}