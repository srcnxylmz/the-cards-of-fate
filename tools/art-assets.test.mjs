import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {spawnSync} from 'node:child_process';import {auditArt} from './art-pipeline.mjs';
const cards=JSON.parse(readFileSync('cards.json')),art=JSON.parse(readFileSync('assets/art_manifest.json'));
test('every card has a prompt; actual portrait files have matching hashes and catalogs',()=>{assert.deepEqual(auditArt(cards,art),[]);const fixtures=JSON.parse(readFileSync('UITests/ArtFixtures.json'));assert.equal(fixtures.length,art.filter(a=>a.file).length);assert.ok(fixtures.length>=25);assert.deepEqual(new Set(fixtures.map(f=>f.id)),new Set(art.filter(a=>a.file).map(a=>a.cardID)));});
for(const [name,change,expected] of [
 ['missing prompt',a=>delete a[0].modelPrompt,'incomplete brief'],
 ['invented generated file',a=>a[0].file='App/Assets.xcassets/nonexistent.png','claimed file absent'],
 ['stale file hash',a=>a[0].generationRecords.at(-1).sha256='bad','hash mismatch']
])test('art audit rejects '+name,()=>{const copy=structuredClone(art);change(copy);assert.ok(auditArt(cards,copy).some(e=>e.includes(expected)));});
test('registration refuses to overwrite any existing image or catalog',()=>{const before=readFileSync(art[0].file);const r=spawnSync(process.execPath,['tools/register-art.mjs','--card',cards[0].id,'--source',art[0].file,'--prompt-file','unused.txt'],{encoding:'utf8'});assert.notEqual(r.status,0);assert.match(r.stderr,/Refusing to overwrite/);assert.deepEqual(readFileSync(art[0].file),before);});
