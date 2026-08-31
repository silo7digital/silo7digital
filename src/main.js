const app = document.querySelector('#app')

app.innerHTML = `
  <main class="landing" aria-label="Silo 7">
    <div class="rose-field" aria-hidden="true"></div>
    <div class="shade" aria-hidden="true"></div>
    <div class="glitch-rose glitch-rose-a" aria-hidden="true"></div>
    <div class="glitch-rose glitch-rose-b" aria-hidden="true"></div>

    <section class="identity">
      <img class="brand-logo" src="./assets/silo7.svg" alt="Silo 7" />
      <div class="logo-echo echo-c" aria-hidden="true"></div>
      <div class="logo-echo echo-r" aria-hidden="true"></div>
    </section>

    <div class="crosses" aria-hidden="true"><span>✝</span><span>✝</span><span>✝</span></div>
    <div class="tagline">DISRUPTION OPTIONAL BUT INEVITABLE.</div>
    <div class="hint">MOVE / CLICK</div>
    <div class="slice slice-a" aria-hidden="true"></div>
    <div class="slice slice-b" aria-hidden="true"></div>
  </main>
`

const root = document.documentElement
const landing = document.querySelector('.landing')
let raf = 0
let mx = .5
let my = .5

function paint() {
  root.style.setProperty('--mx', mx.toFixed(3))
  root.style.setProperty('--my', my.toFixed(3))
  raf = 0
}

window.addEventListener('pointermove', e => {
  mx = e.clientX / innerWidth
  my = e.clientY / innerHeight
  if (!raf) raf = requestAnimationFrame(paint)
}, { passive: true })

window.addEventListener('pointerdown', () => {
  landing.classList.remove('impact')
  void landing.offsetWidth
  landing.classList.add('impact')
})
