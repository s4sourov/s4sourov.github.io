// Sydney clock
const clock=document.getElementById('clock');
const tick=()=>{clock.textContent=new Intl.DateTimeFormat('en-AU',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Australia/Sydney'}).format(new Date())};
tick();setInterval(tick,15000);
document.getElementById('yr').textContent=new Date().getFullYear();

// name scramble on load
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const h=document.getElementById('name'),final=h.dataset.text,chars='abcdefghijklmnopqrstuvwxyz';
if(!reduce){let f=0;const t=setInterval(()=>{
  h.textContent=[...final].map((c,i)=>c===' '?' ':(i<f/2?c:chars[Math.random()*26|0])).join('');
  if(++f>final.length*2){h.textContent=final;clearInterval(t)}},45)}

// gentle reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.head,#about h2,#about .lead,.project,.timeline li,.tile,.skills,.c-panel .lead').forEach(el=>{el.classList.add('rv');io.observe(el)});

// card spotlight
document.querySelectorAll('.tile').forEach(c=>c.addEventListener('pointermove',e=>{
  const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}));

// drifting star field
const cv=document.getElementById('sky'),ctx=cv.getContext('2d');let W,H,pts=[];
const mouse={x:0,y:0};
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;pts=Array.from({length:Math.min(90,W/14|0)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+.3,v:Math.random()*.15+.03}))}
addEventListener('resize',size);size();
addEventListener('pointermove',e=>{mouse.x=(e.clientX/W-.5);mouse.y=(e.clientY/H-.5)});
function draw(){
  ctx.clearRect(0,0,W,H);
  for(const p of pts){
    p.y-=p.v;if(p.y<0){p.y=H;p.x=Math.random()*W}
    ctx.beginPath();ctx.arc(p.x+mouse.x*p.r*18,p.y+mouse.y*p.r*18,p.r,0,6.28);
    ctx.fillStyle=`rgba(170,225,255,${.25+p.r*.3})`;ctx.fill();
  }
  if(!reduce)requestAnimationFrame(draw)
}
draw();

// nav: scrolled state, progress, sliding pill + scroll-spy
const nav=document.getElementById('nav'),prog=document.getElementById('progress'),pill=document.getElementById('pill');
const links=[...document.querySelectorAll('#links a')];
function movePill(a){if(!a)return;const p=a.parentElement.getBoundingClientRect(),r=a.getBoundingClientRect();
  pill.style.opacity=1;pill.style.width=r.width+'px';pill.style.transform=`translateX(${r.left-p.left}px)`;links.forEach(l=>l.classList.toggle('on',l===a))}
const secs=['top','about','work','path','contact'].map(id=>document.getElementById(id));
let current=links[0];
function onScroll(){
  const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
  nav.classList.toggle('scrolled',y>40);
  prog.style.transform=`scaleX(${max>0?y/max:0})`;
  let id='top';secs.forEach(s=>{if(s&&s.getBoundingClientRect().top<innerHeight*.4)id=s.id});
  if(innerHeight+y>=document.documentElement.scrollHeight-4)id='contact';
  const a=links.find(l=>l.dataset.s===id);if(a&&a!==current){current=a;movePill(a)}
  // timeline fill
  const tl=document.getElementById('timeline'),fill=document.getElementById('tl-fill');
  if(tl){const r=tl.getBoundingClientRect(),pct=Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height));fill.style.height=pct*100+'%'}
}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',()=>movePill(current));
setTimeout(()=>{movePill(current);onScroll()},400);
document.fonts&&document.fonts.ready.then(()=>movePill(current));

// copy email
const cb=document.getElementById('copy');
cb.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText('s4sourov.au@gmail.com')}catch(e){}
  cb.textContent='Copied ✓';cb.classList.add('done');
  setTimeout(()=>{cb.textContent='Copy email address';cb.classList.remove('done')},2000)});
