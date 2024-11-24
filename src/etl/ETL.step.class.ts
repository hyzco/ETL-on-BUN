interface StepConfig<T = any> {
  name: string;
  // Generic type for executeFn to handle different input and output types.
  executeFn: (args: { params: T; etlData: any }) => Promise<T>;
  executeFnParams?: T; // More type-safe params definition
}

export default class Step<T = any> implements StepConfig<T> {
  name: StepConfig["name"];
  executeFn: StepConfig["executeFn"];
  executeFnParams: StepConfig["executeFnParams"];
  #executed: boolean = false;

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

  setIsExecuted(isExecuted: boolean) {
    this.#executed = isExecuted;
  }

  getIsExecuted() {
    return this.#executed;
  }

  beforeExecute(data: any) {
    // Hook for actions before executing the step, if needed
    console.log(`[ETL][STEP]: ${this.name} - before executing..`);
  }

  afterExecute(data: any) {
    // Hook for actions after executing the step, if needed
    console.log(`[ETL][STEP]: ${this.name} - after executing..`);
  }

  // Execute the step with error handling and logging
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

  // Utility function to execute a step with error handling and timing
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

  // Placeholder for cached response logic
  private getCachedResponse() {
    console.log("[ETL][STEP]: Returning cached response.");
    return "NO-RETURN"; // Default return value if no result
  }
}
