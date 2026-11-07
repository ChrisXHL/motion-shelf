/* Shared presentation-only localization. IDs, filter values, source data and user input stay unchanged. */
(()=>{
'use strict';
const messages=window.MotionShelfMessages||{};
const storageKey='motion-shelf-language';
let language='en';
try{const saved=localStorage.getItem(storageKey);if(saved==='en'||saved==='zh')language=saved;}catch{}
const sources=new WeakMap();
const attributes=['aria-label','title','placeholder','alt','content'];
const ignored='script,style,pre,code,[data-i18n-ignore]';
const chineseMessages=window.MotionShelfChineseMessages||{};
const pattern=(re,format)=>[re,format];
const patterns=[
 pattern(/^已显示 (\d+) \/ (\d+) 首音乐$/,m=>`Loaded ${m[1]} of ${m[2]} tracks`),
 pattern(/^已显示 (\d+) \/ (\d+) 个案例$/,m=>`Loaded ${m[1]} of ${m[2]} examples`),
 pattern(/^(.+)：库里已有$/,m=>`${translate(m[1])}: already in the library`),
 pattern(/^(#{1,3} )(.+)$/,m=>m[1]+translate(m[2])),
 pattern(/^共 (\d+)( 个视频，.*)$/,m=>(messages['共 1700'+m[2]]||m[0]).replace(/^1,700/,m[1])),
 pattern(/^(\d+)( 首配乐参考，.*)$/,m=>(messages['1000'+m[2]]||m[0]).replace(/^1,000/,m[1])),
 pattern(/^(\d+) 个动效与动画视频参考，按类型和细分类筛选，一键复制链接。$/,m=>`${m[1]} motion and animation video references. Filter by category and copy links.`),
 pattern(/^(\d+) 个视频 · 按类型浏览$/,m=>`${m[1]} videos · Browse by type`),
 pattern(/^(\d+) 个视频直达链接$/,m=>`${m[1]} direct video links`),
 pattern(/^(\d+) 个动效与动画参考，找到喜欢的，复制就好。$/,m=>`${m[1]} motion and animation references. Copy what inspires you.`),
 pattern(/^全部作品中的 (\d+) 个(.+)参考，找到喜欢的，复制就好。$/,m=>`${m[1]} ${translate(m[2])} references. Copy what inspires you.`),
 pattern(/^(\d*)\s*个作品$/,m=>`${m[1]} videos`.trimStart()),
 pattern(/^(\d+) 个案例$/,m=>`${m[1]} examples`),
 pattern(/^(\d+) 个案例直达链接$/,m=>`${m[1]} direct example links`),
 pattern(/^(\d+) 个案例 · (\d+) 个来源$/,m=>`${m[1]} examples · ${m[2]} sources`),
 pattern(/^第 (\d+) 页$/,m=>`Page ${m[1]}`),
 pattern(/^共 (\d+) 页$/,m=>`${m[1]} pages`),
 pattern(/^(\d+) 首 · (\d+) 位音乐人$/,m=>`${m[1]} tracks · ${m[2]} artists`),
 pattern(/^(\d+) 首配乐 · 按用途选曲$/,m=>`${m[1]} tracks · Browse by use`),
 pattern(/^(\d+) 首音乐$/,m=>`${m[1]} tracks`),
 pattern(/^显示 (\d+)–(\d+) 首$/,m=>`Showing ${m[1]}–${m[2]}`),
 pattern(/^复制当前筛选的 (\d+) 条视频链接$/,m=>`Copy all ${m[1]} filtered video links`),
 pattern(/^已复制 (\d+) 条(标题和链接|视频链接)$/,m=>`Copied ${m[1]} ${m[2]==='标题和链接'?'titles and links':'video links'}`),
 pattern(/^(\d+) 个案例链接已复制$/,m=>`Copied ${m[1]} example links`),
 pattern(/^预览 (.+)$/,m=>`Preview ${translate(m[1])}`),
 pattern(/^选择 (.+)$/,m=>`Select ${translate(m[1])}`),
 pattern(/^播放 (.+)$/,m=>`Play ${translate(m[1])}`),
 pattern(/^复制 (.+) 的链接$/,m=>`Copy link to ${translate(m[1])}`),
 pattern(/^(收藏|取消收藏|试听|暂停) (.+)$/,m=>`${translate(m[1])} ${translate(m[2])}`),
 pattern(/^(.+) 的视频封面$/,m=>`Video cover for ${translate(m[1])}`),
 pattern(/^(.+) (视频播放器|页面预览|动效预览|动效封面)$/,m=>`${translate(m[1])} — ${{视频播放器:'video player',页面预览:'page preview',动效预览:'motion preview',动效封面:'animated cover'}[m[2]]}`),
 pattern(/^原站分类：(.+)$/,m=>`Source category: ${m[1]}`),
 pattern(/^移除 (.+)$/,m=>`Remove ${m[1]}`),
 pattern(/^([\d,]+) 字$/,m=>`${m[1]} characters`),
 pattern(/^([\d,]+) \/ 150,000 字$/,m=>`${m[1]} / 150,000 characters`),
 pattern(/^(.+) 不是支持的文本文件$/,m=>`${m[1]} is not a supported text file`),
 pattern(/^(.+) 太大，请拆成较小的文本文件$/,m=>`${m[1]} is too large. Split it into smaller text files.`),
 pattern(/^(.+) 不是UTF-8文本，请另存为UTF-8后重试$/,m=>`${m[1]} is not UTF-8 text. Save it as UTF-8 and retry.`),
 pattern(/^(.+) 是空文件$/,m=>`${m[1]} is empty`),
 pattern(/^(\d+) 个链接$/,m=>`${m[1]} links`),
 pattern(/^(\d+) 个文件$/,m=>`${m[1]} files`),
 pattern(/^(\d+) 秒$/,m=>`${m[1]} seconds`),
 pattern(/^本阶段 (\d+) \/ (\d+) 条$/,m=>`This stage: ${m[1]} / ${m[2]}`),
 pattern(/^已自动加入 (\d+)( 首音乐| 条视频)$/,m=>`Added ${m[1]} ${m[2].includes('音乐')?'tracks':'videos'}`),
 pattern(/^子 Agent 整理完成，已入库(\d+)条，跳过(\d+)项。未实际观看或试听。$/,m=>`Processing complete: ${m[1]} added, ${m[2]} skipped. Full video and audio were not reviewed.`),
 pattern(/^已跳过 (\d+) 项，可在下方查看原因。$/,m=>`Skipped ${m[1]} entries. See reasons below.`),
 pattern(/^第 (\d+) 轮$/,m=>`Round ${m[1]}`),
 pattern(/^(\d+) 条目录$/,m=>`${m[1]} catalog entries`),
 pattern(/^已保存 (\d+) 条推荐$/,m=>`${m[1]} recommendations saved`),
 pattern(/^收藏未保存：(.+)$/,m=>`Could not save favorite: ${translate(m[1])}`),
 pattern(/^收录 (\d+) 个网页案例与模板，来自 (.+)。资料核对于 (.+)，按来源编号及演示地址检查重复。$/,m=>`${m[1]} web examples and templates from ${m[2].replaceAll('、',', ')}. Sources checked on ${m[3]}; deduplicated by source IDs and demo URLs.`),
];
function translate(value){
 const text=String(value??'');if(language==='zh'){const trimmed=text.trim(),translated=chineseMessages[trimmed];return translated===undefined?text:text.slice(0,text.indexOf(trimmed))+translated+text.slice(text.indexOf(trimmed)+trimmed.length);}
 if(!/[\u3400-\u9fff]/.test(text))return text;
 const trimmed=text.trim();let result=messages[trimmed];
 if(result===undefined){for(const [re,format] of patterns){const match=trimmed.match(re);if(match){result=format(match);break;}}}
 if(result===undefined&&/\s*↗$/.test(trimmed))result=translate(trimmed.replace(/\s*↗$/,''))+' ↗';
 if(result===undefined&&/^[▷♫▧↗←＋▶]\s*/.test(trimmed)){
  const match=trimmed.match(/^([▷♫▧↗←＋▶]\s*)(.+)$/s);if(match)result=match[1]+translate(match[2]);
 }
 if(result===undefined&&trimmed.includes(' · '))result=trimmed.split(' · ').map(translate).join(' · ');
 if(result===undefined&&trimmed.includes(' / '))result=trimmed.split(' / ').map(translate).join(' / ');
 if(result===undefined)return text;
 return text.slice(0,text.indexOf(trimmed))+result+text.slice(text.indexOf(trimmed)+trimmed.length);
}
function localizeValue(node,key,current,write,display=translate){
 let record=sources.get(node);if(!record){record={};sources.set(node,record);}
 let entry=record[key];
 // External renders can replace a previously translated message with fresh source text.
 if(!entry||entry.rendered!==current)entry=record[key]={source:current,rendered:current};
 const next=display(entry.source);entry.rendered=next;if(next!==current)write(next);
}
function textNode(node){
 if(!node.parentElement||node.parentElement.closest(ignored+',textarea'))return;
 // Uploaded originals and user-created project names stay verbatim; catalog display text is localized.
 if(node.parentElement.matches('.import-original h4,.project-button strong,.import-history-item strong,.import-detail-title h3'))return;
 const originalName=node.parentElement.matches('.card-title,.image-fallback,.track-title,.website-title,#preview-title,#website-preview-title,#watch-title,#now-title,.reference-head h3,.watch-item-text strong');
 localizeValue(node,'text',node.nodeValue,value=>node.nodeValue=value,value=>language==='zh'&&originalName?value:translate(value));
}
function element(node){
 if(node.closest(ignored))return;
 for(const name of attributes){
  if(!node.hasAttribute(name))continue;
  if(name==='content'&&!node.matches('meta[name="description"]'))continue;
  localizeValue(node,name,node.getAttribute(name),value=>node.setAttribute(name,value));
 }
}
function visit(root){
 if(root.nodeType===Node.TEXT_NODE){textNode(root);return;}
 if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_NODE)return;
 if(root.nodeType===Node.ELEMENT_NODE)element(root);
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
 for(let node=walker.nextNode();node;node=walker.nextNode()){
  if(node.nodeType===Node.TEXT_NODE)textNode(node);else element(node);
 }
}
const options={subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes};
const observer=new MutationObserver(records=>{
 observer.disconnect();
 const roots=new Set();
 for(const record of records){
  if(record.type==='childList')for(const node of record.addedNodes)roots.add(node);
  else roots.add(record.target);
 }
 for(const root of roots)if(root.isConnected)visit(root);
 observer.observe(document.documentElement,options);
});
function apply(){
 observer.disconnect();document.documentElement.lang=language==='zh'?'zh-CN':'en';visit(document);
 document.querySelectorAll('[data-language]').forEach(select=>select.value=language);
 observer.observe(document.documentElement,options);
}
function setLanguage(next,persist=true){
 if(next!=='en'&&next!=='zh')return;language=next;
 if(persist)try{localStorage.setItem(storageKey,next);}catch{}
 apply();window.dispatchEvent(new CustomEvent('motion-language-change',{detail:{language}}));
}
// Index both languages without translating IDs or depending on the selected language.
const searchCache=new Map();
function searchText(value){
 const parts=Array.isArray(value)?value:[value];
 return parts.map(part=>{const source=String(part??'');if(!searchCache.has(source))searchCache.set(source,source+' '+(messages[source.trim()]||''));return searchCache.get(source);}).join(' ');
}
function registerMessages(values){
 if(!values||typeof values!=='object')return;
 for(const [key,value] of Object.entries(values))if(typeof value==='string'&&value.trim())messages[key]=value;
 searchCache.clear();
}
function registerCatalog(rows){
 for(const row of rows)for(const field of ['title','note','provenance']){
  if(typeof row[field]==='string'&&typeof row[field+'En']==='string'&&row[field+'En'].trim())messages[row[field]]=row[field+'En'].trim();
 }
 searchCache.clear();
}
window.MotionI18n={t:translate,setLanguage,get language(){return language;},storageKey,searchText,registerCatalog,registerMessages,sourceText:node=>{const entry=sources.get(node.firstChild)?.text;return entry&&entry.rendered===node.textContent?entry.source:node.textContent;},refresh:apply};
const sidebar=document.querySelector('.sidebar');
if(sidebar){
 const control=document.createElement('label');control.className='language-control';
 const label=document.createElement('span');label.textContent='Language / 语言';label.dataset.i18nIgnore='';
 const select=document.createElement('select');select.id='language-select';select.dataset.language='';select.setAttribute('aria-label','Language / 语言');
 select.add(new Option('English','en'));select.add(new Option('中文','zh'));select.value=language;
 select.addEventListener('change',event=>setLanguage(event.target.value));control.append(label,select);
 sidebar.insertBefore(control,sidebar.querySelector('.sidebar-footer'));
}
window.addEventListener('storage',event=>{if(event.key===storageKey)setLanguage(event.newValue==='zh'?'zh':'en',false);});
apply();
})();
