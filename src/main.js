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
    <div class="hint">CLICK TO DISTURB</div>
    <div class="slice slice-a" aria-hidden="true"></div>
    <div class="slice slice-b" aria-hidden="true"></div>
  </main>
`

const landing = document.querySelector('.landing')
let impactTimer

landing.addEventListener('pointerdown', () => {
  if (landing.classList.contains('impact')) return
  landing.classList.add('impact')
  clearTimeout(impactTimer)
  impactTimer = setTimeout(() => landing.classList.remove('impact'), 220)
}, { passive: true })
