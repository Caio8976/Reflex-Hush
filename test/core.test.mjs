import test from 'node:test';
import assert from 'node:assert/strict';
import { median, nextDelay, recordRound } from '../src/core.mjs';
test('median resists a single slow round and preserves the input', () => {
  const rounds = [210, 220, 950, 200, 230];
  assert.equal(median(rounds), 220);
  assert.equal(rounds[0], 210);
  assert.equal(median([200, 300]), 250);
  assert.equal(median([]), null);
});
test('only a live round can record a result', () => {
  const waiting = { phase: 'waiting', times: [] };
  assert.equal(recordRound(waiting, 120), waiting);
  assert.equal(recordRound({ phase: 'go', times: [1,2,3,4] }, 5).phase, 'done');
  assert.equal(nextDelay(() => 0), 1400);
  assert.equal(nextDelay(() => .99999), 3999);
});
