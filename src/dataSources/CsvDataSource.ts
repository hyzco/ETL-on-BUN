import { streamToArrayBuffer } from "../utils/BufferUtils.js";
import DataSource, { DataSourceType } from "./DataSource.js";

export default class CsvDataSource implements DataSource {
  type: DataSourceType = DataSourceType.CSV;
  source: string | URL;

  constructor(source: string | URL) {
    this.source = source;
  }

  async fetchData() {
    console.log(`[CsvDataSource] Fetching data from: ${this.source}`);

    try {
      const stream = Bun.file(this.source).stream();
      const array: Uint8Array = await streamToArrayBuffer(stream);

      const csvData = new TextDecoder().decode(array);

      // Normalize the data after parsing the CSV
      return this.normalizeData(csvData);
    } catch (error: any) {
      console.error(
        `[CsvDataSource] Failed to read CSV: ${error.message} - ${error.stack}`
      );
      throw new Error("CSV reading error");
    }
  }

  // Normalize the CSV data
  normalizeData(csvData: string) {
    const rows = csvData.split("\n");
    const headers = rows[0].split(",");
    const normalizedData: any[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",");
      if (row.length === headers.length) {
        const normalizedRow: any = {};

        // Map each value to the header
        row.forEach((value, index) => {
          normalizedRow[headers[index].trim()] = value.trim() || null;
        });

        normalizedData.push(normalizedRow);
      }
    }

    return { users: normalizedData };
  }
}
