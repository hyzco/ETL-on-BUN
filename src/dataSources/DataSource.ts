export enum DataSourceType {
  JSON = "JSON",
  CSV = "CSV",
  XML = "XML",
}

export default abstract class DataSource {
  abstract type: DataSourceType;
  abstract source: string | URL;
  abstract fetchData(): Promise<any>;
}
