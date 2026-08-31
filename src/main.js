const app = document.querySelector('#app')

app.innerHTML = `
  <main class="landing" aria-label="Silo 7">
    <div class="rose-field" aria-hidden="true"></div>
    <div class="shade" aria-hidden="true"></div>

    <section class="hero-lockup">
      <div class="glitch-rose" aria-hidden="true"></div>
      <img class="brand-logo" src="./assets/silo7.svg" alt="Silo 7" />
      <div class="tagline">DISRUPTION OPTIONAL<br>BUT INEVITABLE....</div>
    </section>

    <div class="crosses" aria-hidden="true"><span>✝</span><span>✝</span><span>✝</span></div>
    <div class="hint">MOVE TO DISRUPT</div>
    <div class="slice slice-a" aria-hidden="true"></div>
    <div class="slice slice-b" aria-hidden="true"></div>
    <div class="slice slice-c" aria-hidden="true"></div>
  </main>
`

const landing = document.querySelector('.landing')
let stage = -1
let impactTimer

function setStage(next) {
  if (next === stage) return
  stage = next
  landing.dataset.stage = String(stage)
}

setStage(0)

landing.addEventListener('pointermove', (event) => {
  const progress = Math.max(0, Math.min(0.999, event.clientX / window.innerWidth))
  setStage(Math.floor(progress * 4))
}, { passive: true })

landing.addEventListener('pointerleave', () => setStage(0), { passive: true })

landing.addEventListener('pointerdown', () => {
  const restoreStage = stage
  clearTimeout(impactTimer)
  landing.classList.add('impact')
  landing.dataset.stage = '3'
  impactTimer = setTimeout(() => {
    landing.classList.remove('impact')
    landing.dataset.stage = String(restoreStage)
  }, 260)
}, { passive: true })
