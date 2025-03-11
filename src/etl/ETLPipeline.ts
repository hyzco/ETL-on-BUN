// src/etl/DataMappingStep.ts

import { DataSourceType } from "../dataSources/DataSource.js";
import DataSourceFactory from "../dataSources/DataSourceFactory.js";
import ETL from "./ETL.class.js";
import Stage from "./ETL.stage.class.js";
import Step from "./ETL.step.class.js";

// Define types for the ETL process
export interface ETLParams {
  params: any;
  etlData: any;
}

export interface DataSourceConfig {
  sourceType: DataSourceType;
  source: URL | string;
}

export interface ExtractParams {
  dataSources: DataSourceConfig[];
}

export interface TransformParams {
  format?: string;
}

export interface LoadParams {
  destination: string;
  outputPath?: string | URL;
}

/**
 * Create a step that extracts data from multiple sources
 * @param dataSources Array of data source configurations
 * @returns A Step object for data extraction
 */
export function createExtractStep(dataSources: DataSourceConfig[]): Step {
  // Extraction step function for multiple data sources
  const extractData = async ({ params, etlData }: ETLParams): Promise<any[]> => {
    const extractedData: { type: DataSourceType; data: any }[] = [];

    console.log(`[Extract] Using params: ${JSON.stringify(params)}`);

    // Loop through all the data sources
    for (const { sourceType, source } of dataSources) {
      console.log(`[Extract] Using source type: ${sourceType}`);
      console.log(`[Extract] Fetching data from: ${source.toString()}`);

      const dataSource = DataSourceFactory.createDataSource(sourceType, source.toString());
      const data = await dataSource.fetchData();

      extractedData.push({ type: sourceType, data });
    }

    return extractedData;
  };

  return new Step("Extract Data from Multiple Sources", extractData, { dataSources });
}

/**
 * Create a step that transforms data using a mapping schema
 * @param mappingSchema Schema for data transformation
 * @returns A Step object for data transformation
 */
export function createTransformStep(transformer:Function): Step {
  // Transformation step function to handle data mapping
  const transformData = async ({ params, etlData }: ETLParams): Promise<any> => {
    // Create a data mapper with the provided schema
    const mapper = transformer(etlData);
    
    // Apply the mapping transformation
    return mapper.createStepFunction()({ params, etlData });
  };

  return new Step("Transform Data with Mapping Schema", transformData, {
    format: "Standard",
  });
}

/**
 * Create a step that loads data to a destination
 * @param destination Destination name
 * @param outputPath Optional path to write output file
 * @returns A Step object for data loading
 */
export function createLoadStep(destination: string, outputPath?: string | URL): Step {
  // Load step function
  const loadData = async ({ params, etlData }: ETLParams): Promise<string> => {
    console.log(`[Load] Preparing to load data to ${destination}.`);

    if (outputPath) {
      try {
        // Handle different environments (Node.js, Bun, browser)
        if (typeof Bun !== 'undefined') {
          // Bun environment
          const pathUrl = outputPath instanceof URL ? outputPath : new URL(outputPath);
          Bun.file(pathUrl)
            .writer()
            .write(JSON.stringify(etlData));
        } else if (typeof process !== 'undefined') {
          // Node.js environment
          const fs = require('fs');
          fs.writeFileSync(outputPath.toString(), JSON.stringify(etlData));
        } else {
          // Browser environment - could use localStorage or other storage mechanisms
          console.log("Browser environment detected. Outputting data to console:");
          console.log(JSON.stringify(etlData));
        }
      } catch (error) {
        console.error(`Error writing to output path: ${error}`);
      }
    }

    return `Data loaded successfully to ${destination}.`;
  };

  return new Step("Load Data", loadData, {
    destination,
    outputPath
  });
}

export default {
  createExtractStep,
  createTransformStep,
  createLoadStep
};