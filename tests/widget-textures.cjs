const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
function source(name) {
  const start = html.indexOf(`function ${name}(`);
  const end = html.indexOf('\nfunction ', start + 1);
  return html.slice(start, end);
}
const context = vm.createContext({Math, Number, clamp: (n, a, b) => Math.min(b, Math.max(a, n))});
for (const name of ['batteryParts', 'metricHeaderHeight', 'drawTexture', 'drawBatteryTexture']) vm.runInContext(source(name), context);
const base = {x: 0, y: 0, w: 100, h: 40};
for (const style of ['icon', 'bar', 'ring', 'custom', 'iconPercent']) {
  assert.equal(context.batteryParts({...base, style, showPercent: false}).value, null);
  assert.ok(context.batteryParts({...base, style, showPercent: true}).value);
}
assert.ok(context.batteryParts({...base, style: 'iconPercent'}).value);
assert.equal(context.batteryParts({...base, style: 'percent'}).icon, null);
assert.equal(context.metricHeaderHeight({...base, textureSrc: 'png', textureHeight: 24}), 24);
assert.equal(context.metricHeaderHeight({...base, h: 20, textureSrc: 'png', textureHeight: 80}), 8);
const calls = [];
const canvas = Object.fromEntries(['save', 'restore', 'beginPath', 'clip', 'rect', 'drawImage'].map(k => [k, (...args) => calls.push([k, ...args])]));
const image = {width: 100, height: 40};
for (const direction of ['up', 'right']) {
  for (const level of [0, 50, 100]) {
    calls.length = 0;
    context.drawBatteryTexture(canvas, {_textureSrc: image, _textureEmptySrc: image, textureDirection: direction}, base, level);
    const rect = calls.find(x => x[0] === 'rect').slice(1);
    assert.deepEqual(rect, direction === 'up' ? [0, 40 * (1 - level / 100), 100, 40 * level / 100] : [0, 0, level, 40]);
    assert.equal(calls.filter(x => x[0] === 'drawImage').length, 2);
  }
}
assert.ok(html.includes("k==='style')refreshProps()"));
assert.ok(html.includes("specs.push({kind:'sprite',seq:37"));
console.log('Widget texture and percentage tests passed; inline scripts compile.');
