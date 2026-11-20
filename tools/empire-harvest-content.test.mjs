import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validate } from './validate-content.mjs';
import { PROVINCIAL_PRODUCTION } from './content/empire-harvest-events.mjs';

// Static checks for the 210 → 225 package (the Ancient Empires food and production loop, gate closed).
// Engine behavior (food budget, delayed returns, replay, gate): Tests/FateCoreTests/EmpireHarvestTests.swift.
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const cards = read('Sources/FateCore/Content/cards.json');
const eras = read('Sources/FateCore/Content/eras.json');
const balance = read('Sources/FateCore/Content/balance.json');
const byId = id => cards.find(c => c.id === id);
const fresh = cards.slice(210);
const empire = cards.filter(c => c.era === 4);
const earlyFlags = new Set(cards.filter(c => c.era <= 3).flatMap(c => c.choices.flatMap(ch => ch.outcomes.flatMap(o => [...o.effect.flags, ...o.delayedEffects.flatMap(d => d.effect.flags)]))));
const results = c => c.choices.flatMap(ch => ch.outcomes.map(o => ({ c, ch, o })));
const effects = o => [o.effect, ...o.delayedEffects.map(d => d.effect)];
const FOOD = ['provincial_estates', 'crop_share_dispute', 'harvest_tithe', 'famine_store_release', 'canal_extension', 'harbor_fishery', 'grain_convoy', 'drought_year'];

// Static requirement matcher (the Swift engine tests check the real selector).
const matches = (r, s) => (r.stat ? s.stats[r.stat] >= (r.minimum ?? 0) && s.stats[r.stat] <= (r.maximum ?? 100) : true)
  && (r.flag ? s.flags.has(r.flag) : true) && (r.absentFlag ? !s.flags.has(r.absentFlag) : true)
  && (r.technology ? s.technologies.has(r.technology) : true) && (r.completedCard ? s.completed.has(r.completedCard) : true);
const open = (list, s) => (list ?? []).every(r => matches(r, s));
const usable = (ch, s) => open(ch.requirements, s) && ch.outcomes.some(o => open(o.requirements, s));

test('fifteen new Era 4 events: eleven recurring, two Bronze bridges, two conditional conclusions', () => {
  const expected = {
    recurring: [...FOOD, 'plague_quarantine', 'insula_fire', 'ferry_upkeep'],
    bridge: ['infirmary_ward', 'granary_tally_office'],
    conclusion: ['quarry_stone_granary', 'furnace_fire_law']
  };
  assert.equal(fresh.length, 15);
  for (const [role, ids] of Object.entries(expected)) assert.deepEqual(fresh.filter(c => c.eraRole === role).map(c => c.id), ids, role);
  for (const c of fresh) assert.equal(c.era, 4, c.id);
  assert.equal(cards.length, 225);
  assert.deepEqual(['recurring', 'conclusion', 'bridge', 'reform'].map(r => empire.filter(c => c.eraRole === r).length), [28, 8, 8, 1]);
  for (const c of fresh) for (const lang of ['tr', 'en']) for (const ch of c.choices) assert.ok(ch.text[lang].length > 10 && ch.outcomes.every(o => o.text[lang].length > 30), `${c.id}.${ch.id} ${lang}`);
});

test('bridges continue ward_charter and clay_archive; conclusions close stored_power and embers after an imperial crisis', () => {
  assert.deepEqual(byId('infirmary_ward').requirements, [{ completedCard: 'ward_charter' }]);
  assert.deepEqual(byId('granary_tally_office').requirements, [{ completedCard: 'clay_archive' }]);
  for (const [id, chain, bronze, imperial] of [['quarry_stone_granary', 'stored_power', 'quarry_arbitration', 'quarry_collapse'], ['furnace_fire_law', 'embers', 'furnace_coop', 'insula_fire']]) {
    const c = byId(id);
    assert.equal(c.storyChainId, chain);
    assert.equal(byId(bronze).era, 3); assert.equal(byId(bronze).storyChainId, chain);
    assert.equal(byId(imperial).era, 4); assert.equal(byId(imperial).eraRole, 'recurring');
    assert.deepEqual(c.requirements.map(r => r.completedCard), [bronze, imperial]);
    assert.ok(c.exclusionConditions.some(x => x.flag === `resolved_${id}`), id + ' closes');
  }
  // Each bridge choice that cites a Bronze record reads a flag that record actually leaves behind.
  for (const [id, source] of [['infirmary_ward', 'ward_charter'], ['granary_tally_office', 'clay_archive']]) {
    const left = new Set(byId(source).choices.flatMap(ch => ch.outcomes.flatMap(o => o.effect.flags)));
    for (const ch of byId(id).choices) for (const r of ch.requirements.filter(r => r.flag)) assert.ok(left.has(r.flag), `${id}.${ch.id} reads ${r.flag}`);
  }
});

test('production capacities are Era 4 only, one share each, conditioned on labour or land, and recorded in balance.json', () => {
  assert.deepEqual(balance.provincialProduction, PROVINCIAL_PRODUCTION);
  for (const p of PROVINCIAL_PRODUCTION) {
    assert.equal(p.minimumEra, 4); assert.equal(p.yield, 1);
    assert.ok(p.minimumPopulation > 0 || p.minimumEnvironment > 0, p.flag + ' depends on hands or a living land');
    assert.ok(!earlyFlags.has(p.flag), p.flag + ' cannot be earned before Era 4');
    const setters = cards.flatMap(results).filter(({ o }) => effects(o).some(e => e.flags.includes(p.flag)));
    assert.ok(setters.length > 0, p.flag);
    for (const { c, ch, o } of setters) {
      assert.equal(c.era, 4);
      const costs = Object.values(o.effect.stats).some(v => v < 0) || Object.values(ch.immediateEffects.stats).some(v => v < 0);
      assert.ok(costs, `${c.id}.${ch.id}.${o.id} builds ${p.flag} without a cost`);
    }
  }
  // Every physical capacity can be lost again (abandonment, silt, a dry season); the register is an administrative record.
  for (const flag of ['estate_fields_worked', 'canal_fields_open', 'harbor_fishery_licensed']) {
    const lost = cards.flatMap(results).some(({ o }) => effects(o).some(e => (e.removeFlags ?? []).includes(flag)))
      || PROVINCIAL_PRODUCTION.find(p => p.flag === flag).minimumEnvironment > 0;
    assert.ok(lost, flag + ' can decline');
  }
  assert.ok(cards.flatMap(results).some(({ o }) => (o.delayedEffects.some(d => (d.effect.removeFlags ?? []).includes('canal_fields_open')))), 'deferred dredging silts the canal later');
});

test('paid investments return later and less than they cost; old rights only discount', () => {
  for (const { c, ch, o } of fresh.flatMap(results)) {
    const now = o.effect.stats.resources ?? 0;
    const later = o.delayedEffects.reduce((s, d) => s + (d.effect.stats.resources ?? 0), 0);
    if (now < 0 && later > 0) {
      assert.ok(later < -now, `${c.id}.${ch.id}.${o.id} returns ${later} for ${-now}`);
      assert.ok(o.delayedEffects.every(d => d.afterTurns >= 3 && d.minimumEra === 4), `${c.id}.${ch.id} return is delayed`);
    }
    const cited = [...ch.requirements, ...(o.requirements ?? [])].some(r => r.flag && earlyFlags.has(r.flag));
    if (cited) assert.ok(now + later <= 0, `${c.id}.${ch.id}.${o.id} nets ${now + later} from an old record`);
    for (const removed of o.effect.removeFlags ?? []) assert.ok(!earlyFlags.has(removed), `${c.id}.${ch.id} erases earlier history ${removed}`);
  }
});

test('every recurring food event keeps at least two real choices at zero reserve, low stability, low population, ruined land, debt and hostility', () => {
  const base = () => ({ stats: { population: 40, resources: 0, authority: 40, knowledge: 60, stability: 40, environment: 40 }, flags: new Set(), technologies: new Set(['hearth', 'cultivation', 'smelting', 'writing']), completed: new Set() });
  const fixtures = [
    ['zero reserve', s => s],
    ['low stability', s => { s.stats.stability = 5; }],
    ['low population', s => { s.stats.population = 12; }],
    ['ruined land', s => { s.stats.environment = 5; }],
    ['open debts', s => { for (const f of ['garrison_pay_arrears', 'debased_coinage', 'temple_grain_loan', 'tribute_arrears', 'grain_price_ceiling', 'river_customs_farmed']) s.flags.add(f); }],
    ['all capacities', s => { for (const p of PROVINCIAL_PRODUCTION) s.flags.add(p.flag); s.flags.add('grain_famine_store'); }],
    ['hostile council', s => { s.stats.authority = 3; s.flags.add('recorded_provincial_dissent'); }]
  ];
  for (const c of fresh.filter(c => c.eraRole === 'recurring')) for (const [name, edit] of fixtures) {
    const s = base(); edit(s);
    if (!open(c.requirements, s)) continue;
    const free = c.choices.filter(ch => usable(ch, s));
    assert.ok(free.length >= 2, `${c.id} locks at ${name}: ${free.map(ch => ch.id)}`);
    // No free path is riskless: every zero-reserve choice still costs a stat in each reachable outcome.
    for (const ch of free) for (const o of ch.outcomes.filter(o => open(o.requirements, s))) {
      const cost = [o.effect, ...o.delayedEffects.map(d => d.effect)].some(e => Object.values(e.stats).some(v => v < 0)) || (o.effect.removeFlags ?? []).length > 0;
      assert.ok(cost, `${c.id}.${ch.id}.${o.id} is riskless`);
    }
  }
  assert.ok(FOOD.length >= 5);
});

test('the earlier imperial ledger is read, debts keep separate identities, and paid debts stay closed', () => {
  const read = new Set(fresh.flatMap(c => c.choices.flatMap(ch => [...ch.requirements, ...ch.outcomes.flatMap(o => o.requirements ?? [])])).flatMap(r => [r.flag, r.absentFlag]).filter(Boolean));
  for (const flag of ['garrison_pay_arrears', 'debased_coinage', 'caravan_insurance_pool', 'grain_price_ceiling', 'river_customs_farmed', 'grain_famine_store']) assert.ok(read.has(flag), flag);
  for (const { c, ch, o } of fresh.flatMap(results)) {
    const r = [...c.requirements, ...ch.requirements, ...(o.requirements ?? [])];
    if (o.effect.flags.includes('temple_grain_loan')) {
      assert.ok(r.some(x => x.absentFlag === 'temple_grain_loan'), 'one temple loan at a time');
      const repay = o.delayedEffects.find(d => (d.effect.removeFlags ?? []).includes('temple_grain_loan'));
      assert.ok(repay && repay.effect.stats.resources <= -(o.effect.stats.resources ?? 0), 'the loan repays at least what it lent');
    }
    if ((o.effect.removeFlags ?? []).includes('garrison_pay_arrears')) {
      const paid = -(o.effect.stats.resources ?? 0);
      assert.ok(paid > 0 && r.some(x => x.stat === 'resources' && x.minimum >= paid), `${c.id}.${ch.id} clears wage arrears only by payment`);
    }
    for (const reopened of ['bread_bond_open', 'tribute_arrears', 'garrison_pay_arrears', 'debased_coinage']) assert.ok(!o.effect.flags.includes(reopened), `${c.id}.${ch.id} opens ${reopened}`);
    assert.ok(!(o.effect.removeFlags ?? []).includes('recorded_provincial_dissent'));
    if (o.effect.flags.includes('grain_famine_store')) assert.ok(o.effect.removeFlags?.includes('grain_price_ceiling'), 'store and ceiling stay exclusive');
  }
});

test('Era 4 stays closed: the 45-card inventory is met, but the switch is off and no balance evidence is recorded', () => {
  const gate = eras.find(e => e.id === 4).contentGate;
  assert.equal(gate.enabled, false);
  assert.equal(gate.balanceEvidence, null);
  const result = validate(cards, eras);
  assert.deepEqual([result.errors, result.warnings], [[], []]);
  const inv = result.eraInventory[4];
  assert.deepEqual([inv.total, inv.recurring, inv.conclusions, inv.bridges, inv.satisfied, inv.open], [45, 28, 8, 8, true, false]);
  const forced = structuredClone(eras); forced[3].contentGate.enabled = true;
  assert.ok(validate(cards, forced).errors.some(e => e.includes('without recorded balance evidence')));
});
