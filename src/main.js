import './styles.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="landing" aria-label="Silo 7 landing experience">
    <div class="noise" aria-hidden="true"></div>
    <div class="scanline" aria-hidden="true"></div>

    <header class="brandbar">
      <div class="wordmark" aria-label="Silo 7">SILO<span>7</span></div>
      <div class="crosses" aria-hidden="true">✝ ✝ ✝</div>
    </header>

    <section class="hero">
      <p class="eyebrow">SILO 7 DIGITAL</p>
      <h1 class="statement" aria-label="Disruption optional but inevitable">
        <span class="line line-a">DISRUPTION</span>
        <span class="line line-b">OPTIONAL</span>
        <span class="line line-c">BUT INEVITABLE.</span>
      </h1>
      <p class="prompt">MOVE / SCROLL / DISTURB</p>
    </section>

    <div class="fracture fracture-a" aria-hidden="true"></div>
    <div class="fracture fracture-b" aria-hidden="true"></div>
  </main>
`

const root = document.documentElement
const landing = document.querySelector('.landing')

let targetX = 0.5
let targetY = 0.5
let currentX = 0.5
let currentY = 0.5
let disruption = 0
let targetDisruption = 0

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function disturb(amount = 0.08) {
  targetDisruption = clamp(targetDisruption + amount, 0, 1)
}

window.addEventListener('pointermove', (event) => {
  targetX = event.clientX / window.innerWidth
  targetY = event.clientY / window.innerHeight

  const dx = targetX - 0.5
  const dy = targetY - 0.5
  const distance = Math.sqrt(dx * dx + dy * dy)
  targetDisruption = clamp(distance * 1.3, 0.05, 0.72)
})

window.addEventListener('wheel', (event) => {
  disturb(Math.min(Math.abs(event.deltaY) / 1800, 0.2))
}, { passive: true })

window.addEventListener('pointerdown', () => disturb(0.24))

window.addEventListener('touchmove', () => disturb(0.12), { passive: true })

function tick() {
  currentX += (targetX - currentX) * 0.06
  currentY += (targetY - currentY) * 0.06
  disruption += (targetDisruption - disruption) * 0.075

  targetDisruption *= 0.992
  targetDisruption = Math.max(targetDisruption, 0.035)

  root.style.setProperty('--mx', currentX.toFixed(4))
  root.style.setProperty('--my', currentY.toFixed(4))
  root.style.setProperty('--d', disruption.toFixed(4))

  landing.classList.toggle('is-disturbed', disruption > 0.18)
  requestAnimationFrame(tick)
}

tick()
