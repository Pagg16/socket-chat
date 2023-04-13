export function createImageBuffer(arrayBuffer) {
  return (
    "data:image/png;base64," +
    btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
  );
}
