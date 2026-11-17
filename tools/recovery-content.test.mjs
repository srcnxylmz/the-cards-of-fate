import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const before=JSON.parse(readFileSync('docs/analysis/milestone105-90-before/cards.json'));
const after=JSON.parse(readFileSync('Sources/FateCore/Content/cards.json'));
test('all ninety original events retain their authored choices and gameplay effects',()=>{
  assert.equal(before.length,90);assert.equal(after.length,150);
  for(const original of before){
    const actual=after.find(c=>c.id===original.id);
    assert.ok(actual,original.id);
    const old=structuredClone(original),next=structuredClone(actual);
    // Derived display metadata is recomputed after all optional choices are added.
    delete old.worldFlags;delete next.worldFlags;
    if(['council_seal','hostage_prince','salt_ship','flint_apprentice'].includes(old.id)){
      assert.ok(next.exclusionConditions.length>old.exclusionConditions.length);
      next.exclusionConditions=old.exclusionConditions;
    }
    assert.deepEqual(next,old,original.id);
  }
});
test('original recovery group retains five distinct events per era',()=>{
  const existing=new Set(before.map(c=>c.id));const added=JSON.parse(readFileSync('docs/analysis/milestone120-105-before/cards.json')).filter(c=>!existing.has(c.id));
  assert.equal(added.length,15);
  for(const era of [1,2,3])assert.equal(added.filter(c=>c.era===era).length,5);
  for(const language of ['tr','en']){
    assert.equal(new Set(after.map(c=>c.title[language])).size,150);
    assert.equal(new Set(after.map(c=>c.description[language])).size,150);
  }
});
