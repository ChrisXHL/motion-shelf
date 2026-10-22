'use strict';
// Public website state belongs only to this browser and this website origin.
const publicLibrary = (() => {
  const storageKey = 'motion-shelf-public-state-v1';
  let catalogPromise;
  async function catalog() {
    if (!catalogPromise) catalogPromise = fetch('./videos.json', {cache:'no-cache'}).then(r => {
      if (!r.ok) throw new Error('作品清单暂时无法载入');
      return r.json();
    }).catch(error => {catalogPromise=null; throw error;});
    return catalogPromise;
  }
  function read(known) {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {favorites:[], recent:[]};
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.favorites) || !Array.isArray(data.recent)) throw new Error('浏览器记录格式无效');
    return {
      favorites:[...new Set(data.favorites.filter(id=>typeof id==='string'&&known.has(id)))],
      recent:data.recent.filter(r=>r&&known.has(r.id)&&typeof r.copiedAt==='string'&&Number.isInteger(r.count)&&r.count>0)
    };
  }
  async function api(path,body) {
    const videos = await catalog();
    if (path==='/api/videos') return {videos};
    const known = new Set(videos.map(v=>v.id));
    const state = read(known);
    if (path==='/api/state') return state;
    if (path==='/api/favorite') {
      if (!body || !known.has(body.id) || typeof body.saved!=='boolean') throw new Error('收藏请求无效');
      state.favorites=state.favorites.filter(id=>id!==body.id);
      if(body.saved) state.favorites.unshift(body.id);
    } else if(path==='/api/copied') {
      if (!body || !Array.isArray(body.ids) || body.ids.length<1 || body.ids.length>100 || body.ids.some(id=>!known.has(id))) throw new Error('复制记录无效');
      const now=new Date().toISOString(), ids=[...new Set(body.ids)];
      const previous=new Map(state.recent.map(r=>[r.id,r]));
      state.recent=ids.map(id=>({id,copiedAt:now,count:(previous.get(id)?.count||0)+1})).concat(state.recent.filter(r=>!ids.includes(r.id)));
    } else throw new Error('未知操作');
    localStorage.setItem(storageKey,JSON.stringify(state));
    return state;
  }
  return {api,storageKey};
})();
