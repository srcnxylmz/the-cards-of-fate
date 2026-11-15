import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate} from './validate-content.mjs';
const cards=JSON.parse(readFileSync(new URL('../Sources/FateCore/Content/cards.json',import.meta.url)));
const eras=JSON.parse(readFileSync(new URL('../Sources/FateCore/Content/eras.json',import.meta.url)));
test('authored content passes structural validation',()=>assert.deepEqual(validate(cards,eras).errors,[]));
const mutations=[
  ['unknown technology condition',c=>c[0].requirements=[{technology:'teleport'}],'unknown technology condition'],
  ['unknown building condition',c=>c[0].requirements=[{building:'spaceport'}],'unknown building condition'],
  ['unknown faction condition',c=>c[0].requirements=[{faction:'ghost'}],'unknown faction'],
  ['orphan relation bounds',c=>c[0].requirements=[{relationMinimum:10}],'relation bounds without faction'],
  ['conflicting faction bounds',c=>c[0].requirements=[{faction:'hunters',relationMinimum:30},{faction:'hunters',relationMaximum:20}],'contradictory faction bounds'],
  ['unknown leadership condition',c=>c[0].requirements=[{leadership:'king'}],'unknown leadership'],
  ['conflicting leadership',c=>c[0].requirements=[{leadership:'ruler'},{leadership:'exile'}],'contradictory leadership'],
  ['unknown faction',c=>c[0].choices[0].outcomes[0].effect.rivalRelations={ghost:2},'invalid targeted relation'],
  ['invalid faction delta',c=>c[0].choices[0].outcomes[0].effect.rivalRelations={hunters:101},'invalid targeted relation'],
  ['malformed faction effects',c=>c[0].choices[0].outcomes[0].effect.rivalRelations=[],'invalid targeted relations'],
  ['duplicate IDs',c=>c.push(structuredClone(c[0])),'duplicate ID'],
  ['missing translations',c=>delete c[0].description.en,'missing translation'],
  ['bad probability total',c=>c[0].choices[0].outcomes[0].probability=0.8,'probabilities must total one'],
  ['negative probability',c=>c[4].choices[1].outcomes[0].probability=-1,'invalid probability'],
  ['unknown stats',c=>c[0].choices[0].outcomes[0].effect.stats.money=10,'invalid stat effect'],
  ['impossible ranges',c=>c[0].requirements=[{stat:'resources',minimum:90,maximum:10}],'impossible range'],
  ['missing flag producer',c=>c[0].requirements=[{flag:'unreachable_flag'}],'unproduced required flag'],
  ['future era dependency',c=>c[0].requirements=[{flag:'single_seal'}],'future era'],
  ['duplicate choices',c=>c[0].choices[1].id=c[0].choices[0].id,'duplicate/missing choice ID'],
  ['past era delay',c=>c[0].choices[0].outcomes[0].delayedEffects[0].minimumEra=0,'invalid delayed era'],
  ['unrecognized condition',c=>c[0].requirements=[{stat:'resources',min:40}],'unknown condition key'],
  ['combined impossible bounds',c=>{c[0].requirements=[{stat:'resources',minimum:80}];c[0].choices[0].requirements=[{stat:'resources',maximum:20}];},'mutually impossible bounds'],
  ['identical strategic outcomes',c=>c[0].choices[1].outcomes=structuredClone(c[0].choices[0].outcomes),'strategically identical choices'],
  ['unknown decision reference',c=>c[0].requirements=[{lastDecision:'missing.choice'}],'unknown decision reference'],
  ['contradictory decision reference',c=>c[0].requirements=[{lastDecision:'sacred_fire.burn',notLastDecision:'sacred_fire.burn'}],'contradictory decision reference'],
  ['stale derived flags',c=>c[0].worldFlags=[],'stale worldFlags'],
  ['unknown affinity',c=>c[0].choices[0].outcomes[0].affinity='luck','unknown affinity']
];
for(const [name,mutate,message] of mutations) test(`rejects ${name}`,()=>{
  const copy=structuredClone(cards);mutate(copy);
  assert.ok(validate(copy,eras).errors.some(e=>e.includes(message)),message);
});
