import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validate } from './validate-content.mjs';

// Static checks for the 195 → 210 package (fifteen more Era 4 events, gate still closed).
// Engine behavior: Tests/FateCoreTests/EmpireGroundworkTests.swift and EraReadinessTests.swift.
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const cards = read('Sources/FateCore/Content/cards.json');
const eras = read('Sources/FateCore/Content/eras.json');
const byId = id => cards.find(c => c.id === id);
const fresh = cards.slice(195, 210);
const earlyFlags = new Set(cards.filter(c => c.era <= 3).flatMap(c => c.choices.flatMap(ch => ch.outcomes.flatMap(o => [...o.effect.flags, ...o.delayedEffects.flatMap(d => d.effect.flags)]))));
const results = c => c.choices.flatMap(ch => ch.outcomes.map(o => ({ c, ch, o })));
const reqs = (c, ch, o) => [...c.requirements, ...ch.requirements, ...(o?.requirements ?? [])];

test('the fifteen new events: eight crises, three bridges, three conclusions and one legal reform, all Era 4', () => {
  const expected = {
    recurring: ['garrison_rotation', 'caravan_bandits', 'grain_ceiling', 'river_customs', 'irrigation_court', 'quarry_collapse', 'coin_assay', 'governor_petition'],
    bridge: ['customs_house_ledger', 'harbor_ward_roll', 'watch_guild_charter'],
    conclusion: ['pasture_gate_levy', 'guest_assembly_bench', 'assembly_seal_appeal'],
    reform: ['civil_code_draft']
  };
  assert.equal(fresh.length, 15);
  for (const [role, ids] of Object.entries(expected)) assert.deepEqual(fresh.filter(c => c.eraRole === role).map(c => c.id), ids, role);
  for (const c of fresh) assert.equal(c.era, 4, c.id);
  assert.equal(cards.filter(c => c.era >= 5).length, 0, 'no card exists beyond Era 4');
});

test('bridges continue the named Bronze records; conclusions need a Bronze close and a completed imperial crisis', () => {
  const sources = { customs_house_ledger: 'quay_levy', harbor_ward_roll: 'harbor_residency', watch_guild_charter: 'night_patrol' };
  for (const [id, source] of Object.entries(sources)) {
    const c = byId(id);
    assert.ok(c.requirements.some(r => r.completedCard === source), id);
    assert.equal(byId(source).era, 3);
  }
  const chains = { pasture_gate_levy: 'pasture', guest_assembly_bench: 'hospitality', assembly_seal_appeal: 'public_voice' };
  for (const [id, chain] of Object.entries(chains)) {
    const c = byId(id);
    assert.equal(c.storyChainId, chain);
    const done = c.requirements.filter(r => r.completedCard).map(r => byId(r.completedCard));
    assert.ok(done.some(x => x.era === 3 && x.storyChainId === chain), `${id} closes a Bronze ${chain} record`);
    assert.ok(done.some(x => x.era === 4 && x.eraRole === 'recurring'), `${id} needs an imperial crisis first`);
  }
});

test('old rights grant a hearing, precedent or discount and never net resources in any new event', () => {
  for (const c of fresh) for (const ch of c.choices) {
    if (!ch.requirements.some(r => r.flag && earlyFlags.has(r.flag))) continue;
    for (const o of ch.outcomes) {
      const net = (o.effect.stats.resources ?? 0) + o.delayedEffects.reduce((s, d) => s + (d.effect.stats.resources ?? 0), 0);
      assert.ok(net <= 0, `${c.id}.${ch.id}.${o.id} nets ${net} resources from an old record`);
    }
  }
});

test('new debts stay bounded: wage arrears and debased coin open one tier only and close only through payment', () => {
  for (const { c, ch, o } of fresh.flatMap(results)) {
    const r = reqs(c, ch, o);
    if (o.effect.flags.includes('garrison_pay_arrears')) assert.ok(r.some(x => x.absentFlag === 'garrison_pay_arrears'), `${c.id}.${ch.id} stacks wage arrears`);
    if (o.effect.flags.includes('debased_coinage')) assert.ok(r.some(x => x.absentFlag === 'debased_coinage'), `${c.id}.${ch.id} stacks debasement`);
    for (const debt of ['garrison_pay_arrears', 'debased_coinage']) if (o.effect.removeFlags?.includes(debt)) {
      const paid = -(o.effect.stats.resources ?? 0);
      assert.ok(paid > 0, `${c.id}.${ch.id} clears ${debt} without paying`);
      assert.ok(r.some(x => x.stat === 'resources' && x.minimum >= paid), `${c.id}.${ch.id} clears ${debt} without the reserve`);
    }
    for (const removed of o.effect.removeFlags ?? []) assert.ok(!earlyFlags.has(removed), `${c.id}.${ch.id} erases earlier history ${removed}`);
    assert.ok(!(o.effect.removeFlags ?? []).includes('recorded_provincial_dissent'), `${c.id}.${ch.id} silently erases dissent`);
    assert.ok(!o.effect.flags.includes('bread_bond_open') && !o.effect.flags.includes('tribute_arrears'), `${c.id}.${ch.id} reopens an old debt`);
  }
});

test('the governor petition reads recorded dissent and keeps that record', () => {
  const c = byId('governor_petition');
  assert.ok(c.requirements.some(r => r.flag === 'recorded_provincial_dissent'));
  for (const { o } of results(c)) assert.ok(!(o.effect.removeFlags ?? []).includes('recorded_provincial_dissent'));
});

test('civil_law is granted only by the paid, conditional legal reform; it cannot open Era 5', () => {
  const grants = cards.flatMap(results).filter(({ o }) => o.effect.technologies.includes('civil_law'));
  assert.deepEqual([...new Set(grants.map(({ c }) => c.id))], ['civil_code_draft']);
  const reform = byId('civil_code_draft');
  assert.ok(reform.requirements.some(r => r.technology === 'writing'));
  assert.ok(reform.requirements.some(r => r.flag === 'lawful_review_precedent'));
  assert.ok(reform.requirements.some(r => r.stat === 'knowledge' && r.minimum >= 70));
  assert.ok(reform.exclusionConditions.some(r => r.technology === 'civil_law'), 'the reform leaves the deck once adopted');
  assert.ok(!reform.exclusionConditions.some(r => r.flag === 'resolved_civil_code_draft'), 'deferring the reform does not lose it forever');
  for (const { c, ch, o } of grants) {
    const paid = -(o.effect.stats.resources ?? 0);
    assert.ok(paid >= 9, `${ch.id} must be costly`);
    assert.ok(reqs(c, ch, o).some(r => r.stat === 'resources' && r.minimum >= paid), `${ch.id} pays without reserve`);
  }
  assert.ok(reform.choices.some(ch => ch.outcomes.every(o => !o.effect.technologies.length)), 'a non-adopting choice exists');
  // civil_law is Era 4's exit technology (4 → 5); Era 5 has no cards and a disabled gate.
  assert.equal(eras.find(e => e.id === 4).requiredTechnology, 'civil_law');
  assert.equal(eras.find(e => e.id === 5).contentGate.enabled, false);
  assert.equal(validate(cards, eras).eraInventory[5].open, false);
});

test('Era 4 stays closed at 90/40 and the validator still rejects flipping the switch alone', () => {
  const result = validate(cards, eras);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
  const inv = result.eraInventory[4];
  assert.deepEqual([inv.total, inv.recurring, inv.conclusions, inv.bridges, inv.enabled, inv.open], [90, 55, 17, 17, false, false]);
  assert.equal(inv.satisfied, true);
  const forced = structuredClone(eras); forced[3].contentGate.enabled = true;
  assert.ok(validate(cards, forced).errors.some(e => e.includes('gate enabled without recorded balance evidence')));
  const short = cards.filter(c => c.era < 4 || cards.indexOf(c) < 210);
  assert.ok(validate(short, forced).errors.some(e => e.includes('gate enabled before inventory')));
  const broken = structuredClone(cards); broken.find(c => c.id === 'civil_code_draft').exclusionConditions = [];
  assert.ok(validate(broken, eras).errors.some(e => e.includes('reform stays drawable')));
});
