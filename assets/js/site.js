(function(){
'use strict';
var d=document,h=d.documentElement;
function $(s,r){return (r||d).querySelector(s)}
function all(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s))}
function el(t,c,x){var n=d.createElement(t);if(c)n.className=c;if(x)n.textContent=x;return n}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
function pad(n){return ('000'+n).slice(-3)}

/* 字号 18px ↔ 20px */
function setFs(l){h.classList.toggle('fs-l',l);store('fs',l?'L':'S');
 all('[data-fs]').forEach(function(b){b.setAttribute('aria-pressed',String((b.getAttribute('data-fs')==='l')===l))})}
setFs(store('fs')==='L');
all('[data-fs]').forEach(function(b){b.onclick=function(){setFs(b.getAttribute('data-fs')==='l')}});

/* 白话 / 原文 / 对照 */
var story=$('.story');
if(story){var mb=all('.btn[data-mode]',story);
 mb.forEach(function(b){b.onclick=function(){story.setAttribute('data-mode',b.getAttribute('data-mode'));
  mb.forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))})}})}

/* 手机抽屉 */
var tg=$('.toggle');
function drawer(o){h.classList.toggle('drawer-open',o);tg.setAttribute('aria-expanded',String(o))}
tg.onclick=function(){drawer(!h.classList.contains('drawer-open'))};
$('.scrim').onclick=function(){drawer(false)};
d.addEventListener('keydown',function(e){if(e.key==='Escape')drawer(false)});

/* 目录：只加载标题清单 nav.json，手风琴 + 搜索 */
var items=[];
function build(n){
 var nav=$('#nav'),p=location.pathname.replace(/index\.html$/,''),tree=el('ul','tree');
 n.b.forEach(function(b){
  var bl=el('li'),bb=el('button','acc acc-b',b.t),bu=el('ul','sub');bb.type='button';
  if(p===b.u)bl.className='open';
  b.s.forEach(function(s){
   var sl=el('li'),sb=el('button','acc',s.t),su=el('ul','sub'),c=el('small','',s.i.length+' 篇');sb.type='button';sb.appendChild(c);
   if(p===s.u){sl.classList.add('open');bl.classList.add('open')}
   s.i.forEach(function(i){
    var li=el('li','item'),a=el('a'),no=el('span','no',pad(i[0]));a.href=i[2];a.appendChild(no);a.appendChild(el('span','',i[1]));
    if(p===i[2]){a.className='cur';a.setAttribute('aria-current','page');sl.classList.add('open');bl.classList.add('open')}
    a.onclick=function(){drawer(false)};
    li.appendChild(a);su.appendChild(li);
    items.push({li:li,sl:sl,bl:bl,n:i[0],t:i[1],u:i[2],b:b.t,k:(pad(i[0])+' '+i[1]+' '+b.t).toLowerCase()});
   });
   sl.appendChild(sb);sl.appendChild(su);bu.appendChild(sl);
   sb.onclick=function(){sl.classList.toggle('open')};
  });
  bl.insertBefore(bb,bl.firstChild);bl.appendChild(bu);tree.appendChild(bl);
  bb.onclick=function(){bl.classList.toggle('open')};
 });
 all('li',tree).forEach(function(x){x.setAttribute('data-o',x.classList.contains('open')?'1':'')});
 nav.innerHTML='';nav.appendChild(tree);
 var cur=$('a.cur',nav),side=$('#side');
 if(cur&&side)side.scrollTop=Math.max(0,cur.offsetTop-side.clientHeight/2);
 var q=$('#navq');
 q.oninput=function(){
  var v=q.value.trim().toLowerCase(),lis=all('.tree li',nav);
  if(!v){lis.forEach(function(x){x.hidden=false;x.classList.toggle('open',x.getAttribute('data-o')==='1')});var hq2=$('#homeq'),hr2=$('#homeres');if(hq2)hq2.value='';if(hr2)hr2.innerHTML='';return}
  lis.forEach(function(x){x.hidden=false});
  items.forEach(function(it){it.li.hidden=it.k.indexOf(v)<0});
  all('.tree > li',nav).forEach(function(b){var any=false;
   all(':scope > .sub > li',b).forEach(function(s){var m=all('.item',s).some(function(x){return !x.hidden});s.hidden=!m;s.classList.toggle('open',m);any=any||m});
   b.hidden=!any;b.classList.toggle('open',any)});
 };
 var hq=$('#homeq'),hr=$('#homeres');
 if(hq)hq.oninput=function(){
  var v=hq.value.trim().toLowerCase();hr.innerHTML='';if(!v)return;
  var m=items.filter(function(it){return it.k.indexOf(v)>-1}).slice(0,40);
  if(!m.length){var e=el('li');e.appendChild(el('a','','没有找到相关篇目'));hr.appendChild(e);return}
  m.forEach(function(it){var li=el('li'),a=el('a');a.href=it.u;
   a.appendChild(el('span','no',pad(it.n)));a.appendChild(el('span','',it.t));a.appendChild(el('span','bk',it.b));li.appendChild(a);hr.appendChild(li)});
 };
}
fetch('/assets/nav.json').then(function(r){return r.json()}).then(build).catch(function(){});
})();
