import {readFileSync,writeFileSync} from 'node:fs';
// Original synthesis only: no recordings, sample libraries or external service.
export function cue(name) {
 const rate=44100, length=name==='card-open'?0.24:0.12, n=Math.round(rate*length), data=Buffer.alloc(44+n*2);
 data.write('RIFF');data.writeUInt32LE(36+n*2,4);data.write('WAVEfmt ',8);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(1,22);data.writeUInt32LE(rate,24);data.writeUInt32LE(rate*2,28);data.writeUInt16LE(2,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(n*2,40);
 let noise=90, smooth=0;
 for(let i=0;i<n;i++){
  const t=i/rate, x=i/(n-1);noise=(Math.imul(noise,1664525)+1013904223)>>>0;smooth=0.8*smooth+0.2*(noise/4294967296*2-1);
  const envelope=Math.sin(Math.PI*x)**2*Math.exp(-5*x);
  const wave=name==='card-open'?0.13*Math.sin(2*Math.PI*330*t)+0.05*Math.sin(2*Math.PI*495*t):0.09*smooth+0.055*Math.sin(2*Math.PI*660*t);
  data.writeInt16LE(Math.round(32767*envelope*wave),44+i*2);
 }
 return data;
}
if(process.argv[1]?.endsWith('generate-feedback.mjs')) for(const name of ['card-open','choice-soft']){const path='App/Resources/'+name+'.wav', bytes=cue(name);if(process.argv.includes('--check')){if(!readFileSync(path).equals(bytes))throw Error('Stale synthesized cue '+name);}else writeFileSync(path,bytes);}
