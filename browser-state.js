'use strict';
// Browser-only visitor records. api() never sends personal data to a server.
const publicLibrary = (() => {
  const storageKey='motion-shelf-public-state-v1';
  const names={motion:'videos.json',editing:'editing.json',scripts:'scripts.json',music:'music.json',websites:'websites.json'};
  /* catalog-versions */
  const revisions={"videos.json": "c1361eb38ed990d7", "motion-meta.json": "8bbb5d6f52042098", "editing.json": "12263b7b346a6b42", "scripts.json": "3dca7c2b056c101e", "music.json": "369f672edce6d0d4", "websites.json": "2bd280216e5ded16"};
  const pending=new Map();
  const keyFor=kind=>kind==='motion'?storageKey:'motion-shelf-public-'+kind+'-state-v1';
  async function file(name){
    if(!pending.has(name))pending.set(name,fetch('./'+name+(revisions[name]?'?v='+revisions[name]:''),{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('作品清单暂时无法载入');return r.json();}).catch(e=>{pending.delete(name);throw e;}));
    return pending.get(name);
  }
  async function catalog(kind){
    const data=await file(names[kind]);
    if(kind==='motion'){
      const meta=await file('motion-meta.json');
      return {videos:data.map(row=>({...row,referenceBrief:meta.referenceBriefs[row.id]})),taxonomy:meta.taxonomy};
    }
    return data;
  }
  function read(key,known){
    const raw=localStorage.getItem(key);
    if(!raw)return {favorites:[],recent:[]};
    const data=JSON.parse(raw);
    if(!data||!Array.isArray(data.favorites)||!Array.isArray(data.recent))throw Error('浏览器记录格式无效');
    return {favorites:[...new Set(data.favorites.filter(id=>typeof id==='string'&&known.has(id)))],recent:data.recent.filter(r=>r&&known.has(r.id)&&typeof r.copiedAt==='string'&&Number.isInteger(r.count)&&r.count>0)};
  }
  const present=(kind,state)=>kind==='websites'?{favorites:state.favorites,recent:state.recent.map(r=>r.id)}:state;
  async function api(path,body){
    const routes={'/api/videos':['motion','catalog'],'/api/state':['motion','state'],'/api/favorite':['motion','favorite'],'/api/copied':['motion','copied']};
    for(const kind of ['editing','scripts','music','websites']){
      routes['/api/'+kind]=[kind,'catalog'];
      for(const op of ['state','favorite','copied'])routes['/api/'+kind+'/'+op]=[kind,op];
    }
    const route=routes[path];if(!route)throw Error('公开网站不支持这项操作');
    const [kind,operation]=route,data=await catalog(kind);
    if(operation==='catalog')return data;
    const rows=data.videos||data.tracks||data.cases,known=new Set(rows.map(r=>r.id)),key=keyFor(kind),state=read(key,known);
    if(operation==='state')return present(kind,state);
    if(operation==='favorite'){
      if(!body||!known.has(body.id)||typeof body.saved!=='boolean')throw Error('收藏请求无效');
      state.favorites=state.favorites.filter(id=>id!==body.id);if(body.saved)state.favorites.unshift(body.id);
    }else if(operation==='copied'){
      if(!body||!Array.isArray(body.ids)||!body.ids.length||body.ids.length>100||body.ids.some(id=>!known.has(id)))throw Error('复制记录无效');
      const now=new Date().toISOString(),ids=[...new Set(body.ids)],previous=new Map(state.recent.map(r=>[r.id,r]));
      state.recent=ids.map(id=>({id,copiedAt:now,count:(previous.get(id)?.count||0)+1})).concat(state.recent.filter(r=>!ids.includes(r.id)));
    }
    localStorage.setItem(key,JSON.stringify(state));return present(kind,state);
  }
  return {api,storageKey,keyFor,storageKeys:Object.keys(names).map(keyFor)};
})();
