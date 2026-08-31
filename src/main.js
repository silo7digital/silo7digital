const app = document.querySelector('#app')

const clientSlots = Array.from({ length: 7 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return `<button class="client-slot" type="button" data-slot="${index}" aria-label="Client position ${index + 1}"><span class="slot-meta"><span>CLIENT POSITION</span><span>${number}</span></span><strong>${number}</strong></button>`
}).join('')

app.innerHTML = `
  <main class="experience" aria-label="Silo 7">
    <section class="scene scene-hero is-active" aria-label="Silo 7 introduction">
      <div class="rose-field" aria-hidden="true"></div><div class="shade" aria-hidden="true"></div>
      <div class="hero-lockup"><div class="glitch-rose" aria-hidden="true"></div><img class="brand-logo" src="./assets/logo.png" alt="Silo 7" /><img class="logo-fragment fragment-c" src="./assets/logo.png" alt="" aria-hidden="true" /><img class="logo-fragment fragment-r" src="./assets/logo.png" alt="" aria-hidden="true" /></div>
      <div class="crosses" aria-hidden="true"><span>✝</span><span>✝</span><span>✝</span></div><button class="hint" type="button">MOVE THROUGH THE MARK</button><div class="slice slice-a"></div><div class="slice slice-b"></div><div class="slice slice-c"></div>
    </section>
    <section class="scene scene-clients" aria-label="Seven client positions" aria-hidden="true">
      <div class="client-spiral">${clientSlots}</div>
      <div class="clients-core"><span>SILO 7</span><h1>WE ONLY WORK<br>WITH SEVEN<br>CLIENTS.</h1></div>
      <button class="scene-back" type="button">BACK</button><div class="clients-hint">MOVE THE WHEEL</div>
    </section>
  </main>`

const experience=document.querySelector('.experience'),hero=document.querySelector('.scene-hero'),clients=document.querySelector('.scene-clients'),lockup=document.querySelector('.hero-lockup'),slots=[...document.querySelectorAll('.client-slot')],back=document.querySelector('.scene-back'),enter=document.querySelector('.hint'),root=document.documentElement
let level=0,lastX=0,lastY=0,lastTime=performance.now(),settleTimer=0,settleFrame=0,currentScene=0,wheelIntent=0,wheelReset=0,phase=0
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v))
function applyLevel(v){level=clamp(v,0,1);root.style.setProperty('--disturb',level.toFixed(3))}
function settle(){cancelAnimationFrame(settleFrame);const decay=()=>{level*=.88;if(level<.012){applyLevel(0);return}applyLevel(level);settleFrame=requestAnimationFrame(decay)};settleFrame=requestAnimationFrame(decay)}

/* Reference behavior: a vertical corkscrew around the viewport centre. Cards cross the front large,
   narrow almost edge-on at the sides/back, then return on the opposite side. */
function layoutSpiral(){
  const w=innerWidth,h=innerHeight,cx=w*.54,cy=h*.50
  slots.forEach((slot,i)=>{
    const a=phase+i*(Math.PI*2/7)
    const depth=Math.cos(a)
    const x=cx+Math.sin(a)*w*.34
    const y=cy+Math.sin(a*2)*h*.31
    const scale=.58+(depth+1)*.34
    const yaw=Math.sin(a)*76
    const tilt=Math.sin(a*2)*-4
    slot.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) perspective(900px) rotateY(${yaw}deg) rotateZ(${tilt}deg) scale(${scale})`
    slot.style.opacity=String(.48+(depth+1)*.26)
    slot.style.zIndex=String(Math.round((depth+1)*50)+2)
  })
}
function showScene(index){currentScene=index;experience.dataset.scene=index?'clients':'hero';hero.classList.toggle('is-active',!index);clients.classList.toggle('is-active',!!index);hero.setAttribute('aria-hidden',index?'true':'false');clients.setAttribute('aria-hidden',index?'false':'true');wheelIntent=0;if(index)requestAnimationFrame(layoutSpiral)}
function moveSpiral(delta){phase+=clamp(delta*.0025,-.22,.22);layoutSpiral()}

hero.addEventListener('pointermove',e=>{if(currentScene)return;const r=lockup.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,nx=Math.abs(e.clientX-cx)/(r.width*.68),ny=Math.abs(e.clientY-cy)/(r.height*.78),proximity=Math.max(0,1-Math.sqrt(nx*nx+ny*ny)),now=performance.now(),dt=Math.max(16,now-lastTime),speed=Math.min(1,Math.hypot(e.clientX-lastX,e.clientY-lastY)/dt/1.35),d=Math.min(1,proximity*.82+speed*proximity*.65);root.style.setProperty('--px',((e.clientX-cx)/r.width).toFixed(3));root.style.setProperty('--py',((e.clientY-cy)/r.height).toFixed(3));applyLevel(Math.max(level*.72,d));lastX=e.clientX;lastY=e.clientY;lastTime=now;clearTimeout(settleTimer);settleTimer=setTimeout(settle,75)},{passive:true})
hero.addEventListener('pointerleave',()=>{clearTimeout(settleTimer);settle()},{passive:true})
experience.addEventListener('wheel',e=>{e.preventDefault();const delta=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;if(!currentScene){if(delta<=0)return;wheelIntent+=Math.min(70,Math.abs(delta));clearTimeout(wheelReset);wheelReset=setTimeout(()=>wheelIntent=0,320);if(wheelIntent>=70)showScene(1);return}moveSpiral(delta)},{passive:false})
enter.addEventListener('click',()=>showScene(1));back.addEventListener('click',e=>{e.stopPropagation();showScene(0)})
document.addEventListener('keydown',e=>{if(['ArrowDown','ArrowRight','PageDown'].includes(e.key)){e.preventDefault();currentScene?moveSpiral(90):showScene(1)}if(['ArrowUp','ArrowLeft','PageUp','Escape'].includes(e.key)){e.preventDefault();if(currentScene)showScene(0)}})
window.addEventListener('resize',()=>{if(currentScene)layoutSpiral()},{passive:true})
showScene(0)
