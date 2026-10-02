const fs=require('node:fs');
const assert=require('node:assert/strict');
const dates=require('../date-layout.js');
const html=fs.readFileSync('index.html','utf8');
const shell=JSON.parse(html.match(/const SHELL\s*=\s*(\{[^\n]+\})/)[1]);
const template=Uint8Array.from(Buffer.from(html.match(/DATE_TEMPLATE_HEX='([^']+)'/)[1],'hex'));
const en={type:'date',dateFormat:'weekdayDayMonth',dateLanguage:'en',x:10,y:12,w:200,h:30,fontSize:20,color:'#00ffff'};
const ru={...en,dateLanguage:'ru',dateFormat:'dayMonthLong'};
assert.equal(dates.preview(en,'2026-10-02'),'FRI 02 OCT');
assert.equal(dates.preview(ru,'2026-10-02'),'02 октября');
assert.equal(dates.preview({...en,dateFormat:'numericDM'},'2026-10-02'),'02.10');
const resources=dates.prepare(shell,[en,ru],s=>Uint8Array.from(Buffer.from(s,'base64')));
assert.equal(resources.bases.get(en),25);assert.equal(resources.bases.get(ru),66);
for(const data of Object.values(resources.files)){
  const groups=dates.parseTable(data).groups;
  assert.equal(groups[25],'MON');assert.equal(groups[32],'JAN');assert.equal(groups[66],'ПН');assert.equal(groups[102],'ноября');
}
for(const format of ['weekdayDayMonth','dayMonth','dayMonthLong','monthDay','numericDM','numericMD','weekday','day']){
  const layer={...en,dateFormat:format},bytes=dates.widget(layer,template,25,3),view=new DataView(bytes.buffer);
  assert.equal(view.getUint32(0,true),13);assert.equal(view.getUint32(12,true),(3<<16)|100);
  const expected=dates.fields(format).map(k=>k.startsWith('week')?17:k==='day'?18:21);
  for(let i=0;i<expected.length;i++)assert.equal(view.getUint16(36+i*12,true),expected[i]);
  assert.equal(view.getUint32(88,true),0xff00ffff);
}
console.log('RU/EN dynamic date strings, source IDs and native composite layouts passed.');
