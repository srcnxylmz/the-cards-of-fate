import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function assertCardMirror(root = resolve(import.meta.dirname, '..')) {
  const canonical = readFileSync(resolve(root, 'Sources/FateCore/Content/cards.json'));
  const mirror = readFileSync(resolve(root, 'cards.json'));
  if (!canonical.equals(mirror)) throw new Error('Root cards.json is stale. Run node tools/build-content.mjs; edit authored modules, not JSON outputs.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  assertCardMirror();
  console.log('Root card mirror matches the runtime package resource.');
}
