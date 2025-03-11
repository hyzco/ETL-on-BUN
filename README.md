# ETL Pipeline Library

A flexible and extensible ETL (Extract, Transform, Load) pipeline library for JavaScript/TypeScript, built with Bun.

## Features

- **Modular Design**: Create reusable ETL pipelines with stages and steps
- **Multiple Data Sources**: Built-in support for JSON, CSV, and XML data sources
- **Extensible**: Easily add custom data sources or transformation steps
- **Pipeline Flow**: Clearly defined pipeline execution with data passing between stages

## Installation

```bash
# Using npm
npm install etl-pipeline

# Using Bun
bun add etl-pipeline
```

## Quick Start

```javascript
import { ETL, Stage, Step, DataSourceType } from 'etl-pipeline';

// Define step functions
async function extractUserData({ params }) {
  // Your extraction logic here
  return extractedData;
}

async function transformUserData({ etlData }) {
  // Your transformation logic here
  return transformedData;
}

async function loadUserData({ etlData }) {
  // Your loading logic here
  return result;
}

// Create steps
const extractStep = new Step("Extract User Data", extractUserData, {
  dataSources: [
    {
      sourceType: DataSourceType.JSON,
      source: "path/to/your/data.json"
    }
  ]
});

const transformStep = new Step("Transform User Data", transformUserData);
const loadStep = new Step("Load User Data", loadUserData);

// Create stages and add steps
const extractStage = new Stage("Extract Stage");
extractStage.addStep(extractStep);

const transformStage = new Stage("Transform Stage");
transformStage.addStep(transformStep);

const loadStage = new Stage("Load Stage");
loadStage.addStep(loadStep);

// Create ETL pipeline and add stages
const etlPipeline = new ETL();
etlPipeline.addStage(extractStage);
etlPipeline.addStage(transformStage);
etlPipeline.addStage(loadStage);

// Execute the pipeline
(async () => {
  try {
    const result = await etlPipeline.start();
    console.log("ETL Pipeline completed successfully!");
  } catch (error) {
    console.error("ETL Pipeline failed:", error.message);
  }
})();
```

## Core Components

### ETL

The main pipeline class that manages the execution of stages.

```javascript
const etlPipeline = new ETL();
etlPipeline.addStage(stage);
etlPipeline.setEtlData(initialData); // Optional
const result = await etlPipeline.start();
```

### Stage

A group of related steps in the ETL process.

```javascript
const extractStage = new Stage("Extract Stage");
extractStage.addStep(step);
```

### Step

An individual operation in the ETL process.

```javascript
const step = new Step("Step Name", stepFunction, stepParams);
```

Each step function receives:
- `params`: The parameters passed to the step
- `etlData`: Data from the previous stage/step

## Data Sources

The library supports multiple data source types:

- `DataSourceType.JSON`: For JSON files or endpoints
- `DataSourceType.CSV`: For CSV files
- `DataSourceType.XML`: For XML files

## Examples

See the [examples](./examples) directory for more detailed usage examples.

## License
MIT