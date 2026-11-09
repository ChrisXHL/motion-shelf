/* Script Shelf: source observations, editorial judgments and new writing prompts stay distinct. */
(()=>{
'use strict';
const SCRIPT_LIBRARY='scripts';
const I=window.MotionI18n;
I?.registerMessages({
 '产品宣传':'Product promos','产品评测':'Product reviews','REVIEW SHELF':'REVIEW SHELF','测试方法 · 证据与结论':'Test methods · Evidence & verdicts','用真实测试支撑判断。':'Build conclusions on real tests.','先看怎么测，再写怎么说。':'Study the test. Then write the review.','数码体验':'Tech experience','AI 产品实测':'AI product tests','消费品盲测':'Consumer blind tests','长期使用':'Long-term use','同类对比':'Comparisons',
 '实验验证':'Experiments','科技体验':'Technology experiences',
 '脚本 Prompt':'Script prompt','标题和简介 Prompt':'Title & description prompt','复制脚本 Prompt':'Copy script prompt','复制标题和简介 Prompt':'Copy title & description prompt',
 '复制 Prompt':'Copy prompt','复制后，在你自己的生成区填写主题或贴上脚本。':'Fill in your topic or paste your script in your own generation workspace.','可复制的 Prompt':'Prompt to copy','参考拆解':'Reference analysis','脚本参考':'Script reference','拍摄与剪辑参考':'Production notes','保存完整资料':'Save complete notes','阅读内容':'Reading view','脚本灵感库':'Script Library','全部脚本':'All scripts','视频语言':'Video language','中文视频':'Chinese videos','全部语言':'All languages','画面与转写':'Visuals & transcription','按视频类型':'Browse by format','脚本分类':'Script categories',
 '找到参考，一键复制 Prompt。':'Find a reference. Copy its prompt.',
 '中文拆解 · 原片参考':'Chinese analyses · Original videos','搜索脚本':'Search scripts',
 '搜索主题、开头、作者或脚本内容…':'Search topics, hooks, creators or script content…','按视频类型筛选':'Filter by format',
 '精选顺序':'Curated order','短片优先':'Shortest first','长片优先':'Longest first',
 '正在载入脚本…':'Loading scripts…','脚本暂时无法载入。':'Scripts could not be loaded.',
 '没有找到脚本':'No scripts found','脚本参考':'Script references','研究写法，保留自己的经历。':'Study the craft. Tell your own story.',
 '脚本拆解':'Script analysis','关闭拆解':'Close analysis','关闭 ×':'Close ×',
 '点击时间段可从该处播放。无法预览时可打开原视频。':'Select a time range to play that section. If playback fails, open the original video.',
 '查看核对依据':'Review evidence','复制拆解':'Copy analysis','保存 Markdown':'Save Markdown','下载 Markdown':'Save to Downloads',
 '复制改写框架':'Copy writing framework','手动复制':'Copy manually','待复制内容':'Content to copy',
 '请选择下方内容，按 ⌘C / Ctrl+C。':'Select the text below and press ⌘C / Ctrl+C.',
 '全选内容':'Select all','已复制，记入最近':'Copied — save to recent',
 '口播讲解':'Spoken explainers','品牌宣传':'Brand films','知识讲解':'Explainers','人物自述':'Personal stories','生活记录':'Everyday life',
 '情境喜剧':'Situational comedy','视觉反转':'Visual reveals','查看拆解':'Read analysis',
 '收藏':'Save','已收藏':'Saved','取消收藏':'Remove favorite','全部':'All',
 '分段画面':'Sampled visuals','画面与字幕':'Visuals & captions'
});
const $=s=>document.querySelector(s), E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const en=()=>I?.language==='en', t=s=>I?.t(s)||s, L=(zh,eng)=>en()?eng:zh;
const time=n=>`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`;
let data=null, personal={favorites:[],recent:[]}, category='', scope='all', query='', sort='editorial', sourceLanguage='all', active=null, pendingCopy=null, noticeTimer, activeDetailView='analysis', returnControl=null;
const saving=new Set();
let promptCopyBusy=false,pendingCopyMessage=null;
function card(v){
 const saved=personal.favorites.includes(v.id);
 const copyIcon='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>';
 return `<article class="card script-card"><div class="script-cover-wrap"><button type="button" class="script-cover" data-open="${E(v.id)}" aria-label="${E(t('查看拆解')+'：'+v.title)}"><img src="${E(v.thumbnail)}" alt="" loading="lazy" referrerpolicy="no-referrer"><span class="script-category">${E(t(v.category))}</span><span class="duration">${time(v.duration)}</span></button><button type="button" class="script-save" data-favorite="${E(v.id)}" aria-pressed="${saved}" aria-label="${E((saved?t('取消收藏'):t('收藏'))+'：'+v.title)}" title="${E(saved?t('取消收藏'):t('收藏'))}" aria-busy="${saving.has(v.id)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="${saved?'currentColor':'none'}" stroke="currentColor" stroke-width="1.6"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></button></div><div class="card-content"><button type="button" class="card-title" data-open="${E(v.id)}" data-i18n-ignore lang="zh-CN">${E(v.title)}</button><div class="card-meta"><span class="script-creator" title="${E(v.creator)}">${E(v.creator)}</span><span class="script-segments">${v.segments.length} ${L('段','sections')}</span><button type="button" class="script-read" data-open="${E(v.id)}">${E(t('查看拆解'))}<span aria-hidden="true"> ↗</span></button></div><p class="card-summary" data-i18n-ignore lang="zh-CN">${E(v.promptProfile?.tags.join(' · ')||v.summary)}</p><div class="card-actions"><button type="button" class="button primary" data-copy-prompt="${E(v.id)}" aria-label="${E(t('复制脚本 Prompt'))}" title="${E(t('复制脚本 Prompt'))}" ${v.remake?'':'disabled'}>${copyIcon}<span>${E(t('脚本 Prompt'))}</span></button><button type="button" class="button secondary copy-packaging" data-copy-packaging="${E(v.id)}" aria-label="${E(t('复制标题和简介 Prompt'))}" title="${E(t('复制标题和简介 Prompt'))}">${copyIcon}<span>${E(t('标题和简介 Prompt'))}</span></button></div></div></article>`;
}
function remakeHtml(v){
 const p=v.remake;if(!p)return '<p>复刻方案暂未整理。</p>';
 return `<p class="remake-goal">${E(p.goal)}</p><p class="script-caution">${E(p.boundary)}</p><section class="remake-start"><h3>先准备这些</h3><ul>${p.assets.map(item=>`<li>${E(item)}</li>`).join('')}</ul><h4>更容易开始的做法</h4><p>${E(p.lowCost)}</p></section><section class="remake-transfer"><div><h3>可以保留的结构</h3><p>${E(p.keep)}</p></div><div><h3>需要替换的内容</h3><p>${E(p.replace)}</p></div></section><h3>按这个顺序拍</h3><div class="remake-steps">${p.steps.map((step,index)=>`<section class="remake-step"><div class="remake-step-heading"><h4><span>${index+1}</span>${E(step.name)}</h4><button type="button" class="remake-reference" data-time="${step.referenceStart}" aria-pressed="false">对照原片 ${time(step.referenceStart)} ▷</button></div><dl><div><dt>台词起句 / 动作脚本</dt><dd>${E(step.line)}</dd></div><div><dt>要拍什么</dt><dd>${E(step.shot)}</dd></div><div><dt>怎么剪</dt><dd>${E(step.edit)}</dd></div></dl></section>`).join('')}</div><section class="remake-check"><h3>成片前检查</h3><ul>${p.checks.map(item=>`<li>${E(item)}</li>`).join('')}</ul></section>`;
}
function setDetailView(mode,scroll=true){
 activeDetailView=['prompt','packaging'].includes(mode)&&active?.remake?mode:'analysis';
 for(const view of ['prompt','packaging','analysis']){const selected=view===activeDetailView,tab=document.getElementById(view+'-tab');tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;document.getElementById(view+'-panel').hidden=!selected;}
 const writing=activeDetailView!=='analysis';
 $('#script-detail').classList.toggle('prompt-mode',writing);
 $('#copy-template').textContent=t('复制脚本 Prompt');
 $('#copy-template').hidden=activeDetailView!=='prompt';$('#copy-packaging').hidden=activeDetailView!=='packaging';
 $('#copy-analysis').hidden=writing;$('#download-analysis').hidden=writing;
 $('#production-guide').hidden=writing;
 if(mode==='remake')$('#production-guide').open=true;
 $('#detail-status').textContent='';
 if(scroll)$('#script-detail').scrollTop=0;
 writeLocation();I?.refresh();
 if(writing)loadPromptPreview();
}

function remakeMarkdown(v){
 const p=v.remake;
 return `# ${v.title} · 复刻方案\n\n参考：${v.creator}\n${v.url}\n\n${p.boundary}\n\n${p.goal}\n\n## 先准备这些\n\n${p.assets.map(x=>'- '+x).join('\n')}\n\n## 可以保留的结构\n\n${p.keep}\n\n## 需要替换的内容\n\n${p.replace}\n\n## 更容易开始的做法\n\n${p.lowCost}\n\n## 拍摄与剪辑步骤\n\n${p.steps.map((s,i)=>`### ${i+1}. ${s.name}\n\n台词起句 / 动作脚本：${s.line}\n\n要拍什么：${s.shot}\n\n怎么剪：${s.edit}\n\n对照原片：${v.url}&t=${s.referenceStart}s`).join('\n\n')}\n\n## 成片前检查\n\n${p.checks.map(x=>'- '+x).join('\n')}`;
}
function loadPromptPreview(){
 if(!active)return;
 try{$('#agent-prompt-preview').value=window.ScriptPrompt.compose(active);$('#packaging-prompt-preview').value=window.ScriptPrompt.composePackaging(active);}
 catch{$('#agent-prompt-preview').value=L('Prompt 暂时无法读取，请重试。','The prompt could not be loaded. Please retry.');}
}
async function copyPrompt(id=active?.id,kind='script'){
 const video=data?.videos.find(v=>v.id===id);if(!video||promptCopyBusy)return;
 const button=$(kind==='packaging'?'#copy-packaging':'#copy-template');
 promptCopyBusy=true;button.setAttribute('aria-busy','true');
 const message=kind==='packaging'?L('标题和简介 Prompt 已复制。','Title & description prompt copied.'):L('脚本 Prompt 已复制。','Script prompt copied.');
 try{
  const prompt=kind==='packaging'?window.ScriptPrompt.composePackaging(video):window.ScriptPrompt.compose(video);
  try{await navigator.clipboard.writeText(prompt);await recordCopy(video.id,message);}
  catch{pendingCopy=video.id;pendingCopyMessage=message;$('#manual-text').value=prompt;$('#manual-copy').showModal();$('#manual-text').focus();$('#manual-text').select();}
 }catch{toast(L('Prompt 未复制，请重试。','The prompt was not copied. Please retry.'));}
 finally{promptCopyBusy=false;button.setAttribute('aria-busy','false');}
}

function toast(message){if($('#script-detail').open)$('#detail-status').textContent=message;clearTimeout(noticeTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');noticeTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3600);}
async function request(path,payload){return publicLibrary.api(path,payload);}
function readLocation(){const p=new URL(location.href).searchParams;query=p.get('q')||'';category=p.get('category')||'';scope=['all','favorites','recent'].includes(p.get('view'))?p.get('view'):'all';sort=['editorial','short','long'].includes(p.get('sort'))?p.get('sort'):'editorial';$('#search').value=query;$('#sort').value=sort;sourceLanguage=p.get('lang')==='zh'?'zh':'all';$('#source-language').value=sourceLanguage;}
function writeLocation(){const url=new URL(location.href);for(const [key,value] of Object.entries({q:query,category,view:scope==='all'?'':scope,sort:sort==='editorial'?'':sort,lang:sourceLanguage==='all'?'':'zh',script:active?.id||'',tab:active&&activeDetailView!=='analysis'?activeDetailView:''})){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}history.replaceState(null,'',url);}
function counts(){
 const valid=new Set(data.videos.filter(v=>sourceLanguage==='all'||v.sourceLanguage==='zh').map(v=>v.id));
 $('#all-count').textContent=valid.size;$('#favorites-count').textContent=personal.favorites.filter(id=>valid.has(id)).length;$('#recent-count').textContent=personal.recent.filter(r=>valid.has(r.id)).length;
 document.querySelectorAll('[data-scope]').forEach(b=>{b.classList.toggle('active',b.dataset.scope===scope);b.setAttribute('aria-pressed',String(b.dataset.scope===scope));});
}
function categoryButtons(){
 const available=data.videos.filter(v=>sourceLanguage==='all'||v.sourceLanguage==='zh');
 const rows=[['',t('全部')],...data.categories.filter(c=>available.some(v=>v.category===c)).map(c=>[c,t(c)])];
 $('#script-filters').innerHTML=rows.map(([key,label])=>`<button type="button" class="subcategory-button ${category===key?'active':''}" data-category="${E(key)}" aria-pressed="${category===key}">${E(label)} <b>${key?available.filter(v=>v.category===key).length:available.length}</b></button>`).join('');
 $('#categories').innerHTML=rows.slice(1).map(([key,label])=>`<button type="button" class="nav-item ${category===key?'active':''}" data-category="${E(key)}" aria-pressed="${category===key}"><span>${E(label)}</span><b>${available.filter(v=>v.category===key).length}</b></button>`).join('');
}
function render(){
 if(!data)return;
 const focused=document.activeElement, navFocus=focused?.hasAttribute('data-category')?{key:focused.dataset.category,parent:focused.parentElement.id}:null, control=focused?.closest('#gallery button'), focusKey=control&&['favorite','copyPrompt','copyPackaging','open'].find(key=>control.dataset[key]!==undefined), focusId=control?.dataset[focusKey], focusClass=control?.className;
 counts();categoryButtons();
 const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean), recents=new Map(personal.recent.map((r,i)=>[r.id,i]));
 const rows=data.videos.filter(v=>(sourceLanguage==='all'||v.sourceLanguage==='zh')&&(!category||v.category===category)&&(scope!=='favorites'||personal.favorites.includes(v.id))&&(scope!=='recent'||recents.has(v.id))&&words.every(w=>(JSON.stringify({title:v.title,sourceTitle:v.sourceTitle,creator:v.creator,category:v.category,reviewType:v.reviewType,summary:v.summary,analysis:v.analysis,segments:v.segments,template:v.template,selection:v.selection,remake:v.remake})+' '+t(v.category)).toLocaleLowerCase().includes(w)));
 if(sort!=='editorial')rows.sort((a,b)=>sort==='short'?a.duration-b.duration:b.duration-a.duration);else if(scope==='recent')rows.sort((a,b)=>recents.get(a.id)-recents.get(b.id));
 $('#gallery').innerHTML=rows.map(card).join('');
 $('#empty-state').classList.toggle('hidden',rows.length>0);$('#results-count').textContent=L(`${rows.length} 条脚本 / ${data.videos.length}`,`${rows.length} scripts / ${data.videos.length}`);
 $('#footer-count').textContent=L(`${data.videos.length} 条参考 · ${data.videos.reduce((n,v)=>n+v.segments.length,0)} 个脚本段落`,`${data.videos.length} references · ${data.videos.reduce((n,v)=>n+v.segments.length,0)} script sections`);
 I?.refresh();
 if(focusId){const replacement=[...$('#gallery').querySelectorAll('button')].find(b=>b.dataset[focusKey]===focusId&&b.className===focusClass);replacement?.focus({preventScroll:true});}
 else if(navFocus){[...document.getElementById(navFocus.parent).querySelectorAll('[data-category]')].find(b=>b.dataset.category===navFocus.key)?.focus({preventScroll:true});}
}
function syncFavorite(){if(!active)return;const saved=personal.favorites.includes(active.id);$('#detail-favorite').textContent=saved?t('已收藏'):t('收藏');$('#detail-favorite').setAttribute('aria-pressed',String(saved));$('#detail-favorite').setAttribute('aria-busy',String(saving.has(active.id)));}
async function favorite(id){
 if(saving.has(id))return;saving.add(id);render();syncFavorite();
 try{personal=await request('/api/'+SCRIPT_LIBRARY+'/favorite',{id,saved:!personal.favorites.includes(id)});}
 catch{toast(L('收藏未保存，请重试。','Favorite could not be saved. Please retry.'));}
 finally{saving.delete(id);render();syncFavorite();}
}
function play(start=0,autoplay=false){
 if(!active)return;
 const frame=document.createElement('iframe');
 if(active.bilibiliId&&(/^BV[A-Za-z0-9]{10}$/).test(active.bilibiliId))frame.src=`https://player.bilibili.com/player.html?bvid=${active.bilibiliId}&page=1&danmaku=0&t=${Math.floor(start)}&autoplay=${autoplay?1:0}`;
 else if((/^[A-Za-z0-9_-]{11}$/).test(active.youtubeId))frame.src=`https://www.youtube-nocookie.com/embed/${active.youtubeId}?start=${Math.floor(start)}&autoplay=${autoplay?1:0}&rel=0`;
 else return;
 frame.title=`${active.sourceTitle} — ${time(start)}`;frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';$('#script-player').replaceChildren(frame);
 $('#original-link').href=active.url+'&t='+Math.floor(start)+'s';
 $('#detail-content').querySelectorAll('[data-time]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.time)===start)));
}
function open(id,mode='analysis'){
 id=data.reviewAliases?.[id]||id;
 const v=data?.videos.find(v=>v.id===id);if(!v){toast(L('这条脚本不存在。','This script was not found.'));return;}if(!$('#script-detail').open){const button=document.activeElement?.closest('#gallery button');returnControl=button?{id:button.dataset.open||button.dataset.favorite,className:button.className}:null;}active=v;$('#detail-status').textContent='';
 $('#detail-heading').innerHTML=`<p class="script-source-title">${E(v.category)} · ${time(v.duration)}</p><h2 id="detail-title">${E(v.title)}</h2><p class="script-source-title">${E(v.sourceTitle)}<br>${E(v.creator)}</p>`;
 $('#analysis-panel').innerHTML=`<p>${E(v.summary)}</p><h3>结构判断</h3><div class="script-structure">${[['hook','开头怎么留人'],['progression','中段怎么推进'],['payoff','结尾怎样收束']].map(([key,label])=>`<div><strong>${label}</strong><p>${E(v.analysis[key])}</p></div>`).join('')}</div><h3>分段脚本</h3><p class="script-caution">内容为中文概述；作用是结构判断。${E(v.evidence.timing)}</p>${v.segments.map(s=>`<section class="script-segment"><button type="button" class="segment-time" data-time="${s.start}" aria-pressed="${s.start===0}" aria-label="从 ${time(s.start)} 播放">${time(s.start)}–${time(s.end)} ▷</button><div><h4>${E(s.beat)}</h4><p><strong>${s.visual.startsWith('制作建议')?'画面建议':'画面'}</strong>${E(s.visual)}</p><p><strong>叙述 / 声音</strong>${E(s.voice)}</p><p class="segment-purpose"><strong>作用 · 判断</strong>${E(s.purpose)}</p><span class="segment-evidence">依据：${E(s.evidence)}</span></div></section>`).join('')}<h3>改写框架</h3><p class="script-caution">按这条视频的结构整理的新写作提示，不是原作者台词。</p><div class="script-template">${v.template.map((p,i)=>`<p><b>${i+1}. ${E(p.label)}</b>${E(p.prompt)}</p>`).join('')}</div><h3>为什么收这条</h3><p>${E(v.selection)}</p><p class="script-caution">${E(v.caution)}</p>`;
 $('#remake-panel').innerHTML=remakeHtml(v);
 $('#production-guide').open=false;
 setDetailView(mode,false);
 $('#evidence-content').innerHTML=`<p>${E(v.evidence.scope)}</p><p>${E(v.evidence.timing)}<br>画面抽样：${v.evidence.visualSamples} 张，按全片时间分布提取。<br>完整连续播放与音轨未逐条审核。</p><p>原片身份与链接：${E(v.evidence.checkedAt)} 核对。<br>${v.sourceLanguage==='zh'?'原片为中文口播或讲解。':'原片为英文或视觉叙事，拆解为中文。'}</p><a href="${E(v.url)}" target="_blank" rel="noopener noreferrer">${E(v.creator)} · 原视频 ↗</a>`;
 $('#evidence-details').open=false;syncFavorite();play();
 const dialog=$('#script-detail');if(!dialog.open)dialog.showModal();dialog.scrollTop=0;document.body.classList.add('script-is-open');writeLocation();I?.refresh();
}
function close(){const d=$('#script-detail');if(d.open)d.close();}
$('#script-detail').addEventListener('close',()=>{$('#script-player').replaceChildren();active=null;document.body.classList.remove('script-is-open');writeLocation();if(returnControl){[...$('#gallery').querySelectorAll('button')].find(b=>(b.dataset.open||b.dataset.favorite)===returnControl.id&&b.className===returnControl.className)?.focus({preventScroll:true});}returnControl=null;});
function framework(v){return `# ${v.title} · 改写框架\n\n参考：${v.creator}\n${v.url}\n\n以下是结构迁移用的原创写作提示，不是原片逐字稿。\n\n${v.template.map((p,i)=>`## ${i+1}. ${p.label}\n${p.prompt}`).join('\n\n')}\n\n使用提醒：${v.caution}\n`;}
function markdown(v){return `# ${v.title}\n\n原片：${v.sourceTitle}\n作者：${v.creator}\n来源：${v.url}\n类型：${v.category} · 时长 ${time(v.duration)}\n\n${v.summary}\n\n## 结构判断\n\n${[['hook','开头'],['progression','推进'],['payoff','收束']].map(([k,label])=>`### ${label}\n${v.analysis[k]}`).join('\n\n')}\n\n## 分段脚本 · 中文概述\n\n时间为段落近似值；作用为编辑判断。\n\n${v.segments.map(s=>`### ${time(s.start)}–${time(s.end)} ${s.beat}\n\n画面：${s.visual}\n\n叙述 / 声音：${s.voice}\n\n作用（判断）：${s.purpose}\n\n依据：${s.evidence}\n\n对照原片：${v.url}&t=${s.start}s`).join('\n\n')}\n\n## 收录理由\n\n${v.selection}\n\n## 核对范围\n\n${v.evidence.scope}\n${v.evidence.timing}\n完整连续播放与音轨未逐条审核。身份与链接核对日期：${v.evidence.checkedAt}。\n\n${framework(v)}`;}
async function recordCopy(id,message){try{personal=await request('/api/'+SCRIPT_LIBRARY+'/copied',{ids:[id]});render();toast(message||L('已复制。','Copied.'));}catch{toast(L('已复制，最近记录保存失败。','Copied, but the recent record could not be saved.'));}}
async function copy(kind){if(!active)return;const v=active,content=kind==='remake'?remakeMarkdown(v):kind==='template'?framework(v):markdown(v);try{await navigator.clipboard.writeText(content);await recordCopy(v.id);}catch{pendingCopy=v.id;$('#manual-text').value=content;$('#manual-copy').showModal();$('#manual-text').focus();$('#manual-text').select();}}
async function download(){if(!active)return;const blob=new Blob([markdown(active)+(active.remake?'\n\n'+remakeMarkdown(active):'')],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=active.id+'.md';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(L('文件已准备下载。','Your download is ready.'));}
async function load(){
 $('#load-error').classList.add('hidden');
 try{const [catalog,saved]=await Promise.all([request('/api/'+SCRIPT_LIBRARY),request('/api/'+SCRIPT_LIBRARY+'/state')]);data=catalog;personal=saved;if(category&&!data.categories.includes(category))category='';render();const id=new URL(location.href).searchParams.get('script');if(id)open(id,new URL(location.href).searchParams.get('tab')||'analysis');}
 catch{$('#load-error').classList.remove('hidden');$('#results-count').textContent=L('载入失败','Loading failed');}
}
document.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.dataset.copyPrompt)return copyPrompt(b.dataset.copyPrompt);
 if(b.dataset.copyPackaging)return copyPrompt(b.dataset.copyPackaging,'packaging');
 if(b.dataset.open)return open(b.dataset.open,b.dataset.mode||'analysis');
 if(b.dataset.detailView)return setDetailView(b.dataset.detailView);
 if(b.dataset.favorite)return favorite(b.dataset.favorite);
 if(b.hasAttribute('data-category')){category=b.dataset.category;writeLocation();return render();}
 if(b.dataset.scope){scope=b.dataset.scope;writeLocation();return render();}
 if(b.hasAttribute('data-time'))play(Number(b.dataset.time),true);
});
$('.script-detail-tabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const views=['prompt','packaging','analysis'],next=event.key==='Home'?views[0]:event.key==='End'?views[2]:views[(views.indexOf(activeDetailView)+(event.key==='ArrowRight'?1:2))%3];setDetailView(next);document.getElementById(next+'-tab').focus();});
$('#close-detail').addEventListener('click',close);
$('#search').addEventListener('input',e=>{query=e.target.value;writeLocation();render();});
$('#source-language').addEventListener('change',e=>{sourceLanguage=e.target.value;if(category&&!data.videos.some(v=>v.category===category&&(sourceLanguage==='all'||v.sourceLanguage==='zh')))category='';writeLocation();render();});
$('#sort').addEventListener('change',e=>{sort=e.target.value;writeLocation();render();});
$('#reset').addEventListener('click',()=>{query='';category='';scope='all';sort='editorial';$('#search').value='';$('#sort').value=sort;writeLocation();render();});
$('#retry').addEventListener('click',load);
$('#detail-favorite').addEventListener('click',()=>active&&favorite(active.id));
$('#copy-analysis').addEventListener('click',()=>copy('analysis'));
$('#copy-template').addEventListener('click',()=>copyPrompt());
$('#copy-packaging').addEventListener('click',()=>copyPrompt(active?.id,'packaging'));
$('#download-analysis').addEventListener('click',download);
$('#close-copy').addEventListener('click',()=>$('#manual-copy').close());
$('#manual-copy').addEventListener('close',()=>{pendingCopy=null;pendingCopyMessage=null;});
$('#select-copy').addEventListener('click',()=>{$('#manual-text').focus();$('#manual-text').select();});
$('#confirm-copy').addEventListener('click',async()=>{const id=pendingCopy,message=pendingCopyMessage;$('#manual-copy').close();if(id)await recordCopy(id,message);});
window.addEventListener('motion-language-change',()=>{render();syncFavorite();if(active)setDetailView(activeDetailView,false);});
window.addEventListener('popstate',()=>{readLocation();render();const id=new URL(location.href).searchParams.get('script');if(id&&data)open(id,new URL(location.href).searchParams.get('tab')||'analysis');else close();});
readLocation();I?.refresh();load();
window.addEventListener('storage',async e=>{if(e.key===publicLibrary.keyFor(SCRIPT_LIBRARY)&&data){try{personal=await request('/api/'+SCRIPT_LIBRARY+'/state');render();syncFavorite();}catch{}}});
})();
