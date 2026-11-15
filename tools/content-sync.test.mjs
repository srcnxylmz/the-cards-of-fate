import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assertCardMirror } from './content-sync.mjs';

test('committed card mirror matches the runtime resource', () => assertCardMirror());
test('stale or hand-edited root mirror fails explicitly', () => {
  const root = mkdtempSync(join(tmpdir(), 'fate-content-sync-'));
  try {
    mkdirSync(join(root, 'Sources/FateCore/Content'), { recursive: true });
    writeFileSync(join(root, 'Sources/FateCore/Content/cards.json'), '[]\n');
    writeFileSync(join(root, 'cards.json'), '[{}]\n');
    assert.throws(() => assertCardMirror(root), /stale/);
    writeFileSync(join(root, 'cards.json'), '[]\n');
    assert.doesNotThrow(() => assertCardMirror(root));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
