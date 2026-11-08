'use strict';
window.EditingLibrary={"taxonomy":{"categories":{"节奏与卡点":["旅行与城市","美食与生活","品牌与混剪"],"匹配与转场":["动作与构图","视觉与联想","因果与反差"],"声音与画面":["环境与氛围","声画节奏"],"叙事与情绪":["旁白与旅行","主题与串联"],"分屏与并置":["平行叙事","动作与构图","概念与对照"],"时间与空间":["延时与穿行","重复与循环","主题与重组"]},"assignments":{}},"descriptions":{"节奏与卡点":"研究镜头长短、动作节奏跟音乐段落怎样配合。","匹配与转场":"研究动作、构图跟含义怎样把两个镜头接起来。","声音与画面":"研究环境声、动作声跟声音衔接怎样组织画面。","叙事与情绪":"研究素材取舍、旁白跟停顿怎样讲好故事。","分屏与并置":"研究同时出现的画面怎样形成对照跟联系。","时间与空间":"研究延时、循环跟时空重组怎样改变观看节奏。"}};
MotionI18n.registerMessages({
  "剪辑灵感库": "Editing Library",
  "✂ 剪辑灵感库": "✂ Editing Library",
  "按剪辑手法": "Browse by editing technique",
  "节奏与卡点": "Rhythm & timing",
  "匹配与转场": "Match cuts & transitions",
  "声音与画面": "Sound & picture",
  "叙事与情绪": "Story & emotion",
  "分屏与并置": "Split screen & juxtaposition",
  "时间与空间": "Time & space",
  "旅行与城市": "Travel & cities",
  "环境与氛围": "Ambience & atmosphere",
  "声画节奏": "Audiovisual rhythm",
  "旁白与旅行": "Narration & travel",
  "动作与构图": "Action & composition",
  "美食与生活": "Food & lifestyle",
  "主题与串联": "Themes & association",
  "延时与穿行": "Timelapse & flow",
  "平行叙事": "Parallel storytelling",
  "重复与循环": "Repetition & loops",
  "视觉与联想": "Visual association",
  "品牌与混剪": "Brand montages",
  "概念与对照": "Concepts & contrasts",
  "因果与反差": "Cause & surprise",
  "主题与重组": "Themes & reassembly",
  "适合": "Best for",
  "研究重点": "What to study",
  "制作提醒": "Production notes",
  "收录依据": "Why it is included",
  "查看依据 ↗": "View source ↗",
  "原作者资料": "Original metadata",
  "复制研究笔记": "Copy study notes",
  "研究笔记已复制": "Study notes copied",
  "按剪辑手法找成片，研究节奏、转场、声音跟叙事。": "Finished films to study rhythm, transitions, sound and storytelling.",
  "试试搜旅行、品牌、声音或作者名字。": "Try travel, brand, sound or a filmmaker’s name.",
  "搜索作品、剪辑手法或作者…": "Search films, editing techniques or creators…",
  "搜索作品、剪辑手法或作者": "Search films, editing techniques or creators",
  "关于剪辑库": "About this library",
  "关于剪辑灵感库": "About the Editing Library",
  "本机剪辑库": "Local editing library",
  "资料已核对 · 完整观影待核对": "Metadata checked · Full viewing pending",
  "作者、标题跟来源已核对，剪辑研究点为观看建议。": "Author, title and source checked. Study points are viewing prompts.",
  "复制未完成，请重试": "Copy failed. Please retry.",
  "研究镜头长短、动作节奏跟音乐段落怎样配合。": "Study how shot lengths, actions and musical sections work together.",
  "研究动作、构图跟含义怎样把两个镜头接起来。": "Study how actions, framing and meaning connect two shots.",
  "研究环境声、动作声跟声音衔接怎样组织画面。": "Study how ambience, action sounds and sound bridges organize images.",
  "研究素材取舍、旁白跟停顿怎样讲好故事。": "Study how selection, narration and pauses tell a story.",
  "研究同时出现的画面怎样形成对照跟联系。": "Study how simultaneous images create contrasts and connections.",
  "研究延时、循环跟时空重组怎样改变观看节奏。": "Study how timelapse, loops and time shifts change viewing rhythm."
});

EditingLibrary.registerCatalog=rows=>{
 const translations={};
 for(const v of rows)for(const field of ['study','useCase','caution','selectionBasis'])if(v[field]&&v[field+'En'])translations[v[field]]=v[field+'En'];
 MotionI18n.registerMessages(translations);
};
EditingLibrary.renderDetails=v=>{
 const root=document.querySelector('#editing-details');root.replaceChildren();
 EditingLibrary.renderMetrics(root,v);
 for(const [field,label] of [['study','研究重点'],['useCase','适合'],['caution','制作提醒'],['selectionBasis','收录依据']]){
  const item=document.createElement('div'),heading=document.createElement('h3'),body=document.createElement('p');
  heading.textContent=label;body.textContent=v[field]||'';item.append(heading,body);
  if(field==='selectionBasis'){
   const link=document.createElement('a');link.textContent='查看依据 ↗';link.href=v.evidenceUrl;link.target='_blank';link.rel='noopener noreferrer';item.append(link);
   const badge=document.createElement('small');badge.textContent=v.visualReview?.status==='sampled_frames'?'画面已抽样 · 完整观影待核对':'资料已核对 · 完整观影待核对';badge.title='作者、标题跟来源已核对，剪辑研究点为观看建议。';item.append(badge);
  }
  root.append(item);
 }
 const copy=document.createElement('button');copy.type='button';copy.className='button secondary';copy.textContent='复制研究笔记';
 copy.addEventListener('click',async()=>{
  const text=[v.title,v.url,...[['study','研究重点'],['useCase','适合'],['caution','制作提醒'],['selectionBasis','收录依据']].map(([f,l])=>MotionI18n.t(l)+': '+MotionI18n.t(v[f])),v.evidenceUrl,EditingLibrary.metricsText(v)].join('\n');
  try{if(await writeClipboard(text))toast('研究笔记已复制');else manualCopy(text);}catch{toast('复制未完成，请重试');}
 });root.append(copy);
};

MotionI18n.registerMessages({"按剪辑手法整理成片，包含广告、旅行、音乐视频跟叙事短片。每条保留原作者、原视频、研究重点跟收录依据。": "Finished ads, travel films, music videos and narrative shorts organized by editing technique. Each entry includes its creator, original video, study points and sources.", "作者跟作品身份已核对。研究重点是观看建议，未逐部完整观看；涉及合成、拍摄跟声音设计的案例，不把效果全部归为剪辑。": "Author and film identities checked. Study points are viewing prompts; full films have not all been reviewed. Shooting, compositing and sound design may also contribute.", "仅整理原片链接，视频版权归原作者。收藏跟复制记录单独保存在当前浏览器。": "Original video links only; copyright belongs to the creators. Favorites and copy history are stored separately on this computer."});
MotionI18n.refresh();

MotionI18n.registerMessages({
 '播放量最多':'Most plays','点赞数最多':'Most likes','播放':'Plays','点赞':'Likes','评论':'Comments',
 '公开数据':'Public metrics','未公开':'Not public','采集日期':'Checked',
 '查看数据来源 ↗':'View metrics source ↗','数据未公开':'Metrics not public',
 '仅统计此上传页面；平台数值可能取整，不代表剪辑质量评分。':'Counts for this upload only; platform values may be rounded and are not editing-quality scores.',
 '数据筛选':'Data selection','画面已抽样 · 完整观影待核对':'Frames sampled · Full viewing pending','发布日期':'Published','网络流行':'Internet culture','记录类':'Documentary','YouTube精选':'YouTube picks'
});
EditingLibrary.metricValue=n=>Number.isFinite(n)?n.toLocaleString('en-US'):MotionI18n.t('未公开');
EditingLibrary.metricsText=v=>{
 const m=v.metrics;if(!m)return '';
 return [MotionI18n.t('公开数据')+' · '+(m.platform||v.platform),...['plays','likes','comments'].map((k,i)=>MotionI18n.t(['播放','点赞','评论'][i])+': '+EditingLibrary.metricValue(m[k])),MotionI18n.t('采集日期')+': '+m.checkedAt,MotionI18n.t('仅统计此上传页面；平台数值可能取整，不代表剪辑质量评分。'),m.sourceUrl].join('\n');
};
EditingLibrary.cardMetrics=v=>{
 const m=v.metrics;if(!m)return '';
 const text=m.status==='not_public'?'<span>数据未公开</span>':['plays','likes'].map((k,i)=>'<span>'+EditingLibrary.metricValue(m[k])+' <span>'+['播放','点赞'][i]+'</span></span>').join('');
 return '<div class="editing-metrics" title="仅统计此上传页面；平台数值可能取整，不代表剪辑质量评分。">'+text+'<small>'+m.checkedAt+'</small></div>';
};
EditingLibrary.renderMetrics=(root,v)=>{
 const m=v.metrics;if(!m)return;
 const block=document.createElement('div');block.className='editing-public-data';
 const heading=document.createElement('h3');heading.textContent='公开数据';block.append(heading);
 const values=document.createElement('div');values.className='editing-metric-values';
 ['plays','likes','comments'].forEach((k,i)=>{const item=document.createElement('p'),label=document.createElement('span'),num=document.createElement('strong');label.textContent=['播放','点赞','评论'][i];num.textContent=EditingLibrary.metricValue(m[k]);item.append(label,num);values.append(item);});block.append(values);
 const date=document.createElement('small');const label=document.createElement('span');label.textContent='采集日期';date.append(label,': '+m.checkedAt+' · '+(m.platform||v.platform));block.append(date);
 if(m.publishedAt){const published=document.createElement('small'),label=document.createElement('span');label.textContent='发布日期';published.append(label,': '+m.publishedAt.slice(0,10));block.append(published);}
 const tip=document.createElement('small');tip.textContent='仅统计此上传页面；平台数值可能取整，不代表剪辑质量评分。';block.append(tip);
 const a=document.createElement('a');a.href=m.sourceUrl;a.textContent='查看数据来源 ↗';a.target='_blank';a.rel='noopener noreferrer';block.append(a);root.append(block);
};
