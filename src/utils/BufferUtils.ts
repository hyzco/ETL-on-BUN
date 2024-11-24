function concatArrayBuffers(chunks: Uint8Array[]): Uint8Array {
  const chunkLength = chunks.reduce((a, c) => a + c.length, 0);
  const result = new Uint8Array(chunkLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

export async function streamToArrayBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    } else {
      chunks.push(value);
    }
  }
  return concatArrayBuffers(chunks);
}
