// File: lib/etl/ETL.step.class.ts

/**
 * Interface for step configuration
 */
interface StepConfig<T = any> {
  name: string;
  // Generic type for executeFn to handle different input and output types.
  executeFn: (args: { params: T; etlData: any }) => Promise<T>;
  executeFnParams?: T; // More type-safe params definition
}

/**
 * Represents a single step in an ETL stage
 * Each step performs a specific operation on the data
 */
export default class Step<T = any> implements StepConfig<T> {
  name: StepConfig["name"];
  executeFn: StepConfig["executeFn"];
  executeFnParams: StepConfig["executeFnParams"];
  #executed: boolean = false;

  /**
   * Create a new step
   * @param name Name of the step
   * @param executeFn Function to execute for this step
   * @param executeFnParams Parameters to pass to the step function
   */
  constructor(
    name: StepConfig["name"],
    executeFn: StepConfig["executeFn"],
    executeFnParams: StepConfig["executeFnParams"]
  ) {
    this.name = name;
    this.executeFn = executeFn;
    this.executeFnParams = executeFnParams;

    console.log(`[ETL][STEP]: ${name} - initialized..`);
  }

  /**
   * Set execution status
   * @param isExecuted Whether the step has been executed
   */
  setIsExecuted(isExecuted: boolean) {
    this.#executed = isExecuted;
  }

  /**
   * Get execution status
   * @returns Whether the step has been executed
   */
  getIsExecuted() {
    return this.#executed;
  }

  /**
   * Get the name of the step
   */
  getName(): string {
    return this.name;
  }

  /**
   * Hook for actions before executing the step
   * @param data Data being processed
   */
  beforeExecute(data: any) {
    console.log(`[ETL][STEP]: ${this.name} - before executing..`);
  }

  /**
   * Hook for actions after executing the step
   * @param data Data after processing
   */
  afterExecute(data: any) {
    console.log(`[ETL][STEP]: ${this.name} - after executing..`);
  }

  /**
   * Execute this step
   * @param data Data from the previous step
   * @returns Result of this step's execution
   */
  async execute(data: any) {
    if (this.getIsExecuted()) {
      return data; // Return current data if step already executed
    }

    try {
      this.beforeExecute(data);

      const executionResponse = await this.executeStep(this.name)(
        this.executeFn
      )({
        params: this.executeFnParams,
        etlData: data,
      });

      this.afterExecute(executionResponse);
      this.setIsExecuted(true);

      return executionResponse;
    } catch (err: any) {
      console.error(
        `[ETL][STEP]: ${this.name} - execution failed: ${err.message}`
      );
      throw err;
    }
  }

  /**
   * Utility function to execute a step with error handling and timing
   * @param name Name of the step
   * @returns Function that wraps a step function with logging and timing
   */
  executeStep(name: string) {
    return (step: (arg0: any) => any) => async (params: any) => {
      try {
        console.log(`[ETL][STEP]: ${name} - executing..`);
        const start = Date.now();

        const stepResponse = await step(params);
        const response =
          stepResponse !== "NO-RETURN"
            ? stepResponse
            : this.getCachedResponse();

        const end = Date.now();
        console.log(`[ETL][STEP]: ${name} - executed.`);
        console.info(
          `[ETL][STEP]: ${name} - execution time: ${end - start} ms.`
        );

        return response;
      } catch (err: any) {
        console.error(`[ETL][STEP]: ${name} - failed: ${err.message}`);
        throw err;
      }
    };
  }

  /**
   * Placeholder for cached response logic
   * @returns Default return value if no result
   */
  private getCachedResponse() {
    console.log("[ETL][STEP]: Returning cached response.");
    return "NO-RETURN"; // Default return value if no result
  }
}