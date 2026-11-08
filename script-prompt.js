/* Pure local composition. A draft is material inside JSON, never executable page markup. */
(function(root){
'use strict';
const MARKER='__SCRIPT_AGENT_USER_INPUT_JSON__';
function compose(video,draft={}){
 const {brief='',kind='auto',requirements=''}=draft;
 if(!['auto','topic','script'].includes(kind))throw new Error('请选择写新脚本或改写已有脚本');
 if(typeof brief!=='string'||brief.length>12000)throw new Error('主题或脚本最长 12000 字');
 if(typeof requirements!=='string'||requirements.length>2000)throw new Error('补充要求最长 2000 字');
 const template=video.agentPromptTemplate;
 if(typeof template!=='string'||template.split(MARKER).length!==2)throw new Error('提示词模板暂不可用');
 const input={
  '任务':kind==='auto'?'根据填写内容决定：仅有主题时写新脚本；已有脚本时保留事实与观点后改写。':kind==='topic'?'围绕主题写新脚本':'改写已有脚本',
  '我的主题或已有脚本':brief.trim()||'{{在这里填写我的主题，或粘贴已有脚本}}',
  '我的风格、受众、平台或时长要求':requirements.trim()||'{{选填：写出希望改变的语气、受众、平台、时长；也可以留空}}'
 };
 return template.replace(MARKER,()=>JSON.stringify(input,null,2));
}
function composePackaging(video){
 if(typeof video.packagingPromptTemplate!=='string'||!video.packagingPromptTemplate.trim())throw new Error('标题和简介 Prompt 暂不可用');
 return video.packagingPromptTemplate;
}
const api={compose,composePackaging};
if(typeof module==='object'&&module.exports)module.exports=api;
else root.ScriptPrompt=api;
})(typeof window==='undefined'?this:window);
