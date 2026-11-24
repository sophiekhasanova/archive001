import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { imageUrl } from '../data/images'
import { formatPrice } from '../data/objects'
import { EASE, gsap, lockScroll, reducedMotion, trapFocus } from '../lib/motion'
import { useRouter } from '../lib/router'
import { useStore } from '../store/store'

export function CartDrawer() {
  const { cart, drawerOpen, setDrawerOpen, removeFromCart } = useStore()
  const { navigate } = useRouter()
  const [notice, setNotice] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const previous = useRef<HTMLElement | null>(null)
  const mounted = useRef(false)

  useLayoutEffect(() => {
    const el = root.current!
    const panel = el.querySelector('.dr-panel')!
    const veil = el.querySelector('.dr-veil')!
    if (!mounted.current) { mounted.current = true; gsap.set(el, { visibility: 'hidden' }); gsap.set(panel, { xPercent: 100 }); return }
    const duration = reducedMotion() ? 0 : 0.95
    if (drawerOpen) {
      previous.current = document.activeElement as HTMLElement
      lockScroll('drawer', true)
      const tl = gsap.timeline()
        .set(el, { visibility: 'visible' })
        .to(veil, { autoAlpha: 1, duration: duration * 0.6 }, 0)
        .to(panel, { xPercent: 0, duration, ease: EASE.inOut }, 0)
        .fromTo(el.querySelectorAll('[data-dr]'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: duration * 0.7, ease: EASE.out, stagger: 0.05 }, duration * 0.45)
      el.querySelector<HTMLElement>('.dr-close')?.focus({ preventScroll: true })
      return () => { tl.kill() }
    }
    setNotice(false)
    const tl = gsap.timeline({ onComplete: () => { gsap.set(el, { visibility: 'hidden' }); lockScroll('drawer', false); previous.current?.focus?.({ preventScroll: true }) } })
      .to(panel, { xPercent: 100, duration: duration * 0.8, ease: EASE.inOut }, 0)
      .to(veil, { autoAlpha: 0, duration: duration * 0.6 }, duration * 0.2)
    return () => { tl.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false)
      else if (root.current) trapFocus(event, root.current)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen, setDrawerOpen])

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="dr" ref={root} role="dialog" aria-modal="true" aria-label="Cart" aria-hidden={!drawerOpen}>
      <div className="dr-veil" onClick={() => setDrawerOpen(false)} />
      <aside className="dr-panel">
        <div className="dr-head" data-dr>
          <h2>Held <em>for you</em></h2>
          <button type="button" className="dr-close" onClick={() => setDrawerOpen(false)}>Close</button>
        </div>
        {cart.length === 0 ? (
          <div className="dr-empty" data-dr>
            <p>Nothing set aside yet.</p>
            <button type="button" className="btn btn-line" onClick={() => { setDrawerOpen(false); navigate('/archive') }}>Browse the archive</button>
          </div>
        ) : (
          <>
            <ul className="dr-list">
              {cart.map((item) => (
                <li key={item.id} data-dr>
                  <img src={imageUrl(item.image, 320)} alt="" loading="lazy" />
                  <div>
                    <span className="mono">{item.id}</span>
                    <strong>{item.title}</strong>
                    <button type="button" className="mono" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.title}`}>Remove</button>
                  </div>
                  <span className="dr-price">{formatPrice(item.price)}</span>
                </li>
              ))}
            </ul>
            <div className="dr-foot" data-dr>
              <div className="dr-total"><span className="mono">Subtotal</span><span>{formatPrice(total)}</span></div>
              <button type="button" className="btn" onClick={() => setNotice(true)}>Request acquisition</button>
              {notice && <p className="mono dr-notice" role="status">Checkout is not part of this prototype.</p>}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
