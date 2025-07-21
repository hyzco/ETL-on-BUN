// Export DataMapping ETL helpers
import {
  createExtractStep,
  createTransformStep,
  createLoadStep,
  DataSourceConfig,
  ExtractParams,
  TransformParams,
  LoadParams,
} from "./etl/ETLPipeline.js";

// Export core ETL classes (you already have these)
import ETL from "./etl/ETL.class.js";
import Stage from "./etl/ETL.stage.class.js";
import Step from "./etl/ETL.step.class.js";
import EtlState from "./etl/ETL.state.js";

// Export DataSourceFactory and types
import DataSource, { DataSourceType } from "./dataSources/DataSource.js";
import DataSourceFactory from "./dataSources/DataSourceFactory.js";

// Main library exports
export {
  // ETL Pipeline Helpers
  createExtractStep,
  createTransformStep,
  createLoadStep,

  // ETL Helper Types
  DataSourceConfig,
  ExtractParams,
  TransformParams,
  LoadParams,

  // Core ETL classes (you already have these)
  ETL,
  Stage,
  Step,
  EtlState,

  // Data Sources
  DataSourceType,
  DataSourceFactory,
  DataSource,
};

// Default export for convenience
export default {
  ETL,
  Stage,
  Step,
  EtlState,
  DataSourceFactory,
  createExtractStep,
  createTransformStep,
  createLoadStep,
};
