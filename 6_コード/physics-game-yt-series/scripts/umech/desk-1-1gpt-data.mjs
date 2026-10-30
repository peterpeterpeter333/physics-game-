// ChatGPT 試作 1-1：正本の数値・文字対応を独立に検算する。
// 既存の暗号テキスト生成器は共通部品として読むが、v5/v6 の回別データは読まない。
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {ABC, SUB, TEXT1, C1} from './yt1-chain-00bx-common.mjs';

const replace = text => [...text].map(ch => {
  const i = ABC.indexOf(ch);
  return i < 0 ? ch : SUB[i];
}).join('');
const rotate = (text, n) => [...text].map(ch => {
  const i = ABC.indexOf(ch);
  return i < 0 ? ch : ABC[(i + n + 26) % 26];
}).join('');
const words = C1.match(/[A-Z]+/g) ?? [];
const count = (text, needle) => [...text.matchAll(new RegExp(needle, 'g'))].length;
const letterCount = letter => [...C1].filter(ch => ch === letter).length;

assert.equal(rotate('CAT', 3), 'FDW');
assert.equal(rotate('A', 3), 'D');
assert.equal(rotate('B', 3), 'E');
assert.equal(rotate('Z', 3), 'C');
assert.equal(rotate('COUNT THE LETTERS', 10), 'MYEXD DRO VODDOBC');
assert.equal(new Set(Array.from({length: 25}, (_, i) => rotate('CAT', i + 1))).size, 25);

assert.equal(SUB, 'QWEMXAZVPBTGNOCLRSUJHYDFIK');
assert.equal(new Set(SUB).size, 26);
assert.equal(replace('CAT'), 'EQJ');
for (const [plain, cipher] of Object.entries({A:'Q', T:'J', E:'X', H:'V', L:'G', W:'D', I:'P', M:'N', R:'S', Y:'I'})) {
  assert.equal(replace(plain), cipher);
}
const fact26 = Array.from({length: 26}, (_, i) => BigInt(i + 1)).reduce((a, b) => a * b, 1n);
assert.equal(fact26, 403291461126605635584000000n);
const years = Number(fact26) / 1e12 / (365.25 * 24 * 3600);
assert.ok(years > 12.7e6 && years < 12.9e6);

assert.equal([...C1].filter(ch => /[A-Z]/.test(ch)).length, 541);
assert.equal(letterCount('X'), 70);
assert.equal(letterCount('J'), 60);
assert.equal(words.filter(word => word === 'JVX').length, 14);
assert.deepEqual(words.filter(word => word.length === 1), ['Q','Q','Q','Q']);
assert.equal(count(C1, 'NXXJ QJ JVX'), 1);
assert.equal(words.filter(word => word === 'JXGG').length, 1);
assert.equal(words.filter(word => word === 'DPGG').length, 3);
assert.equal(replace('MEET AT THE'), 'NXXJ QJ JVX');
assert.equal(replace('TELL'), 'JXGG');
assert.equal(replace('WILL'), 'DPGG');
assert.equal(replace('ARMY'), 'QSNI');
assert.ok(TEXT1.startsWith('THE ARMY WILL MEET AT THE'));
assert.ok(C1.startsWith('JVX QSNI DPGG NXXJ QJ JVX'));

const report = {caesar:'CAT→FDW / Z→C / 25通り', substitution:'CAT→EQJ; E→X, T→J, H→V',
  x:70, j:60, jvx:14, qStandalone:4, jxgg:1, dpgg:3,
  head:'JVX QSNI DPGG NXXJ QJ JVX', fact26:String(fact26), years,
  challenge:'MYEXD DRO VODDOBC'};
if (import.meta.url === `file://${process.argv[1]}`) {
  const cache=process.env.EM_FILM_CACHE;
  if(!cache)throw Error('EM_FILM_CACHE is required');
  mkdirSync(`${cache}/blender`,{recursive:true});
  writeFileSync(`${cache}/blender/data.json`,JSON.stringify({abc:ABC,sub:SUB,plain:TEXT1,cipher:C1,report},null,2));
  console.log(JSON.stringify(report, null, 2));
}
export {report};
