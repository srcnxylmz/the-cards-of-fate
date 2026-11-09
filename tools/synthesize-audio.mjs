import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
// Original low-level two-tone cue. A prototype, not a substitute for the 40 production cues.
const rate = 44100, duration = 0.22, samples = Math.floor(rate * duration);
const data = Buffer.alloc(44 + samples * 2);
data.write('RIFF'); data.writeUInt32LE(data.length - 8, 4); data.write('WAVE', 8);
data.write('fmt ', 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20);
data.writeUInt16LE(1, 22); data.writeUInt32LE(rate, 24); data.writeUInt32LE(rate * 2, 28);
data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34); data.write('data', 36); data.writeUInt32LE(samples * 2, 40);
for (let i=0; i<samples; i++) {
  const t=i/rate, envelope=Math.min(1,t/0.012)*Math.pow(1-t/duration,3);
  const value=(Math.sin(2*Math.PI*392*t)+0.3*Math.sin(2*Math.PI*588*t))*envelope*0.16;
  data.writeInt16LE(Math.round(value*32767),44+i*2);
}
const folder=resolve(import.meta.dirname,'../App/Resources');
mkdirSync(folder,{recursive:true}); writeFileSync(resolve(folder,'decision.wav'),data);
console.log('Wrote original prototype decision cue: 220ms, mono PCM16, 44.1kHz.');
