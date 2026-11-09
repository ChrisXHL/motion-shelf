(() => {
  const old = new URLSearchParams(location.search);
  const target = new URL(document.getElementById('review-destination').href);
  for (const key of ['view','sort','lang','script','tab']) {
    if (old.has(key)) target.searchParams.set(key, old.get(key));
  }
  const type = old.get('category');
  const query = [old.get('q'), ['数码体验','同类对比','AI 产品实测','消费品盲测'].includes(type) ? type : ''].filter(Boolean).join(' ');
  if (query) target.searchParams.set('q', query);
  location.replace(target.href);
})();
