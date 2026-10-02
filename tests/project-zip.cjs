const assert=require('node:assert/strict');
global.fflate=require('../vendor/fflate-0.8.3.js');
const zip=require('../project-zip.js');
const image='data:image/png;base64,aGVsbG8=';
const project={version:7,faceId:240,projectName:'Shared',layers:[{id:'a',type:'image',x:12,y:34,w:100,h:200,src:image,_im:{}} ,{id:'b',type:'animation',x:0,y:0,w:32,h:40,fps:24,frameStep:2,frames:[image,image]}],aodLayers:[{id:'c',type:'battery',x:1,y:2,w:3,h:4,style:'custom',textureSrc:image}],customFonts:[{family:'Custom',data:'data:font/ttf;base64,Zm9udA=='}]};
(async()=>{
  const bytes=await zip.encode(project);
  const restored=zip.decode(bytes);
  const clean=JSON.parse(JSON.stringify(project,(k,v)=>k.startsWith('_')?undefined:v));
  assert.deepEqual(restored,clean);
  const files=fflate.unzipSync(bytes);
  assert.equal(Object.keys(files).filter(k=>k.startsWith('assets/')).length,2,'Repeated PNGs are deduplicated');
  const manifest=JSON.parse(fflate.strFromU8(files['project.json']));
  assert.equal(manifest.project.layers[0].src.$asset,'assets/0.png');
  delete files['assets/0.png'];assert.throws(()=>zip.decode(fflate.zipSync(files)),/Missing ZIP asset/);
  assert.throws(()=>zip.decode(fflate.zipSync({'../project.json':new Uint8Array()})),/Unexpected file/);
  await assert.rejects(()=>zip.encode({...project,layers:[{type:'image',src:'https://example.com/image.png'}]}),/embedded/);
  console.log('ZIP project round-trip, PNG/font deduplication, AOD and unsafe archive guards passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
