import { streamToArrayBuffer } from "../utils/BufferUtils.js";
import DataSource, { DataSourceType } from "./DataSource.js";
import { parseStringPromise } from "xml2js";

export default class XmlDataSource implements DataSource {
  type: DataSourceType = DataSourceType.XML;
  source: string | URL;

  constructor(source: string | URL) {
    this.source = source;
  }

  async fetchData() {
    console.log(`[XmlDataSource] Fetching data from: ${this.source}`);

    try {
      // Read the XML file as a stream
      const stream = Bun.file(this.source).stream();
      const array: Uint8Array = await streamToArrayBuffer(stream);

      const xmlData = new TextDecoder().decode(array);

      // Parse XML data to a JavaScript object
      const parsedXml = await parseStringPromise(xmlData);
      const normalizedData = this.normalizeData(parsedXml);

      return normalizedData;
    } catch (error: any) {
      console.error(
        `[XmlDataSource] Failed to parse XML: ${error.message} - ${error.stack}`
      );
      throw new Error("XML parsing error");
    }
  }

  normalizeData(parsedXml: any) {
    return { users: parsedXml.users.user };
  }
}
