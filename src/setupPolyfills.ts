// src/setupPolyfills.ts
import { TextEncoder, TextDecoder, TextDecoder as NodeTextDecoder } from 'util';

global.TextEncoder = TextEncoder;

if (typeof global.TextDecoder === 'undefined') {
  (global as any).TextDecoder = NodeTextDecoder;
} else {
  global.TextDecoder = TextDecoder as any;
}