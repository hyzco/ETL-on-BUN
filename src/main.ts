import { DataSourceType } from "dataSources/DataSource.js";
import DataSourceFactory from "./dataSources/DataSourceFactory.js";
import ETL from "./etl/ETL.class.js";
import Stage from "./etl/ETL.stage.class.js";
import Step from "./etl/ETL.step.class.js";

// Step 1: Define Functions for ETL Steps
// ----------------------------------------------

// Extraction step function for multiple data sources
async function extractData({ params, etlData }: any) {
  const { dataSources } = params;
  const extractedData = [];

  console.log(`[Extract] Using params: ${JSON.stringify(params)}`);
  console.log(`[Extract] Using etlData: ${JSON.stringify(etlData)}`);

  // Loop through all the data sources
  for (const { sourceType, source } of dataSources) {
    console.log(`[Extract] Using source type: ${sourceType}`);
    console.log(`[Extract] Fetching data from: ${source}`);

    const dataSource = DataSourceFactory.createDataSource(sourceType, source);
    const data = await dataSource.fetchData();

    extractedData.push({ type: sourceType, data });
  }

  return extractedData;
}

// Transformation step function to handle multiple data sources
async function transformData({ params, etlData }: any) {
  const allUsers = [];

  for (const item of etlData) {
    const { _, data } = item;
    allUsers.push(data.users);
  }

  return allUsers;
}

// Load step function to display final processed data
async function loadData({ params, etlData }: any) {
  console.log(`[Load] Preparing to load data: ${etlData.length} rows of data`);

  Bun.file(Bun.pathToFileURL("src/data/output.json"))
    .writer()
    .write(JSON.stringify(etlData));

  return `Data from ${etlData.length} sources loaded successfully.`;
}

// Step 2: Create Steps for the ETL
// ----------------------------------------------
const extractStep = new Step(
  "Extract Data from Multiple Sources",
  extractData,
  {
    dataSources: [
      {
        sourceType: DataSourceType.JSON,
        source: Bun.pathToFileURL("./src/data/data.json"),
      },
      {
        sourceType: DataSourceType.CSV,
        source: Bun.pathToFileURL("./src/data/data.csv"),
      },
      {
        sourceType: DataSourceType.XML,
        source: Bun.pathToFileURL("./src/data/data.xml"),
      },
      {
        sourceType: DataSourceType.CSV,
        source: Bun.pathToFileURL("./src/data/people-100000.csv"),
      },
      {
        sourceType: DataSourceType.CSV,
        source: Bun.pathToFileURL("./src/data/people-100000.csv"),
      },
      {
        sourceType: DataSourceType.CSV,
        source: Bun.pathToFileURL("./src/data/people-100000.csv"),
      },
      {
        sourceType: DataSourceType.CSV,
        source: Bun.pathToFileURL("./src/data/people-100000.csv"),
      },
      {
        sourceType: DataSourceType.CSV,
        source: Bun.pathToFileURL("./src/data/people-100000.csv"),
      },
      {
        sourceType: DataSourceType.CSV,
        source: Bun.pathToFileURL("./src/data/customers-100000.csv"),
      },
    ],
  }
);

const transformStep = new Step("Transform Data", transformData, {
  format: "Standard",
});
const loadStep = new Step("Load Data", loadData, {
  destination: "Data Warehouse",
});

// Step 3: Create Stages and Add Steps to Them
// ----------------------------------------------
const extractStage = new Stage("Extract Stage");
extractStage.addStep(extractStep);

const transformStage = new Stage("Transform Stage");
transformStage.addStep(transformStep);

const loadStage = new Stage("Load Stage");
loadStage.addStep(loadStep);

// Step 4: Create ETL Pipeline and Add Stages
// ----------------------------------------------
const etlPipeline = new ETL();

// Add stages to the ETL pipeline
etlPipeline.addStage(extractStage);
etlPipeline.addStage(transformStage);
etlPipeline.addStage(loadStage);

// Step 5: Execute the ETL Pipeline
// ----------------------------------------------
(async () => {
  try {
    // Optional: Set initial data if needed
    etlPipeline.setEtlData({ initialData: "sample" });
    // Start the ETL process
    const result = await etlPipeline.start();

    console.log("ETL Pipeline completed successfully!");
    console.log("Final Data:", result);
  } catch (error: any) {
    console.error("ETL Pipeline failed:", error.message);
  }
})();
