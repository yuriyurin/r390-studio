const R390Zip = (() => {
  const MAX_BYTES=128*1048576;
  function dataBytes(value){
    const match=/^data:([^;,]*)(?:;[^,]*)?;base64,(.*)$/s.exec(value);
    if(!match)throw new Error('Unsupported project asset');
    const binary=atob(match[2]);return {mime:match[1]||'application/octet-stream',bytes:Uint8Array.from(binary,c=>c.charCodeAt(0))};
  }
  function dataURL(bytes,mime){
    let binary='';for(let i=0;i<bytes.length;i+=16384)binary+=String.fromCharCode(...bytes.subarray(i,i+16384));
    return `data:${mime};base64,${btoa(binary)}`;
  }
  function validate(project){
    if(!project||typeof project!=='object'||Array.isArray(project)||!Array.isArray(project.layers)||project.layers.length>1000||!Array.isArray(project.aodLayers||[])||(project.aodLayers||[]).length>1000)throw new Error('Invalid R390 project');
    for(const l of [...project.layers,...(project.aodLayers||[])]){
      if(!l||typeof l!=='object')throw new Error('Invalid project layer');
      for(const k of ['src','textureSrc','textureEmptySrc'])if(l[k]&&!(typeof l[k]==='string'&&/^data:image\/(png|jpeg|webp|gif);base64,/.test(l[k])))throw new Error('Project images must be embedded');
      if(l.frames&&(!Array.isArray(l.frames)||l.frames.length>118||l.frames.some(f=>typeof f!=='string'||!/^data:image\/(png|jpeg|webp);base64,/.test(f))))throw new Error('Invalid animation frames');
    }
    if(!Array.isArray(project.customFonts||[])||(project.customFonts||[]).length>100)throw new Error('Invalid project fonts');
    for(const f of project.customFonts||[]){
      if(!f||typeof f.data!=='string'||!/^data:[-\w.+]+\/[-\w.+]+;base64,[A-Za-z0-9+/=\s]+$/.test(f.data))throw new Error('Project fonts must be embedded');
    }
  }
  function walk(value,replace,depth=0){
    if(depth>32)throw new Error('Project nesting limit exceeded');
    const changed=replace(value);if(changed!==value)return changed;
    if(Array.isArray(value))return value.map(v=>walk(v,replace,depth+1));
    if(value&&typeof value==='object'){
      const result={};for(const [key,v] of Object.entries(value)){
        if(['__proto__','constructor','prototype'].includes(key))throw new Error('Invalid project key');
        result[key]=walk(v,replace,depth+1);
      }return result;
    }
    return value;
  }
  async function encode(project,preview){
    const clean=JSON.parse(JSON.stringify(project,(key,value)=>key.startsWith('_')?undefined:value));validate(clean);
    const files={},assets=new Map();let size=0;
    const archived=walk(clean,value=>{
      if(typeof value!=='string'||!value.startsWith('data:'))return value;
      if(assets.has(value))return assets.get(value);
      const {bytes,mime}=dataBytes(value);size+=bytes.length;if(size>MAX_BYTES)throw new Error('Project ZIP exceeds 128 MiB');
      const ext=mime==='image/png'?'png':mime==='image/jpeg'?'jpg':mime==='image/webp'?'webp':'bin';
      const path=`assets/${assets.size}.${ext}`,ref={$asset:path,mime};files[path]=[bytes,{level:0}];assets.set(value,ref);return ref;
    });
    files['project.json']=fflate.strToU8(JSON.stringify({format:'r390-studio-project',version:1,project:archived},null,2));
    if(preview)files['preview.png']=[dataBytes(preview).bytes,{level:0}];
    return new Promise((resolve,reject)=>fflate.zip(files,{level:6},(error,data)=>error?reject(error):resolve(data)));
  }
  function decode(bytes){
    if(bytes.length>MAX_BYTES)throw new Error('Project ZIP exceeds 128 MiB');
    let expanded=0,count=0;
    const files=fflate.unzipSync(bytes,{filter:entry=>{
      expanded+=entry.originalSize;count++;
      if(expanded>MAX_BYTES||count>5000)throw new Error('Project ZIP expansion limit exceeded');
      if(entry.name==='project.json'||entry.name==='preview.png'||/^assets\/\d+\.(png|jpg|webp|bin)$/.test(entry.name))return true;
      throw new Error('Unexpected file in R390 project ZIP');
    }});
    if(!files['project.json'])throw new Error('project.json is missing');
    const manifest=JSON.parse(fflate.strFromU8(files['project.json']));
    if(manifest.format!=='r390-studio-project'||manifest.version!==1)throw new Error('Unsupported R390 project ZIP');
    const project=walk(manifest.project,value=>{
      if(!value||typeof value!=='object'||!Object.hasOwn(value,'$asset'))return value;
      if(typeof value.$asset!=='string'||!/^assets\/\d+\.(png|jpg|webp|bin)$/.test(value.$asset)||!files[value.$asset])throw new Error('Missing ZIP asset');
      if(typeof value.mime!=='string'||!/^[-\w.+]+\/[-\w.+]+$/.test(value.mime))throw new Error('Invalid asset MIME type');
      return dataURL(files[value.$asset],value.mime);
    });validate(project);return project;
  }
  return {encode,decode};
})();
if(typeof module!=='undefined')module.exports=R390Zip;
