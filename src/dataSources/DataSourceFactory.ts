import { DataSourceType } from "./DataSource.js";
import JsonDataSource from "./JsonDataSource.js";
import XmlDataSource from "./XmlDataSource.js";
import CsvDataSource from "./CsvDataSource.js";

export default class DataSourceFactory {
  static createDataSource(type: DataSourceType, source: string) {
    switch (type) {
      case DataSourceType.JSON:
        return new JsonDataSource(source);
      case DataSourceType.XML:
        return new XmlDataSource(source);
      case DataSourceType.CSV:
        return new CsvDataSource(source);
      default:
        throw new Error(`Unsupported data source type: ${type}`);
    }
  }
}
