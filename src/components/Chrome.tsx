import { useEffect, useLayoutEffect, useRef, type MouseEvent } from 'react'
import { objects } from '../data/objects'
import { EASE, getEntranceDelay, gsap, reducedMotion, ScrollTrigger, setEntranceDelay } from '../lib/motion'
import { useRouter, withBase } from '../lib/router'
import { useStore } from '../store/store'

export function Link({ to, className, children, cursor }: { to: string; className?: string; children: React.ReactNode; cursor?: string }) {
  const { navigate } = useRouter()
  const onClick = (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return
    event.preventDefault()
    navigate(to)
  }
  return <a href={withBase(to)} className={className} onClick={onClick} data-cursor={cursor}>{children}</a>
}

export function Nav() {
  const { path } = useRouter()
  const { cart, setDrawerOpen } = useStore()
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const header = ref.current!
    const tween = gsap.from(header.children, { yPercent: -130, autoAlpha: 0, duration: 1.1, ease: EASE.out, stagger: 0.07, delay: getEntranceDelay() + 0.5 })
    let hidden = false
    const watcher = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const next = self.direction === 1 && self.scroll() > 140
        if (next === hidden) return
        hidden = next
        gsap.to(header, { yPercent: next ? -100 : 0, duration: 0.75, ease: EASE.out, overwrite: 'auto' })
      },
    })
    return () => { tween.progress(1).kill(); watcher.kill() }
  }, [])

  return (
    <header className="nav" ref={ref}>
      <Link to="/" className="nav-mark">Archive<em>001</em></Link>
      <nav className="nav-links" aria-label="Primary">
        <Link to="/" className={path === '/' ? 'is-on' : ''}>Home</Link>
        <Link to="/archive" className={path === '/archive' ? 'is-on' : ''}>Archive</Link>
      </nav>
      <button type="button" className="nav-cart" onClick={() => setDrawerOpen(true)}>
        Cart <span className="mono">{String(cart.length).padStart(2, '0')}</span>
      </button>
    </header>
  )
}

export function Shutter() {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const shutter = ref.current!
    if (reducedMotion()) { gsap.set(shutter, { visibility: 'hidden' }); return }
    const columns = shutter.querySelectorAll('i')
    const text = shutter.querySelector('.shutter-label span')!
    const count = { value: 0 }
    const number = shutter.querySelector('.shutter-count')!
    const tl = gsap.timeline({ onComplete: () => { gsap.set(shutter, { visibility: 'hidden' }); number.textContent = ''; setEntranceDelay(0.62) } })
    tl.fromTo(text, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: EASE.out }, 0.12)
      .to(count, { value: objects.length, duration: 1.25, ease: 'power2.inOut', onUpdate: () => { number.textContent = String(Math.round(count.value)).padStart(3, '0') } }, 0.12)
      .to([text, number], { yPercent: -110, duration: 0.5, ease: EASE.inOut }, 1.42)
      .set(columns, { transformOrigin: '50% 0%' }, 1.55)
      .to(columns, { scaleY: 0, duration: 0.95, ease: EASE.inOut, stagger: 0.055 }, 1.55)
    return () => { tl.kill() }
  }, [])

  return (
    <div className="shutter" ref={ref} aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => <i key={i} />)}
      <div className="shutter-label"><span>Archive 001</span></div>
      <div className="shutter-countbox"><div className="shutter-count mono">000</div></div>
    </div>
  )
}

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion()) return
    const el = ref.current!
    const label = el.querySelector('span')!
    const x = gsap.quickTo(el, 'x', { duration: 0.42, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.42, ease: 'power3' })
    let shown = false
    const move = (event: PointerEvent) => {
      if (!shown) { gsap.set(el, { x: event.clientX, y: event.clientY, autoAlpha: 1 }); shown = true }
      x(event.clientX); y(event.clientY)
    }
    const over = (event: PointerEvent) => {
      const target = (event.target as Element).closest<HTMLElement>('[data-cursor]')
      el.classList.toggle('has-label', !!target?.dataset.cursor)
      if (target?.dataset.cursor) label.textContent = target.dataset.cursor
    }
    const leave = () => { gsap.to(el, { autoAlpha: 0, duration: 0.2 }); shown = false }
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <div className="cursor" ref={ref} aria-hidden="true"><span /></div>
}

export function Footer() {
  return (
    <footer className="foot">
      <p className="mono foot-kicker">End of section / {String(objects.length).padStart(3, '0')} objects held</p>
      <Link to="/archive" className="foot-cta" cursor="Enter">Enter the <em>Archive</em></Link>
      <div className="foot-base mono">
        <span>ARCHIVE 001</span>
        <span>Independent collection</span>
        <span>Prototype. Objects, provenance and prices are illustrative.</span>
        <a href="https://unsplash.com" target="_blank" rel="noreferrer">Photography via Unsplash</a>
      </div>
    </footer>
  )
}
