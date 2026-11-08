/* Mobile navigation follows the captured Coska popover; original controls retain their handlers. */
document.addEventListener('DOMContentLoaded',()=>{
 const sidebar=document.querySelector('.sidebar'),brand=sidebar?.querySelector('.brand');if(!sidebar||!brand)return;
 window.MotionI18n?.registerMessages({'脚本灵感库':'Script Library','评测脚本库':'Review Script Library'});
 window.MotionI18n?.refresh();
 const content=document.createElement('div');content.className='library-menu-content';content.id='library-menu-content';
 for(const child of [...sidebar.children])if(child!==brand)content.append(child);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='library-menu-toggle';toggle.setAttribute('aria-label','打开导航');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',content.id);
 const image=document.createElement('img');image.alt='';image.width=48;image.height=48;toggle.append(image);sidebar.append(toggle,content);
 const icons=["./coska-menu.png","./coska-close.png"];
 function setOpen(open){sidebar.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',document.documentElement.lang==='zh'?(open?'关闭导航':'打开导航'):(open?'Close navigation':'Open navigation'));image.src=icons[open?1:0];image.classList.toggle('menu-close-image',open)}
 content.addEventListener('change',()=>setOpen(toggle.getAttribute('aria-expanded')==='true'));
 setOpen(false);toggle.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'));
 document.addEventListener('click',e=>{if(!sidebar.contains(e.target))setOpen(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){setOpen(false);toggle.focus()}});
 content.addEventListener('click',e=>{if(e.target.closest('a,.nav-item'))setOpen(false)});
});
