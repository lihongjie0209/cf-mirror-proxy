/**
 * check-upstreams.mjs
 * Verify all upstream URLs defined in src/index.ts are reachable.
 *
 * Usage:
 *   node scripts/check-upstreams.mjs [--concurrency 10] [--timeout 15]
 *
 * Exit code: 0 if all pass, 1 if any fail.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dir, '../src/index.ts'), 'utf8');

// ---------- extract mirrors from source ---------------------------------
// Parse every  upstream: 'http...'  or  upstream: "http..."  line.
// Also capture the mirror name from the nearest preceding key.
const entryRe =
  /^\s{2}['"]?([\w./-]+)['"]?\s*:\s*\{[\s\S]*?upstream:\s*['"`](https?:\/\/[^'"`]+)['"`]/gm;

const mirrors = [];
let m;
while ((m = entryRe.exec(src)) !== null) {
  mirrors.push({ name: m[1], upstream: m[2] });
}

if (mirrors.length === 0) {
  console.error('No mirrors found – check the regex against src/index.ts');
  process.exit(1);
}

// ---------- CLI args ----------------------------------------------------
const args = process.argv.slice(2);
const concurrency = Number(args[args.indexOf('--concurrency') + 1] || 10);
const timeoutMs    = Number(args[args.indexOf('--timeout')    + 1] || 15) * 1000;

// ---------- probe a single URL ------------------------------------------
async function probe(name, upstream) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Always request the root (or the exact upstream URL), just HEAD first.
  const url = upstream.endsWith('/') ? upstream : upstream + '/';

  const tryMethod = async (method) => {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'cf-mirror-proxy-checker/1.0' },
    });
    return res;
  };

  try {
    let res = await tryMethod('HEAD');
    // Some servers return 405 for HEAD – fall back to GET with no body read
    if (res.status === 405) {
      res = await tryMethod('GET');
      res.body?.cancel(); // discard body
    }
    clearTimeout(timer);
    const ok = res.ok || res.status === 301 || res.status === 302
                      || res.status === 403  // dir listing forbidden but server alive
                      || res.status === 404; // server alive, path just wrong
    return { name, upstream, status: res.status, ok };
  } catch (err) {
    clearTimeout(timer);
    const reason = controller.signal.aborted ? `TIMEOUT (>${timeoutMs / 1000}s)` : String(err.cause ?? err);
    return { name, upstream, status: null, ok: false, error: reason };
  }
}

// ---------- run with concurrency limit ----------------------------------
async function runAll(items, limit) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await probe(items[i].name, items[i].upstream);
      const r = results[i];
      const icon = r.ok ? '✅' : '❌';
      const statusStr = r.status != null ? String(r.status) : r.error;
      console.log(`${icon}  ${r.name.padEnd(26)} ${statusStr.padEnd(10)}  ${r.upstream}`);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// ---------- main --------------------------------------------------------
console.log(`Checking ${mirrors.length} upstreams  (concurrency=${concurrency}, timeout=${timeoutMs / 1000}s)\n`);
const t0 = Date.now();
const results = await runAll(mirrors, concurrency);
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

const failed = results.filter(r => !r.ok);
console.log(`\n${'─'.repeat(70)}`);
console.log(`Total: ${mirrors.length}  ✅ ${results.length - failed.length}  ❌ ${failed.length}  (${elapsed}s)`);

if (failed.length > 0) {
  console.log('\nFailed upstreams:');
  for (const r of failed) {
    console.log(`  ${r.name.padEnd(26)} ${String(r.status ?? r.error).padEnd(12)}  ${r.upstream}`);
  }
  process.exit(1);
}
