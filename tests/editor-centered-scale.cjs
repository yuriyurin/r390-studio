const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const context = vm.createContext({Math, snapValue: n => n});
for (const name of ['applyResize', 'scaleLayerFromDrag']) {
  const start = html.indexOf(`function ${name}(`);
  vm.runInContext(html.slice(start, html.indexOf('\nfunction ', start + 1)), context);
}
for (const delta of [50, -25, -1000]) {
  const orig = {x: 20, y: 40, w: 100, h: 50, fontSize: 20};
  const layer = {...orig, type: 'text'};
  context.scaleLayerFromDrag(layer, {orig, startX: 40, startY: 60}, {x: 40 + delta, y: 60});
  assert.equal(layer.x + layer.w / 2, 70);
  assert.equal(layer.y + layer.h / 2, 65);
  assert.ok(Math.abs(layer.w - layer.h * 2) <= 1, 'Proportions are preserved within pixel rounding');
  assert.ok(layer.w >= 8 && layer.h >= 8);
  assert.equal(delta > 0 ? layer.w > orig.w : layer.w < orig.w, true);
}
console.log('Shift body scaling preserves center, proportions and minimum size.');
