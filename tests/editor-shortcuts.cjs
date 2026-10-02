const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const handlers = [];
const calls = [];
const context = vm.createContext({
  document: {addEventListener: (type, handler) => handlers.push(handler)},
  selected: 'test', project: {showGrid: true},
  undo: () => calls.push('undo'), redo: () => calls.push('redo'),
  duplicateLayerById: id => calls.push(`duplicate:${id}`),
  render() {}, scheduleHistory() {}, $: () => null
});
vm.runInContext(html.slice(html.indexOf('function shortcutKey('), html.indexOf('\nnewProject();', html.indexOf('function shortcutKey('))), context);
for (const [code, en, ru, action] of [['KeyZ', 'z', 'я', 'undo'], ['KeyY', 'y', 'н', 'redo'], ['KeyD', 'd', 'в', 'duplicate:test']]) {
  for (const key of [en, ru]) {
    calls.length = 0;
    let prevented = false;
    handlers[0]({code, key, ctrlKey: true, preventDefault: () => {prevented = true;}});
    assert.equal(calls[0], action);
    assert.ok(prevented);
  }
}
calls.length = 0;
handlers[0]({code: 'KeyZ', key: 'Я', metaKey: true, shiftKey: true, preventDefault() {}});
assert.equal(calls[0], 'redo');
handlers[1]({code: 'KeyG', key: 'п', target: {tagName: 'CANVAS'}, preventDefault() {}});
assert.equal(context.project.showGrid, false);
handlers[1]({code: 'KeyG', key: 'п', target: {tagName: 'INPUT'}, preventDefault() {}});
assert.equal(context.project.showGrid, false);
console.log('English/Russian shortcut handlers, shifted redo and grid input guard passed.');
