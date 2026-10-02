const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('function applyResize(');
const end = html.indexOf('\nfunction drawGrid(', start);
const sizing = vm.createContext({Math, snapValue: n => n});
vm.runInContext(html.slice(start, end), sizing);
for (const handle of ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']) {
  const orig = {x: 20, y: 40, w: 100, h: 50, textureHeight: 20};
  const layer = {...orig, type: 'metric'};
  sizing.applyResize(layer, {orig, handle}, handle.includes('w') ? -80 : 220, handle.includes('n') ? -10 : 140, true);
  assert.equal(layer.w / layer.h, 2, handle);
  assert.equal(layer.textureHeight, Math.round(20 * layer.h / 50), handle);
  assert.equal(layer.y + layer.h / 2, 65);
  assert.equal(layer.x + layer.w / 2, 70);
}
const plain = {x: 0, y: 0, w: 100, h: 50};
sizing.applyResize(plain, {orig: {...plain}, handle: 'e'}, 150, 50, false);
assert.equal(plain.w, 150);
assert.equal(plain.h, 50);
const timers = new Map();
let nextTimer = 0;
const history = vm.createContext({
  project: {layers: [], aodLayers: [], customFonts: [], value: 0}, selected: null, editMode: 'main',
  setTimeout: fn => {timers.set(++nextTimer, fn); return nextTimer;},
  clearTimeout: id => timers.delete(id), $: () => ({}),
  hydrateProject: async () => {}, syncProjectInputs() {}, updateModeUI() {}, refreshAll() {}, setStatus() {}
});
vm.runInContext(html.slice(html.indexOf('const HISTORY_MAX='), html.indexOf('\nfunction uid(')), history);
(async () => {
  vm.runInContext("resetHistory();project.value=1;scheduleHistory('Edit')", history);
  await vm.runInContext('undo()', history);
  assert.equal(history.project.value, 0);
  assert.equal(timers.size, 0, 'Undo cancels the pending timer');
  await vm.runInContext('redo()', history);
  assert.equal(history.project.value, 1);
  vm.runInContext("project.value=2;scheduleHistory();resetHistory()", history);
  assert.equal(timers.size, 0, 'New projects cannot inherit delayed history');
  console.log('Immediate undo/redo and all eight Shift resize handles passed.');
})().catch(error => {console.error(error); process.exitCode = 1;});
