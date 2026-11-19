import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => JSON.parse(readFileSync(path));
const cards = read('cards.json');
const prior = read('docs/analysis/milestone180-repair-165/cards.json');
const existing = new Map(cards.map(card => [card.id, card]));
const added = cards.filter(card => !prior.some(old => old.id === card.id));

test('180 original events preserve all repaired definitions and fill the first three eras equally', () => {
  assert.equal(existing.size, 180);
  assert.equal(cards.length, 180);
  for (const card of prior) assert.deepEqual(existing.get(card.id), card);
  for (const era of [1,2,3]) assert.equal(added.filter(c => c.era === era).length, 5);
  assert.equal(added.length, 15);
  for (const locale of ['tr','en']) {
    for (const field of ['title','description']) assert.equal(new Set(cards.map(c => c[field][locale])).size,180);
  }
});

test('new extraction pays actual inputs and new projects pay capital before any delayed return', () => {
  for (const card of added) for (const choice of card.choices) for (const result of choice.outcomes) {
    const {resources=0, environment=0} = result.effect.stats;
    assert.ok(result.delayedEffects.length, card.id);
    assert.ok(Object.values(result.effect.stats).some(value => value < 0) ||
      result.delayedEffects.some(d => d.effect.stats.resources < 0), card.id);
    if (resources > 0 && environment < 0) {
      assert.ok(choice.requirements.some(r => r.stat === 'environment' && r.minimum >= -environment),card.id);
    }
    if (result.delayedEffects.some(d => d.effect.stats.resources > 0)) {
      assert.ok(resources < 0);
      assert.ok(choice.requirements.some(r => r.stat === 'resources' && r.minimum >= 4-resources),card.id);
    }
  }
});
