import {readFileSync} from 'node:fs';import {auditArt} from './art-pipeline.mjs';
const cards=JSON.parse(readFileSync('cards.json')),manifest=JSON.parse(readFileSync('assets/art_manifest.json'));
const errors=auditArt(cards,manifest);console.log(JSON.stringify({cards:cards.length,actualCandidates:manifest.filter(a=>a.file).length,missing:manifest.filter(a=>a.status==='missing').length,errors},null,2));if(errors.length)process.exitCode=1;
