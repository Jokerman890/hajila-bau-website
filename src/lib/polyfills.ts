// ✨ src/lib/polyfills.ts (Client-only!)
import { Buffer as NodeBuffer } from 'buffer';

declare global {
  // eslint-disable-next-line no-var
  var Buffer: typeof NodeBuffer;
}

// Falls Buffer bereits existiert ➜ nichts tun
if (typeof globalThis.Buffer === 'undefined') {
  // Node-Buffer als globale Buffer-Implementierung hinterlegen
  // (reicht für Base64-Encoding/Decoding)
  globalThis.Buffer = NodeBuffer;
}
