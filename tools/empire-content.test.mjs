import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validate, inventory } from './validate-content.mjs';
import { ERA4_GATE, LEDGER_EXCLUSIVE } from './content/empire-events.mjs';
import { PROVINCE_LEDGER_EXCLUSIVE } from './content/empire-province-events.mjs';

// Static content checks for the Era 4 groundwork (180 → 195 → 210 → 225). Engine behavior is covered by
// Tests/FateCoreTests/EraReadinessTests.swift and EmpireGroundworkTests.swift (Swift engine).
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const cards = read('Sources/FateCore/Content/cards.json');
const eras = read('Sources/FateCore/Content/eras.json');
const before = read('docs/analysis/milestone195-180-before/cards.json');
const beforeEras = read('docs/analysis/milestone195-180-before/eras.json');
const before195 = read('docs/analysis/milestone210-195-before/cards.json');
const before210 = read('docs/analysis/milestone225-210-before/cards.json');
const empire = cards.filter(c => c.era === 4);
const all = c => c.choices.flatMap(ch => [ch.immediateEffects, ...ch.outcomes.flatMap(o => [o.effect, ...o.delayedEffects.map(d => d.effect)])]);
const earlyFlags = new Set(cards.filter(c => c.era <= 3).flatMap(c => all(c).flatMap(e => e.flags)));

test('225 events: the 180 first-three-era and first 30 Era 4 definitions are byte-identical; forty-five events are Era 4 only', () => {
  assert.equal(cards.length, 225);
  assert.equal(new Set(cards.map(c => c.id)).size, 225);
  assert.deepEqual(cards.slice(0, 195), before195, 'the 195-card package is preserved in order');
  assert.deepEqual(cards.slice(0, 210), before210, 'the 210-card package is preserved in order');
  assert.deepEqual(cards.filter(c => c.era <= 3), before);
  for (const e of [1, 2, 3]) assert.equal(cards.filter(c => c.era === e).length, 60);
  assert.equal(empire.length, 45);
  assert.equal(cards.filter(c => c.era > 4).length, 0);
  assert.deepEqual(read('cards.json'), cards, 'root compatibility mirror stays in sync');
  for (const lang of ['tr', 'en']) for (const f of ['title', 'description']) assert.equal(new Set(cards.map(c => c[f][lang])).size, 225);
  assert.equal(new Set(empire.map(c => c.artDirection)).size, 45);
});

test('package distribution: twenty-eight recurring events, eight Bronze bridges, eight conditional conclusions, one reform', () => {
  const roles = r => empire.filter(c => c.eraRole === r);
  assert.equal(roles('recurring').length, 28);
  assert.equal(roles('bridge').length, 8);
  assert.equal(roles('conclusion').length, 8);
  assert.equal(roles('reform').length, 1);
  assert.equal(empire.length, 28 + 8 + 8 + 1);
  for (const c of roles('recurring')) assert.ok(!c.exclusionConditions.some(x => x.flag === `resolved_${c.id}`), c.id + ' must stay repeatable');
  for (const c of [...roles('bridge'), ...roles('conclusion')]) {
    assert.ok(c.exclusionConditions.some(x => x.flag === `resolved_${c.id}`), c.id + ' is one-shot');
    assert.ok(c.storyChainId, c.id);
    const bronze = c.requirements.filter(r => r.completedCard).map(r => cards.find(x => x.id === r.completedCard));
    assert.ok(bronze.some(x => x.era === 3), c.id + ' continues an actual Bronze record');
  }
  for (const c of roles('conclusion')) {
    const imperial = c.requirements.filter(r => r.completedCard).map(r => cards.find(x => x.id === r.completedCard));
    assert.ok(imperial.some(x => x.era === 4 && x.eraRole === 'recurring'), c.id + ' needs an imperial crisis first');
  }
  const chains = new Set([...roles('bridge'), ...roles('conclusion')].map(c => c.storyChainId));
  for (const chain of ['debt', 'memory', 'ridge_route', 'river_memory', 'warning', 'care_work', 'hospitality', 'public_voice', 'pasture', 'stored_power', 'embers']) assert.ok(chains.has(chain), chain);
});

test('Era 4 readiness gate is explicit and disabled; the inventory is met but balance evidence is absent; earlier thresholds are unchanged', () => {
  const gate = eras.find(e => e.id === 4).contentGate;
  assert.deepEqual(gate, ERA4_GATE);
  assert.equal(gate.enabled, false);
  assert.deepEqual([gate.minimumCards, gate.minimumRecurring, gate.minimumConclusions, gate.minimumBridges], [40, 24, 8, 8]);
  const inv = inventory(cards, 4);
  assert.deepEqual([inv.total, inv.recurring, inv.conclusions, inv.bridges], [45, 28, 8, 8]);
  assert.equal(gate.balanceEvidence, null, 'no balance acceptance has been recorded');
  for (const category of gate.requiredRecurringCategories) assert.ok(inv.recurringCategories.includes(category), category);
  for (const e of eras.filter(e => e.id > 4)) assert.equal(e.contentGate.enabled, false);
  for (const e of eras.filter(e => e.id <= 3)) assert.equal(e.contentGate, undefined);
  eras.forEach((e, i) => { const { contentGate, ...rest } = e; assert.deepEqual(rest, beforeEras[i]); });
  const bronze = eras.find(e => e.id === 3);
  assert.deepEqual([bronze.requiredTechnology, bronze.knowledgeThreshold, bronze.stabilityThreshold, bronze.populationThreshold], ['writing', 78, 35, 25]);
  const result = validate(cards, eras);
  assert.deepEqual(result.errors, []);
  assert.equal(result.eraInventory[4].open, false);
  // Flipping the switch alone must be rejected: the inventory is met, but no balance evidence exists.
  const forced = structuredClone(eras); forced[3].contentGate.enabled = true;
  assert.ok(validate(cards, forced).errors.some(e => e.includes('gate enabled without recorded balance evidence')));
});

test('every new decision has a real cost; paying decisions require the reserve up front', () => {
  for (const c of empire) for (const ch of c.choices) {
    const costs = ch.outcomes.some(o => [ch.immediateEffects, o.effect, ...o.delayedEffects.map(d => d.effect)].some(e => Object.values(e.stats).some(v => v < 0)));
    assert.ok(costs, `${c.id}.${ch.id} must carry an actual cost`);
    const payment = Math.max(0, ...ch.outcomes.map(o => -(o.effect.stats.resources ?? 0)));
    if (payment > 0) {
      const reserve = Math.max(0, ...[...c.requirements, ...ch.requirements].filter(r => r.stat === 'resources').map(r => r.minimum ?? 0));
      assert.ok(reserve >= payment, `${c.id}.${ch.id} pays ${payment} but only requires ${reserve}`);
    }
  }
});

test('historical advantages in repeatable crises never print net resources', () => {
  for (const c of empire.filter(c => c.eraRole === 'recurring')) for (const ch of c.choices) {
    if (!ch.requirements.some(r => r.flag && earlyFlags.has(r.flag))) continue;
    for (const o of ch.outcomes) {
      const net = (o.effect.stats.resources ?? 0) + o.delayedEffects.reduce((s, d) => s + (d.effect.stats.resources ?? 0), 0);
      assert.ok(net <= 0, `${c.id}.${ch.id}.${o.id} nets ${net} resources from an old record`);
    }
  }
});

test('provincial ledger: exclusive states swap, arrears stay bounded, paid bonds stay closed, old rights are not erased', () => {
  const outcomes = empire.flatMap(c => c.choices.flatMap(ch => ch.outcomes.map(o => ({ c, ch, o }))));
  for (const [a, b] of [...LEDGER_EXCLUSIVE, ...PROVINCE_LEDGER_EXCLUSIVE]) for (const { c, ch, o } of outcomes) {
    if (o.effect.flags.includes(a)) assert.ok(o.effect.removeFlags?.includes(b), `${c.id}.${ch.id} sets ${a} without clearing ${b}`);
    if (o.effect.flags.includes(b)) assert.ok(o.effect.removeFlags?.includes(a), `${c.id}.${ch.id} sets ${b} without clearing ${a}`);
  }
  for (const { c, ch, o } of outcomes) {
    if (o.effect.flags.includes('tribute_arrears_deep')) assert.ok(o.requirements?.some(r => r.flag === 'tribute_arrears'), 'second tier only on top of the first');
    if (o.effect.flags.includes('tribute_arrears')) assert.ok([...c.requirements, ...ch.requirements, ...(o.requirements ?? [])].some(r => r.absentFlag === 'tribute_arrears' || r.absentFlag === 'tribute_arrears_deep'), `${c.id}.${ch.id} cannot stack arrears past two tiers`);
    assert.ok(!o.effect.flags.includes('bread_bond_open'), 'no Era 4 effect reopens a bread bond');
    if (o.effect.flags.includes('bread_bond_repaid')) assert.ok(o.effect.removeFlags?.includes('bread_bond_open') && ch.requirements.some(r => r.flag === 'bread_bond_open'), 'only an actually open bond can be closed');
    for (const removed of o.effect.removeFlags ?? []) assert.ok(!earlyFlags.has(removed) || removed === 'bread_bond_open', `${c.id}.${ch.id} erases earlier history ${removed}`);
    for (const d of o.delayedEffects) assert.equal(d.minimumEra, 4);
  }
  assert.ok(cards.find(c => c.id === 'tribute_assessment').requirements.some(r => r.absentFlag === 'tribute_arrears_deep'));
  assert.ok(cards.find(c => c.id === 'arrears_reckoning').requirements.some(r => r.flag === 'tribute_arrears'));
});

test('static fixture reachability: every new choice and context outcome has a satisfying state', () => {
  // Static approximation only; actual selection and replay are verified by the Swift engine tests.
  const match = (r, s) => (r.stat ? (s.stats[r.stat] >= (r.minimum ?? 0) && s.stats[r.stat] <= (r.maximum ?? 100)) : true)
    && (r.flag ? s.flags.has(r.flag) : true) && (r.absentFlag ? !s.flags.has(r.absentFlag) : true)
    && (r.technology ? s.technologies.has(r.technology) : true) && (r.completedCard ? s.completed.has(r.completedCard) : true);
  const satisfy = (list, s) => { for (const r of list) {
    if (r.flag) s.flags.add(r.flag); if (r.absentFlag) s.flags.delete(r.absentFlag);
    if (r.technology) s.technologies.add(r.technology);
    // A completed card leaves the flags of an actual decision behind (its first authored outcome).
    if (r.completedCard) { s.completed.add(r.completedCard); for (const f of cards.find(x => x.id === r.completedCard).choices[0].outcomes[0].effect.flags) s.flags.add(f); }
    if (r.stat) s.stats[r.stat] = Math.max(r.minimum ?? 0, Math.min(r.maximum ?? 100, s.stats[r.stat]));
  } };
  for (const c of empire) for (const ch of c.choices) for (const o of ch.outcomes) {
    const s = { stats: { population: 50, resources: 50, authority: 50, knowledge: 50, stability: 50, environment: 50 }, flags: new Set(), technologies: new Set(), completed: new Set() };
    satisfy([...c.requirements, ...ch.requirements, ...(o.requirements ?? [])], s);
    for (const r of [...c.requirements, ...ch.requirements, ...(o.requirements ?? [])]) assert.ok(match(r, s), `${c.id}.${ch.id}.${o.id} unsatisfiable`);
    assert.ok(!c.exclusionConditions.some(r => match(r, s) && (r.flag || r.absentFlag || r.stat)) || c.exclusionConditions.every(r => r.flag?.startsWith('resolved_')), `${c.id} excluded in its own fixture`);
    const available = c.choices.filter(x => x.requirements.every(r => match(r, s)) && x.outcomes.some(y => (y.requirements ?? []).every(r => match(r, s))));
    assert.ok(available.length >= 2, `${c.id}.${ch.id}.${o.id} fixture leaves fewer than two choices`);
  }
});
