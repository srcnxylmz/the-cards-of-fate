import {withProductionInputs} from './content/production-inputs.mjs';
import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const cards=JSON.parse(readFileSync('cards.json')),prior=JSON.parse(readFileSync('docs/analysis/milestone150-balance-135/cards.json')),native150=JSON.parse(readFileSync('docs/analysis/milestone150-verified/cards.json')),added=cards.filter(c=>!prior.some(x=>x.id===c.id)&&native150.some(x=>x.id===c.id));
test('150 unique events preserve all balanced 135 definitions and stay in three eras',()=>{
 assert.equal(cards.length,180);assert.equal(new Set(cards.map(c=>c.id)).size,180);
 for(const c of prior)assert.deepEqual(cards.find(x=>x.id===c.id),withProductionInputs(c),c.id);
 assert.equal(added.length,15);for(const era of [1,2,3])assert.equal(added.filter(c=>c.era===era).length,5);
 for(const lang of ['tr','en'])for(const field of ['title','description'])assert.equal(new Set(cards.map(c=>c[field][lang])).size,180);
});
test('new authored conflicts carry paid choices, consequences and real history prerequisites',()=>{
 assert.equal(new Set(added.map(c=>c.artDirection)).size,15);
 for(const c of added){assert.ok(c.requirements.some(r=>r.flag||r.completedCard||r.technology||r.building),c.id);assert.ok(c.choices.length>=2);
  for(const ch of c.choices){assert.ok(ch.text.tr&&ch.text.en);for(const o of ch.outcomes){assert.ok(o.text.tr&&o.text.en);assert.ok(o.delayedEffects.length,c.id);assert.ok(Object.values(o.effect.stats).some(v=>v<0),c.id+'.'+ch.id);}}
 }
 assert.equal(added.filter(c=>c.exclusionConditions.some(r=>r.flag==='resolved_'+c.id)).length,7);
});
test('closed warning chain requires actual choices, delayed era memory and writing',()=>{
 const c=id=>cards.find(c=>c.id===id),ch=(id,key)=>c(id).choices.find(ch=>ch.id===key);
 for(const [from,to,flag] of [['smoke_code','bank_alarm','alarm_memory'],['bank_alarm','alarm_inquest','watch_city_memory']]){
  assert.ok(c(to).requirements.some(r=>r.completedCard===from));assert.ok(c(to).requirements.some(r=>r.flag===flag));
  for(const choice of c(from).choices)assert.ok(choice.outcomes.every(o=>o.delayedEffects.some(d=>d.minimumEra===c(to).era&&d.effect.flags.includes(flag))));
 }
 assert.ok(c('alarm_inquest').requirements.some(r=>r.technology==='writing'));
 assert.ok(ch('bank_alarm','code').requirements.some(r=>r.flag==='shared_alarm_code'));
 assert.ok(ch('alarm_inquest','code').requirements.some(r=>r.flag==='public_flood_watch'));
 for(const id of ['smoke_code','bank_alarm','alarm_inquest'])for(const choice of c(id).choices)for(const o of choice.outcomes)assert.ok(o.effect.flags.includes('resolved_'+id));
});
