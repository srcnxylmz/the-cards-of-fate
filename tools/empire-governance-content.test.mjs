import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validate } from './validate-content.mjs';
import { EMPIRE_REBALANCE, PROVINCIAL_STORAGE, PROVINCIAL_GROWTH } from './content/empire-governance-events.mjs';

// Static checks for the 225 → 240 package (governance, demography, bounded accumulation; gate closed).
// Engine behavior (storage, growth, institutional defense, replay): Tests/FateCoreTests/EmpireGovernanceTests.swift.
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const cards = read('Sources/FateCore/Content/cards.json');
const eras = read('Sources/FateCore/Content/eras.json');
const balance = read('Sources/FateCore/Content/balance.json');
const politics = read('Sources/FateCore/Content/politics.json');
const before = read('docs/analysis/milestone240-225-before/cards.json');
const beforePolitics = read('docs/analysis/milestone240-225-before/politics.json');
const byId = id => cards.find(c => c.id === id);
const fresh = cards.slice(225);
const earlyFlags = new Set(cards.filter(c => c.era <= 3).flatMap(c => c.choices.flatMap(ch => ch.outcomes.flatMap(o => [...o.effect.flags, ...o.delayedEffects.flatMap(d => d.effect.flags)]))));
const results = c => c.choices.flatMap(ch => ch.outcomes.map(o => ({ c, ch, o })));
const RECURRING = ['assembly_power_share', 'tax_deferral', 'governor_recall', 'garrison_oversight', 'duty_rota', 'refugee_settlement', 'surplus_harvest', 'grain_contract', 'well_sanitation'];
const matches = (r, s) => (r.stat ? s.stats[r.stat] >= (r.minimum ?? 0) && s.stats[r.stat] <= (r.maximum ?? 100) : true)
  && (r.flag ? s.flags.has(r.flag) : true) && (r.absentFlag ? !s.flags.has(r.absentFlag) : true);
const open = (list, s) => (list ?? []).every(r => matches(r, s));

test('fifteen new Era 4 events: nine recurring, three Bronze bridges, three conditional conclusions; Era 4 reaches sixty', () => {
  assert.equal(fresh.length, 15);
  assert.deepEqual(fresh.filter(c => c.eraRole === 'recurring').map(c => c.id), RECURRING);
  assert.deepEqual(fresh.filter(c => c.eraRole === 'bridge').map(c => c.id), ['provincial_seal_charter', 'charcoal_forest_reserve', 'estate_bondage_record']);
  assert.deepEqual(fresh.filter(c => c.eraRole === 'conclusion').map(c => c.id), ['tithe_measure_recall', 'governor_succession_rule', 'merchant_grain_rights']);
  for (const e of [1, 2, 3, 4]) assert.equal(cards.filter(c => c.era === e).length, 60, `era ${e}`);
  assert.equal(cards.length, 240);
  for (const c of fresh) for (const lang of ['tr', 'en']) for (const ch of c.choices) assert.ok(ch.text[lang].length > 10 && ch.outcomes.every(o => o.text[lang].length > 30), `${c.id}.${ch.id} ${lang}`);
});

test('bridges and conclusions read the flags their Bronze records actually leave', () => {
  const pairs = { provincial_seal_charter: ['council_seal'], charcoal_forest_reserve: ['furnace_wood'], estate_bondage_record: ['debt_tablet'],
    tithe_measure_recall: ['seal_copy', 'harvest_tithe'], governor_succession_rule: ['succession_tablet', 'governor_recall'], merchant_grain_rights: ['caravan_charter', 'grain_contract'] };
  for (const [id, sources] of Object.entries(pairs)) {
    const c = byId(id);
    assert.deepEqual(c.requirements.map(r => r.completedCard), sources, id);
    assert.equal(byId(sources[0]).era, 3); assert.equal(byId(sources[0]).storyChainId, c.storyChainId);
    if (sources[1]) { assert.equal(byId(sources[1]).era, 4); assert.equal(byId(sources[1]).eraRole, 'recurring'); }
    const left = new Set(byId(sources[0]).choices.flatMap(ch => ch.outcomes.flatMap(o => o.effect.flags)));
    for (const ch of c.choices) for (const r of ch.requirements.filter(r => r.flag)) assert.ok(left.has(r.flag), `${id}.${ch.id} reads ${r.flag}`);
    // Whichever single Bronze outcome the player chose, the event still offers two choices.
    for (const flag of [...left].filter(f => !f.startsWith('resolved_'))) {
      const s = { stats: { resources: 50, population: 50, stability: 50, authority: 50, knowledge: 50, environment: 50 }, flags: new Set([flag]) };
      assert.ok(c.choices.filter(ch => open(ch.requirements, s)).length >= 2, `${id} with only ${flag}`);
    }
  }
});

test('the controlled rebalance is declared, measured and narrow: IDs, flags and debts unchanged, costs kept', () => {
  assert.ok(EMPIRE_REBALANCE.length >= 5);
  for (const r of EMPIRE_REBALANCE) {
    assert.ok(r.reason.length > 20, `${r.card}.${r.choice} needs a measured reason`);
    const old = before.find(c => c.id === r.card), now = byId(r.card);
    assert.equal(now.era, 4, 'only Era 4 decisions may be rebalanced');
    assert.deepEqual(now.choices.map(c => c.id), old.choices.map(c => c.id));
    const o0 = old.choices.find(c => c.id === r.choice).outcomes.find(o => o.id === r.outcome);
    const ch = now.choices.find(c => c.id === r.choice), o1 = ch.outcomes.find(o => o.id === r.outcome);
    assert.deepEqual(ch.requirements, old.choices.find(c => c.id === r.choice).requirements, 'requirements unchanged');
    assert.deepEqual([o1.effect.flags, o1.effect.removeFlags], [o0.effect.flags, o0.effect.removeFlags], 'historical flags and debts unchanged');
    assert.notDeepEqual(o1.effect.stats, o0.effect.stats, `${r.card}.${r.choice} actually changed`);
    const pop = s => s.population ?? 0;
    assert.ok(pop(o1.effect.stats) <= 0 && pop(o1.effect.stats) >= pop(o0.effect.stats), 'population cost is reduced, never turned into a gain');
    const cost = [o1.effect, ...o1.delayedEffects.map(d => d.effect)].flatMap(e => Object.values(e.stats)).filter(v => v < 0).length;
    assert.ok(cost >= 2, `${r.card}.${r.choice} still carries real costs`);
  }
  // Every other card of the 225 package is untouched (checked byte-for-byte in empire-content.test.mjs).
  const touched = new Set(EMPIRE_REBALANCE.map(r => r.card));
  for (const c of before.filter(c => !touched.has(c.id))) assert.deepEqual(byId(c.id), c, c.id);
});

test('bounded accumulation, growth and institutional defense are Era 4 data, not free resources', () => {
  assert.deepEqual(balance.provincialStorage, PROVINCIAL_STORAGE);
  assert.deepEqual(balance.provincialGrowth, PROVINCIAL_GROWTH);
  assert.equal(PROVINCIAL_STORAGE.minimumEra, 4); assert.equal(PROVINCIAL_STORAGE.maximumPerTurn, 1); assert.ok(PROVINCIAL_STORAGE.reserveCeiling <= 50);
  assert.equal(PROVINCIAL_GROWTH.minimumEra, 4); assert.ok(PROVINCIAL_GROWTH.interval >= 4 && PROVINCIAL_GROWTH.minimumStability >= 20 && PROVINCIAL_GROWTH.populationCeiling <= 60);
  for (const f of PROVINCIAL_STORAGE.flags) assert.ok(!earlyFlags.has(f), `${f} is an Era 4 record`);
  const rule = politics.institutionDefense;
  assert.equal(rule.minimumEra, 4); assert.ok(rule.maximumDefense <= 30);
  const { institutionDefense, ...rest } = politics;
  assert.deepEqual(rest, beforePolitics, 'no other political rule changed');
  // Every institution is bought with authority (or a once-only legacy choice), never handed out for free.
  for (const flag of rule.flags) {
    const setters = cards.flatMap(results).filter(({ o }) => o.effect.flags.includes(flag));
    assert.ok(setters.length > 0, flag);
    for (const { c, ch, o } of setters) assert.ok((o.effect.stats.authority ?? 0) < 0 || (o.effect.stats.resources ?? 0) < 0, `${c.id}.${ch.id} grants ${flag} without a price`);
  }
});

test('every new recurring event offers two real choices at zero reserve and under stress, none riskless', () => {
  const base = () => ({ stats: { population: 30, resources: 0, authority: 10, knowledge: 50, stability: 8, environment: 15 }, flags: new Set() });
  const fixtures = [s => s, s => { for (const f of ['estate_fields_worked', 'harbor_fishery_licensed', 'recorded_provincial_dissent', 'guest_citizenship', 'public_care_settlement']) s.flags.add(f); },
    s => { for (const f of ['garrison_pay_arrears', 'debased_coinage', 'provincial_tax_deferred', 'river_customs_farmed']) s.flags.add(f); }];
  for (const c of fresh.filter(c => c.eraRole === 'recurring')) for (const edit of fixtures) {
    const s = base(); edit(s);
    if (!open(c.requirements, s)) continue;
    const free = c.choices.filter(ch => open(ch.requirements, s) && ch.outcomes.some(o => open(o.requirements, s)));
    assert.ok(free.length >= 2, `${c.id} locks: ${free.map(ch => ch.id)}`);
    for (const ch of free) for (const o of ch.outcomes) assert.ok([o.effect, ...o.delayedEffects.map(d => d.effect)].some(e => Object.values(e.stats).some(v => v < 0)), `${c.id}.${ch.id} is riskless`);
  }
});

test('stability without coin always costs authority, rights, labour or future revenue', () => {
  for (const { c, ch, o } of fresh.flatMap(results)) {
    const st = o.effect.stats;
    if ((st.stability ?? 0) > 0 && !((st.resources ?? 0) < 0)) {
      const price = (st.authority ?? 0) < 0 || (st.population ?? 0) < 0 || (st.environment ?? 0) < 0 || (st.knowledge ?? 0) < 0
        || o.delayedEffects.some(d => Object.values(d.effect.stats).some(v => v < 0));
      assert.ok(price, `${c.id}.${ch.id}.${o.id} buys stability for nothing`);
    }
  }
});

test('ledger: the tax deferral and wage debts keep their identities and close only as written', () => {
  for (const { c, ch, o } of fresh.flatMap(results)) {
    const r = [...c.requirements, ...ch.requirements, ...(o.requirements ?? [])];
    if (o.effect.flags.includes('provincial_tax_deferred')) {
      assert.ok(r.some(x => x.absentFlag === 'provincial_tax_deferred'), 'one deferral at a time');
      assert.ok(o.delayedEffects.some(d => d.effect.removeFlags?.includes('provincial_tax_deferred') && d.effect.stats.resources < 0), 'the deferral falls due');
    }
    if (o.effect.flags.includes('garrison_pay_arrears')) assert.ok(r.some(x => x.absentFlag === 'garrison_pay_arrears'), `${c.id}.${ch.id} stacks wage arrears`);
    if (o.effect.removeFlags?.includes('garrison_pay_arrears')) assert.ok((o.effect.stats.resources ?? 0) < 0 && r.some(x => x.stat === 'resources' && x.minimum >= -o.effect.stats.resources), `${c.id}.${ch.id} clears wages without paying`);
    for (const removed of o.effect.removeFlags ?? []) assert.ok(!earlyFlags.has(removed), `${c.id}.${ch.id} erases ${removed}`);
    assert.ok(!(o.effect.removeFlags ?? []).includes('recorded_provincial_dissent'));
    if (r.some(x => x.flag && earlyFlags.has(x.flag))) {
      const net = (o.effect.stats.resources ?? 0) + o.delayedEffects.reduce((s, d) => s + (d.effect.stats.resources ?? 0), 0);
      assert.ok(net <= 0, `${c.id}.${ch.id}.${o.id} nets ${net} from an old record`);
    }
  }
});

test('Era 4 stays closed at sixty cards; no balance evidence is recorded', () => {
  const gate = eras.find(e => e.id === 4).contentGate;
  assert.deepEqual([gate.enabled, gate.balanceEvidence], [false, null]);
  const result = validate(cards, eras);
  assert.deepEqual([result.errors, result.warnings], [[], []]);
  const inv = result.eraInventory[4];
  assert.deepEqual([inv.total, inv.recurring, inv.conclusions, inv.bridges, inv.satisfied, inv.open], [60, 37, 11, 11, true, false]);
  assert.equal(result.eraInventory[5].open, false);
});
