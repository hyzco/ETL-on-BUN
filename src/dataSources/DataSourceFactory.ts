import { DataSourceType } from "./DataSource";
import JsonDataSource from "./JsonDataSource";
import XmlDataSource from "./XmlDataSource";
import CsvDataSource from "./CsvDataSource";

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
