import { streamToArrayBuffer } from "utils/BufferUtils.js";
import DataSource, { DataSourceType } from "./DataSource.js";

export default class JsonDataSource implements DataSource {
  type: DataSourceType = DataSourceType.JSON;
  source: string | URL;

  constructor(source: string | URL) {
    this.source = source;
  }

  async fetchData() {
    console.log(`[JsonDataSource] Fetching data from: ${this.source}`);

    try {
      const stream = Bun.file(this.source).stream();
      const array: Uint8Array = await streamToArrayBuffer(stream);

      // Parse JSON data
      const jsonData = new TextDecoder().decode(array);
      return JSON.parse(jsonData);
    } catch (error: any) {
      console.error(
        `[JsonDataSource] Failed to parse JSON: ${error.message} - ${error.stack}`
      );
      throw new Error("JSON parsing error");
    }
  }
}
