import {withProductionInputs} from './content/production-inputs.mjs';
import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {validate} from './validate-content.mjs';import {composeArtManifest,promptFor} from './art-pipeline.mjs';
const cards=JSON.parse(readFileSync('cards.json')).filter(c=>c.era<=3),before=JSON.parse(readFileSync('docs/analysis/milestone120-105-before/cards.json')),eras=JSON.parse(readFileSync('Sources/FateCore/Content/eras.json'));
test('all 105 existing cards are preserved except declared production-input requirements',()=>{assert.equal(cards.length,180);for(const c of before)assert.deepEqual(cards.find(x=>x.id===c.id),withProductionInputs(c),c.id);for(const era of [1,2,3])assert.equal(cards.filter(c=>c.era===era).length,60);});
test('new fifteen scenes and bilingual conflicts are unique',()=>{const old=new Set(before.map(c=>c.id)),added=cards.filter(c=>!old.has(c.id)&&JSON.parse(readFileSync('docs/analysis/milestone135-120-before/cards.json')).some(x=>x.id===c.id));assert.equal(added.length,15);for(const lang of ['tr','en']){assert.equal(new Set(cards.map(c=>c.title[lang])).size,180);assert.equal(new Set(cards.map(c=>c.description[lang])).size,180);}assert.equal(new Set(added.map(c=>c.artDirection)).size,15);});
for(const [name,mutate,error] of [
 ['future completed history',c=>c[0].requirements=[{completedCard:'mine_shoring'}],'history only completed in future era'],
 ['unknown completed history',c=>c[0].requirements=[{completedCard:'missing'}],'unknown completed card'],
 ['unknown outcome gate',c=>c.at(-1).choices[0].outcomes[0].requirements=[{flag:'never_produced'}],'unproduced required flag'],
 ['invalid flag removal',c=>c[0].choices[0].outcomes[0].effect.removeFlags='bad','invalid removed flags'],
 ['impossible context range',c=>c.at(-1).choices[0].outcomes[0].requirements=[{stat:'population',minimum:50,maximum:20}],'impossible range']
])test('rejects '+name,()=>{const c=structuredClone(cards);mutate(c);assert.ok(validate(c,eras).errors.some(e=>e.includes(error)));});
test('missing-asset prompts follow current briefs while submitted prompts are preserved',()=>{const c=structuredClone(cards.find(c=>c.id==='mine_shoring'));c.artDirection='Updated period-specific timber support';const row={id:c.artAsset,cardID:c.id,status:'missing',file:null,modelPrompt:'stale'};assert.equal(composeArtManifest([c],[row],[])[0].modelPrompt,promptFor(c));assert.equal(composeArtManifest([c],[row],[{asset:c.artAsset,prompt:'exact submitted prompt'}])[0].modelPrompt,'exact submitted prompt');});

test('every new event has a real dependency on earlier authored decisions',()=>{
 const old=new Set(before.map(c=>c.id)),added=cards.filter(c=>!old.has(c.id)&&JSON.parse(readFileSync('docs/analysis/milestone135-120-before/cards.json')).some(x=>x.id===c.id));
 function produces(c,condition){return c.choices.some(ch=>[ch.immediateEffects,...ch.outcomes.flatMap(o=>[o.effect,...o.delayedEffects.map(d=>d.effect)])].some(e=>condition.flag?e.flags.includes(condition.flag):condition.technology?e.technologies.includes(condition.technology):false));}
 for(const c of added){const conditions=[...c.requirements,...c.choices.flatMap(ch=>[...ch.requirements,...ch.outcomes.flatMap(o=>o.requirements??[])])];assert.ok(conditions.some(x=>x.completedCard&&x.completedCard!==c.id||cards.some(source=>source.id!==c.id&&source.era<=c.era&&produces(source,x))),c.id+' needs an actual earlier decision dependency');}
});
