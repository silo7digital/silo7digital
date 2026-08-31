const app = document.querySelector('#app')

const clientSlots = Array.from({ length: 7 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return `<button class="client-slot slot-${index + 1}" type="button" aria-label="Client position ${index + 1}"><span class="slot-number">${number}</span><span class="slot-label">CLIENT</span></button>`
}).join('')

app.innerHTML = `
  <main class="experience" aria-label="Silo 7">
    <section class="scene scene-hero is-active" data-scene="hero" aria-label="Silo 7 introduction">
      <div class="rose-field" aria-hidden="true"></div>
      <div class="shade" aria-hidden="true"></div>

      <div class="hero-lockup">
        <div class="glitch-rose" aria-hidden="true"></div>
        <img class="brand-logo" src="./assets/logo.png" alt="Silo 7" />
        <img class="logo-fragment fragment-c" src="./assets/logo.png" alt="" aria-hidden="true" />
        <img class="logo-fragment fragment-r" src="./assets/logo.png" alt="" aria-hidden="true" />
      </div>

      <div class="crosses" aria-hidden="true"><span>✝</span><span>✝</span><span>✝</span></div>
      <button class="hint" type="button" aria-label="Enter the seven client positions">MOVE THROUGH THE MARK</button>
      <div class="slice slice-a" aria-hidden="true"></div>
      <div class="slice slice-b" aria-hidden="true"></div>
      <div class="slice slice-c" aria-hidden="true"></div>
    </section>

    <section class="scene scene-clients" data-scene="clients" aria-label="Seven client positions">
      <div class="clients-noise" aria-hidden="true"></div>
      <div class="clients-stage">
        <svg class="spiral-path" viewBox="0 0 1000 700" aria-hidden="true">
          <path d="M500 350 C535 310 595 315 610 365 C630 430 555 470 485 452 C385 428 350 325 405 238 C475 128 645 137 730 242 C835 372 770 565 615 625" />
        </svg>
        <div class="client-spiral">${clientSlots}</div>
        <div class="clients-core">
          <span class="clients-kicker">SILO 7</span>
          <h1>WE ONLY WORK<br>WITH SEVEN<br>CLIENTS.</h1>
          <p>SEVEN POSITIONS. THAT'S IT.</p>
        </div>
      </div>
      <button class="scene-back" type="button" aria-label="Return to Silo 7 introduction">BACK</button>
      <div class="clients-hint">MOVE THE WHEEL</div>
    </section>
  </main>
`

const experience = document.querySelector('.experience')
const heroScene = document.querySelector('.scene-hero')
const clientsScene = document.querySelector('.scene-clients')
const lockup = document.querySelector('.hero-lockup')
const clientSpiral = document.querySelector('.client-spiral')
const backButton = document.querySelector('.scene-back')
const enterButton = document.querySelector('.hint')
const root = document.documentElement

let level = 0
let lastX = 0
let lastY = 0
let lastTime = performance.now()
let settleTimer = 0
let settleFrame = 0
let currentScene = 0
let wheelIntent = 0
let wheelReset = 0
let spiralRotation = 0
let transitionLocked = false

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

function showScene(index) {
  if (transitionLocked || index === currentScene) return
  transitionLocked = true
  currentScene = index
  experience.dataset.scene = index === 0 ? 'hero' : 'clients'
  heroScene.classList.toggle('is-active', index === 0)
  clientsScene.classList.toggle('is-active', index === 1)
  heroScene.setAttribute('aria-hidden', index === 1 ? 'true' : 'false')
  clientsScene.setAttribute('aria-hidden', index === 0 ? 'true' : 'false')
  wheelIntent = 0
  window.setTimeout(() => { transitionLocked = false }, 1100)
}

function moveSpiral(delta) {
  spiralRotation += Math.max(-18, Math.min(18, delta * 0.035))
  clientSpiral.style.setProperty('--spiral-rotation', `${spiralRotation}deg`)
}

heroScene.addEventListener('pointermove', (event) => {
  if (currentScene !== 0) return

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

heroScene.addEventListener('pointerleave', () => {
  clearTimeout(settleTimer)
  settle()
}, { passive: true })

experience.addEventListener('wheel', (event) => {
  event.preventDefault()
  const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX

  if (currentScene === 0) {
    if (delta <= 0) return
    wheelIntent += Math.min(60, delta)
    clearTimeout(wheelReset)
    wheelReset = setTimeout(() => { wheelIntent = 0 }, 260)
    if (wheelIntent >= 35) showScene(1)
    return
  }

  moveSpiral(delta)
}, { passive: false })

enterButton.addEventListener('click', () => showScene(1))
backButton.addEventListener('click', () => showScene(0))

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
    event.preventDefault()
    if (currentScene === 0) showScene(1)
    else moveSpiral(90)
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp' || event.key === 'Escape') {
    event.preventDefault()
    if (currentScene === 1) showScene(0)
  }
})

let touchStartX = 0
let touchStartY = 0

experience.addEventListener('touchstart', (event) => {
  const touch = event.touches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}, { passive: true })

experience.addEventListener('touchend', (event) => {
  const touch = event.changedTouches[0]
  const dx = touch.clientX - touchStartX
  const dy = touch.clientY - touchStartY
  if (currentScene === 0 && (dx < -55 || dy < -55)) showScene(1)
  else if (currentScene === 1 && dx > 55) showScene(0)
}, { passive: true })

experience.dataset.scene = 'hero'
heroScene.setAttribute('aria-hidden', 'false')
clientsScene.setAttribute('aria-hidden', 'true')
