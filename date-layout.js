/* Date sources and composite layouts match Samsung catalogue records. */
const R390Date = (() => {
  const names={
    ru:{week:['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'],weekLong:['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'],month:['ЯНВ','ФЕВ','МАР','АПР','МАЙ','ИЮН','ИЮЛ','АВГ','СЕН','ОКТ','НОЯ','ДЕК'],monthLong:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']},
    en:{week:['MON','TUE','WED','THU','FRI','SAT','SUN'],weekLong:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],month:['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],monthLong:['January','February','March','April','May','June','July','August','September','October','November','December']}
  };
  function fields(format){
    return ({weekdayDayMonth:['week','day','month'],dayMonth:['day','month'],dayMonthLong:['day','monthLong'],monthDay:['month','day'],numericDM:['day','monthNumber'],numericMD:['monthNumber','day'],weekday:['weekLong'],day:['day'],legacy:['week','month','day']})[format]||['week','day','month'];
  }
  function preview(layer,value){
    if(!layer.dateFormat||layer.dateFormat==='legacy'){
      if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return value||'11 ноября';
      const [year,month,day]=value.split('-').map(Number);return `${day} ${names.ru.monthLong[month-1]}`;
    }
    const [year,month,day]=calendarValue(value).split('-').map(Number);
    const date=new Date(year,month-1,day);
    const lang=names[layer.dateLanguage]||names.ru,m=date.getMonth(),w=(date.getDay()+6)%7;
    const values={week:lang.week[w],weekLong:lang.weekLong[w],day:String(date.getDate()).padStart(2,'0'),month:lang.month[m],monthLong:lang.monthLong[m],monthNumber:String(m+1).padStart(2,'0')};
    return fields(layer.dateFormat).map(k=>values[k]).join(layer.dateFormat==='numericDM'?'.':layer.dateFormat==='numericMD'?'/':' ');
  }
  function calendarValue(value){
    if(/^\d{4}-\d{2}-\d{2}$/.test(value||''))return value;
    const day=Number((value||'').match(/\d{1,2}/)?.[0])||11;
    const month=names.ru.monthLong.findIndex(m=>(value||'').toLowerCase().includes(m));
    return `${new Date().getFullYear()}-${String((month<0?10:month)+1).padStart(2,'0')}-${String(Math.min(28,day)).padStart(2,'0')}`;
  }
  function parseTable(bytes){
    const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),decoder=new TextDecoder();
    const count=view.getUint32(8,true),groups=[];
    for(let i=0;i<count;i++){const len=view.getUint32(24+i*8,true),off=view.getUint32(28+i*8,true);groups.push(decoder.decode(bytes.subarray(off,off+len)))}
    return {header:bytes.slice(0,24),groups};
  }
  function encodeTable(header,groups){
    const strings=groups.map(s=>new TextEncoder().encode(s));
    const bytes=new Uint8Array(24+groups.length*8+strings.reduce((n,s)=>n+s.length,0)),view=new DataView(bytes.buffer);
    bytes.set(header);view.setUint32(8,groups.length,true);let off=24+groups.length*8;
    strings.forEach((s,i)=>{view.setUint32(24+i*8,s.length,true);view.setUint32(28+i*8,off,true);bytes.set(s,off);off+=s.length});
    return bytes;
  }
  function prepare(shell,layers,decode){
    const additions=[],bases=new Map();
    for(const l of layers){
      if(l.type!=='date'||l.visible===false||(!l.dateFormat||l.dateFormat==='legacy'))continue;
      const lang=names[l.dateLanguage]||names.ru;
      bases.set(l,25+additions.length);
      additions.push(...lang.week,...lang.month,...lang.weekLong,...lang.monthLong,' ','.','/');
    }
    const files={};
    for(const [name,data] of Object.entries(shell))if(/^font_(?!\d+\.bin).+\.bin$/.test(name)){
      const bytes=decode(data),table=parseTable(bytes);
      if(table.groups.length!==25)throw new Error('Unsupported date string table');
      files[name]=encodeTable(table.header,[...table.groups,...additions]);
    }
    return {files,bases};
  }
  function widget(layer,template,base,gidx){
    const bytes=template.slice(),view=new DataView(bytes.buffer);
    const put16=(off,val)=>view.setUint16(off,val,true),put32=(off,val)=>view.setUint32(off,val>>>0,true);
    put32(12,(gidx<<16)|100);put16(24,Math.round(layer.x));put16(26,Math.round(layer.y));put16(28,Math.round(layer.w));put16(30,Math.round(layer.h));put16(32,0);put16(34,layer.fontSize||20);
    if(base!=null){
      const format=layer.dateFormat,parts=fields(format),separator=base+(format==='numericDM'?39:format==='numericMD'?40:38);
      for(let i=0;i<4;i++){
        const off=36+i*12;put32(off,0xffff0000);put32(off+4,0xffffffff);put32(off+8,0);
        if(i>=parts.length)continue;
        const part=parts[i],seq=part.startsWith('week')?17:part==='day'?18:21;
        const group=part==='week'?base:part==='weekLong'?base+19:part==='month'?base+7:part==='monthLong'?base+26:21;
        put32(off,0xffff0000|seq);put32(off+4,(group<<16)|(i?separator:0xffff));put32(off+8,part==='day'||part==='monthNumber'?0x201:0);
      }
    }
    const hex=(layer.color||'#d5d7db').replace('#','');put32(88,0xff000000|parseInt(hex,16));
    return bytes;
  }
  return {fields,preview,prepare,widget,parseTable,calendarValue};
})();
if(typeof module!=='undefined')module.exports=R390Date;
