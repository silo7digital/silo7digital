const app = document.querySelector('#app')

app.innerHTML = `
  <main class="landing" aria-label="Silo 7 landing experience">
    <div class="noise" aria-hidden="true"></div>
    <div class="flash" aria-hidden="true"></div>
    <div class="grid" aria-hidden="true"></div>
    <div class="slash slash-a" aria-hidden="true"></div>
    <div class="slash slash-b" aria-hidden="true"></div>
    <div class="orbit orbit-a" aria-hidden="true"></div>
    <div class="orbit orbit-b" aria-hidden="true"></div>

    <div class="crosses" aria-hidden="true">
      <span>✝</span><span>✝</span><span>✝</span>
    </div>

    <section class="hero" aria-label="Silo 7">
      <div class="silo-wrap">
        <div class="silo-ghost cyan" aria-hidden="true">SILO</div>
        <div class="silo-ghost red" aria-hidden="true">SILO</div>
        <h1 class="silo" data-text="SILO">SILO</h1>
      </div>

      <div class="seven-wrap" aria-hidden="true">
        <div class="seven-outline">7</div>
        <div class="seven">7</div>
      </div>

      <div class="micro micro-a">DIGITAL / CREATIVE TECHNOLOGY</div>
      <div class="micro micro-b">EST. SOUTH AFRICA</div>
      <div class="micro micro-c">07 / 07</div>
    </section>

    <div class="tagline">DISRUPTION OPTIONAL BUT INEVITABLE.</div>
    <div class="prompt">MOVE TO DISTURB</div>
  </main>
`

const root = document.documentElement
const landing = document.querySelector('.landing')

let tx = 0.5
let ty = 0.5
let x = 0.5
let y = 0.5
let energy = 0.18
let targetEnergy = 0.18
let idle = 0

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

window.addEventListener('pointermove', (e) => {
  tx = e.clientX / innerWidth
  ty = e.clientY / innerHeight
  const dx = tx - 0.5
  const dy = ty - 0.5
  targetEnergy = clamp(0.28 + Math.sqrt(dx * dx + dy * dy) * 1.15, 0.28, 1)
  idle = 0
})

window.addEventListener('pointerdown', () => {
  targetEnergy = 1
  landing.classList.remove('hit')
  void landing.offsetWidth
  landing.classList.add('hit')
})

window.addEventListener('wheel', (e) => {
  targetEnergy = clamp(targetEnergy + Math.min(Math.abs(e.deltaY) / 900, 0.35), 0.25, 1)
}, { passive: true })

function tick() {
  idle += 0.012
  x += (tx - x) * 0.055
  y += (ty - y) * 0.055
  energy += (targetEnergy - energy) * 0.08

  targetEnergy += (0.22 - targetEnergy) * 0.012

  const pulse = Math.sin(idle * 2.8) * 0.035 + Math.sin(idle * 8.2) * 0.012

  root.style.setProperty('--mx', x.toFixed(4))
  root.style.setProperty('--my', y.toFixed(4))
  root.style.setProperty('--e', clamp(energy + pulse, 0.15, 1).toFixed(4))

  requestAnimationFrame(tick)
}

tick()
