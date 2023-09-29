import { Buffer } from 'buffer'

if (!window.Buffer) {
  window.Buffer = Buffer
}

(window as any).global = window
