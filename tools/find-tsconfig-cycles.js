import fs from 'node:fs';
import path from 'node:path';

function resolveRef(fromDir, refPath) {
  let p = path.resolve(fromDir, refPath);
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
    p = path.join(p, 'tsconfig.json');
  }
  if (!p.endsWith('.json')) p += '.json';
  return p;
}

const visiting = new Set();
const visited = new Set();
const stack = [];
let cycleCount = 0;

function dfs(file) {
  if (!fs.existsSync(file)) return;
  if (visiting.has(file)) {
    cycleCount++;
    const idx = stack.indexOf(file);
    console.log(
      `\n🔴 순환 참조 #${cycleCount}:\n   ` +
        stack
          .slice(idx)
          .concat(file)
          .map((f) => path.relative(process.cwd(), f))
          .join('\n   → ')
    );
    return;
  }
  if (visited.has(file)) return;

  visiting.add(file);
  stack.push(file);

  let json = {};
  try {
    // 주석 제거 후 파싱 (tsconfig는 JSONC 허용, 인라인 주석 포함)
    json = JSON.parse(
      fs
        .readFileSync(file, 'utf8')
        .replace(/\/\/[^\n"]*$/gm, '')
        .replace(/^\s*\/\/.*$/gm, '')
    );
  } catch (e) {
    console.warn(`⚠️ 파싱 실패: ${file}`);
  }

  for (const ref of json.references ?? []) {
    dfs(resolveRef(path.dirname(file), ref.path));
  }

  visiting.delete(file);
  stack.pop();
  visited.add(file);
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      e.name === 'node_modules' ||
      e.name.startsWith('.') ||
      e.name === 'dist'
    )
      continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/^tsconfig.*\.json$/.test(e.name)) dfs(full);
  }
}

walk(process.cwd());
console.log(
  cycleCount === 0 ? '\n✅ 순환 참조 없음' : `\n총 ${cycleCount}개의 순환 발견`
);
