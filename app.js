const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? '关闭' : '菜单';
  nav.classList.toggle('open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.textContent='菜单';
}));
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', String(b===button)));
  let count=0;
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden=button.dataset.filter!=='all'&&!card.dataset.tags.split(' ').includes(button.dataset.filter);
    if(!card.hidden)count++;
  });
  document.querySelectorAll('.work-extras').forEach(extra=>{extra.hidden=button.dataset.filter!=='all'&&button.dataset.filter!=='research'&&button.dataset.filter!=='content'});
  const label=document.querySelector('#project-count'); if(label)label.textContent=count+'个项目';
}));
const dialog=document.querySelector('#lightbox');
const triggers=[...document.querySelectorAll('[data-image]')];
let active=0, opener;
function displayImage(index){
  active=(index+triggers.length)%triggers.length;
  const button=triggers[active], media=dialog.querySelector('.viewer-media');
  media.replaceChildren();
  if(button.dataset.crop){
    const [fw,fh,x,y,w,h]=button.dataset.crop.split(',').map(Number);
    const frame=document.createElement('span');frame.className='crop';frame.style.aspectRatio=w+'/'+h;
    const maxWidth=Math.min(innerWidth*.9,(innerHeight*.88-140)*w/h);
    frame.style.setProperty('--viewer-width',maxWidth+'px');frame.style.width=maxWidth+'px';
    const image=document.createElement('img');image.src=button.dataset.image;image.alt=button.dataset.title;
    image.style.width=fw/w*100+'%';image.style.left=-x/w*100+'%';image.style.top=-y/h*100+'%';
    frame.append(image);media.append(frame);
  }else{
    const image=document.createElement('img');image.src=button.dataset.image;image.alt=button.dataset.title;media.append(image);
  }
  dialog.querySelector('#lightbox-title').textContent=button.dataset.title;
  dialog.querySelector('.lightbox-caption').textContent=button.dataset.caption||'';
  dialog.querySelector('.viewer-count').textContent=(active+1)+' / '+triggers.length;
}
triggers.forEach((button,index)=>button.addEventListener('click',()=>{
  opener=button;displayImage(index);dialog.showModal();document.body.style.overflow='hidden';
}));
dialog?.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
dialog?.querySelector('.viewer-prev').addEventListener('click',()=>displayImage(active-1));
dialog?.querySelector('.viewer-next').addEventListener('click',()=>displayImage(active+1));
dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
dialog?.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus()});
document.addEventListener('keydown',event=>{
  if(!dialog?.open)return;
  if(event.key==='ArrowRight'){event.preventDefault();displayImage(active+1)}
  if(event.key==='ArrowLeft'){event.preventDefault();displayImage(active-1)}
});
let toastTimer;
function notify(message){
  const toast=document.querySelector('.toast');toast.textContent=message;toast.hidden=false;
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,4000);
}
document.querySelectorAll('.copy-email').forEach(button=>button.addEventListener('click',async()=>{
  const email='de_3602848092@qq.com';
  try{if(!navigator.clipboard||!isSecureContext)throw Error();await navigator.clipboard.writeText(email);notify('邮箱已复制：'+email)}
  catch{notify('请手动复制：'+email)}
}));
