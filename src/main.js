const app = document.querySelector('#app')

app.innerHTML = `
  <main class="landing" aria-label="Silo 7">
    <div class="rose-field" aria-hidden="true"></div>
    <div class="shade" aria-hidden="true"></div>

    <section class="hero-lockup">
      <div class="glitch-rose" aria-hidden="true"></div>
      <img class="brand-logo" src="./assets/silo7.svg" alt="Silo 7" />
      <img class="logo-fragment fragment-c" src="./assets/silo7.svg" alt="" aria-hidden="true" />
      <img class="logo-fragment fragment-r" src="./assets/silo7.svg" alt="" aria-hidden="true" />
    </section>

    <div class="crosses" aria-hidden="true"><span>✝</span><span>✝</span><span>✝</span></div>
    <div class="hint">MOVE THROUGH THE MARK</div>
    <div class="slice slice-a" aria-hidden="true"></div>
    <div class="slice slice-b" aria-hidden="true"></div>
    <div class="slice slice-c" aria-hidden="true"></div>
  </main>
`

const landing = document.querySelector('.landing')
const lockup = document.querySelector('.hero-lockup')
const root = document.documentElement

let level = 0
let lastX = 0
let lastY = 0
let lastTime = performance.now()
let settleTimer = 0
let settleFrame = 0

function applyLevel(value) {
  level = Math.max(0, Math.min(1, value))
  root.style.setProperty('--disturb', level.toFixed(3))
}

function settle() {
  cancelAnimationFrame(settleFrame)
  const decay = () => {
    level *= 0.88
    if (level < 0.012) {
      applyLevel(0)
      return
    }
    applyLevel(level)
    settleFrame = requestAnimationFrame(decay)
  }
  settleFrame = requestAnimationFrame(decay)
}

landing.addEventListener('pointermove', (event) => {
  const rect = lockup.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const nx = Math.abs(event.clientX - cx) / (rect.width * 0.68)
  const ny = Math.abs(event.clientY - cy) / (rect.height * 0.78)
  const proximity = Math.max(0, 1 - Math.sqrt(nx * nx + ny * ny))

  const now = performance.now()
  const dt = Math.max(16, now - lastTime)
  const speed = Math.min(1, Math.hypot(event.clientX - lastX, event.clientY - lastY) / dt / 1.35)
  const disruption = Math.min(1, proximity * 0.82 + speed * proximity * 0.65)

  root.style.setProperty('--px', ((event.clientX - cx) / rect.width).toFixed(3))
  root.style.setProperty('--py', ((event.clientY - cy) / rect.height).toFixed(3))
  applyLevel(Math.max(level * 0.72, disruption))

  lastX = event.clientX
  lastY = event.clientY
  lastTime = now

  clearTimeout(settleTimer)
  settleTimer = setTimeout(settle, 75)
}, { passive: true })

landing.addEventListener('pointerleave', () => {
  clearTimeout(settleTimer)
  settle()
}, { passive: true })
