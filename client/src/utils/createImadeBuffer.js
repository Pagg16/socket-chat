export function createImageBuffer(arrayBuffer, type) {
  const blob = new Blob([new Uint8Array(arrayBuffer)], { type: "image/png" });
  return URL.createObjectURL(blob);
}
