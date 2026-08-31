const app = document.querySelector('#app')

app.innerHTML = `
  <main class="landing" aria-label="Silo 7">
    <div class="rose-field" aria-hidden="true"></div>
    <div class="shade" aria-hidden="true"></div>
    <div class="glitch-rose" aria-hidden="true"></div>

    <section class="identity">
      <img class="brand-logo" src="./assets/silo7.svg" alt="Silo 7" />
      <div class="logo-echo echo-c" aria-hidden="true"></div>
      <div class="logo-echo echo-r" aria-hidden="true"></div>
    </section>

    <div class="crosses" aria-hidden="true"><span>✝</span><span>✝</span><span>✝</span></div>
    <div class="tagline">DISRUPTION OPTIONAL BUT INEVITABLE.</div>
    <div class="hint">CLICK TO DISTURB</div>
    <div class="slice slice-a" aria-hidden="true"></div>
    <div class="slice slice-b" aria-hidden="true"></div>
  </main>
`

const landing = document.querySelector('.landing')

window.addEventListener('pointerdown', () => {
  landing.classList.remove('impact')
  void landing.offsetWidth
  landing.classList.add('impact')
})
