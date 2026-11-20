/** Minimal ambient types for the un-typed wawoff2 WebAssembly build. */
declare module 'wawoff2' {
  interface Wawoff2 {
    /** Returns a view into the emscripten heap — copy bytes out before reuse. */
    compress(input: Uint8Array | ArrayBuffer): Promise<Uint8Array>;
    decompress(input: Uint8Array | ArrayBuffer): Promise<Uint8Array>;
  }

  const wawoff2: Wawoff2;
  export default wawoff2;
}
