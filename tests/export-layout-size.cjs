const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8').replace(/\r\n/g,'\n');
function source(name){
  const match=new RegExp(`(?:async )?function ${name}\\(`).exec(html);
  if(!match)throw new Error(name);
  const rest=html.slice(match.index),end=/\n(?:async )?function /.exec(rest.slice(1));
  const close=rest.indexOf('\n}\n');
  return rest.slice(0,Math.min(end?end.index+1:rest.length,close>=0?close+2:rest.length));
}
function canvas(){
  const c={width:1,height:1};
  const q=new Proxy({getImageData:()=>({data:new Uint8ClampedArray(c.width*c.height*4)})},{get:(o,k)=>k in o?o[k]:()=>{}});
  c.getContext=()=>q;return c;
}
const shell=JSON.parse(html.match(/const SHELL\s*=\s*(\{[^\n]+\})/)[1]);
const context=vm.createContext({
  console,Uint8Array,Uint8ClampedArray,TextEncoder,TextDecoder,Math,Number,
  R390Date:require('../date-layout.js'),SHELL:shell,
  DATE_TEMPLATE_HEX:html.match(/DATE_TEMPLATE_HEX='([^']+)'/)[1],
  b64bytes:s=>Uint8Array.from(Buffer.from(s,'base64')),hexBytes:s=>Uint8Array.from(Buffer.from(s,'hex')),
  document:{createElement:()=>canvas()},loadImg:async()=>({width:16,height:16}),
  waitFont:async()=>{},fontFamily:()=> 'Arial',fontCssFamily:()=> 'Arial',
  drawOutlinedText(){},drawTexture(){},roundPath(){},outlinePx:l=>l.outlineEnabled?Number(l.outlineWidth)||1:0,
  analogCenter:l=>({x:l.x+l.w/2,y:l.y+l.h/2}),
  clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),samsungFit3ShapeReady:false,
  pullProjectInputs(){},setStatus(){},validateBin(){return true},renderLayersToCanvas:async()=>{const c=canvas();c.width=256;c.height=402;return c}
});
for(const name of ['animationExportFrames','metricHeaderHeight','metricLayout','timeLayout','batteryParts','estimatedBinBytes','rgb565','rasterFromCanvas','clipLayerCanvasToOfficialMask','flattenOfficialPreviewToBlack','canvasOfImage','u16le','u32le','concat','ascii','crc16','widgetType1','widgetAnalog','widgetSprite','widgetTimed','hexToArgb','outlineOffsets','widgetMetric','widgetDate','textRasterCanvas','analogHandCanvas','batteryCanvas','drawBatteryShape','styleBin','makeSetting','oppoContainer','buildStyleForLayers','buildBin'])vm.runInContext(source(name),context);
const time={id:'time',type:'time',x:20,y:40,w:100,h:100,digitW:25,digitH:40,gap:2,rowGap:8,fontSize:30,color:'#00ffff',minuteColor:'#ffffff',timeStyle:'stacked'};
const batteryNumber=context.widgetMetric(37,202,13,25,19,13,'#00edf4',0);
assert.equal(new DataView(batteryNumber.buffer).getUint32(32,true),1,'numeric anchor is a full 32-bit word');
assert.equal(new DataView(batteryNumber.buffer).getUint32(40,true),0x01000001);
assert.equal(new DataView(batteryNumber.buffer).getUint32(44,true),0x0015ffff);
const batterySprite=context.widgetSprite(37,169,13,Array(11).fill(0),0);
assert.equal(new DataView(batterySprite.buffer).getUint32(28,true),1,'battery uses the stock 00001 sprite mode');
const q=context.timeLayout(time);assert.equal(q.mY,88);assert.equal(q.m10,q.h10);assert.equal(q.colon,null);
const metric={type:'metric',x:10,y:10,w:100,h:40,label:'Steps',sample:'8264',textureSrc:'png',textureHeight:20,seq:29};
for(const position of ['left','right','top','bottom','none']){
  const parts=context.metricLayout({...metric,iconPosition:position});
  if(position==='left'){assert.equal(parts.value.x,30);assert.equal(parts.value.w,80)}
  if(position==='right'){assert.equal(parts.accessory.x,90);assert.equal(parts.value.x,10)}
  if(position==='none')assert.equal(parts.icon,false);
}
assert.equal(context.metricLayout({...metric,iconPosition:'none',showLabel:false}).accessory,null);
(async()=>{
  const base={faceId:240,layers:[],aodLayers:[],customFonts:[],bgColor:'#000',aodBgColor:'#000'};
  const cases=[[],[time],[{...time,timeStyle:'horizontal',blinkColon:true,outlineEnabled:true,outlineWidth:2}],[{...metric,iconPosition:'left'}],[{type:'battery',x:0,y:0,w:60,h:40,style:'iconPercent',showPercent:true,outlineEnabled:true,outlineWidth:1}],[{type:'animation',x:0,y:0,w:20,h:30,fps:24,frameStep:2,frames:['a','b','c','d']}],[{type:'date',dateFormat:'weekdayDayMonth',dateLanguage:'en',x:0,y:0,w:200,h:30,fontSize:20,color:'#fff'}],[{type:'analog',x:0,y:0,w:160,h:160,capRadius:5}]];
  for(const layers of cases){
    context.project={...base,layers,aodLayers:[{...time,timeStyle:'hours'}]};
    const estimated=context.estimatedBinBytes(),actual=await context.buildBin();
    assert.equal(estimated,actual.length,JSON.stringify(layers.map(l=>l.type)));
  }
  context.project={...base,layers:[{type:'animation',x:0,y:0,w:256,h:402,fps:24,frames:Array(96).fill('frame')}]};
  assert.ok(context.estimatedBinBytes()>28*1048576,'96 full-screen GIF frames really exceed the limit');
  await assert.rejects(()=>context.buildBin(),/> 4 MiB/);
  console.log('Stacked time, icon placement and exact BIN estimates match actual exports; oversized GIFs are rejected before allocation.');
})().catch(e=>{console.error(e);process.exitCode=1});
