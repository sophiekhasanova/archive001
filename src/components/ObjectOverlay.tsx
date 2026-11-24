import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { images, imageSrcSet, imageUrl, type ImageEntry } from '../data/images'
import { collectionById, formatPrice, objectById, objects } from '../data/objects'
import { EASE, gsap, lockScroll, reducedMotion, trapFocus } from '../lib/motion'
import { useStore } from '../store/store'

const box = (r: DOMRect) => ({ left: r.left, top: r.top, width: r.width, height: r.height })

export function ObjectOverlay() {
  const { activeId, sourceRef, closeObject, showObject, addToCart, inCart, setDrawerOpen } = useStore()
  const [shownId, setShownId] = useState<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const closing = useRef(false)
  const returnFocus = useRef<HTMLElement | null>(null)
  const wasOpen = useRef(false)

  useLayoutEffect(() => { if (activeId) setShownId(activeId) }, [activeId])

  const object = shownId ? objectById(shownId) : undefined

  useLayoutEffect(() => {
    if (!object || !root.current || !media.current) return
    const el = root.current
    const details = el.querySelectorAll('[data-ov]')

    if (wasOpen.current) {
      if (reducedMotion()) return
      const tl = gsap.timeline()
      tl.fromTo(media.current.querySelector('img'), { scale: 1.1, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: EASE.out })
        .fromTo(details, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: EASE.out, stagger: 0.035 }, 0.08)
      return () => { tl.progress(1).kill() }
    }

    wasOpen.current = true
    closing.current = false
    returnFocus.current = document.activeElement as HTMLElement
    lockScroll('overlay', true)
    el.querySelector<HTMLElement>('.ov-close')?.focus({ preventScroll: true })
    if (reducedMotion()) return

    const target = box(media.current.getBoundingClientRect())
    const source = sourceRef.current?.isConnected ? box(sourceRef.current.getBoundingClientRect()) : null
    const tl = gsap.timeline()
    tl.fromTo(el.querySelector('.ov-bg'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0)
    if (source) tl.fromTo(media.current, { ...source, position: 'fixed' }, { ...target, duration: 1.05, ease: EASE.inOut, clearProps: 'all' }, 0)
    else tl.fromTo(media.current, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: EASE.inOut, clearProps: 'clipPath' }, 0)
    tl.fromTo(details, { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85, ease: EASE.out, stagger: 0.045 }, 0.5)
  // Runs for each newly displayed object.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shownId])

  const finish = useCallback(() => {
    wasOpen.current = false
    closing.current = false
    setShownId(null)
    lockScroll('overlay', false)
    returnFocus.current?.focus?.({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (activeId || !shownId || closing.current || !root.current || !media.current) return
    closing.current = true
    if (reducedMotion()) { finish(); return }
    const el = root.current
    const source = sourceRef.current?.isConnected ? box(sourceRef.current.getBoundingClientRect()) : null
    const tl = gsap.timeline({ onComplete: finish })
    tl.to(el.querySelectorAll('[data-ov]'), { autoAlpha: 0, y: 12, duration: 0.28, ease: 'power2.in', stagger: 0.01 }, 0)
    if (source) {
      gsap.set(media.current, { position: 'fixed', ...box(media.current.getBoundingClientRect()) })
      tl.to(media.current, { ...source, duration: 0.85, ease: EASE.inOut }, 0.08)
    } else {
      tl.to(media.current, { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.7, ease: EASE.inOut }, 0.08)
    }
    tl.to(el.querySelector('.ov-bg'), { autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' }, 0.42)
  }, [activeId, shownId, finish, sourceRef])

  const step = useCallback((direction: number) => {
    if (!shownId) return
    const index = objects.findIndex((item) => item.id === shownId)
    showObject(objects[(index + direction + objects.length) % objects.length].id)
  }, [shownId, showObject])

  useEffect(() => {
    if (!activeId) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeObject()
      else if (event.key === 'ArrowRight') step(1)
      else if (event.key === 'ArrowLeft') step(-1)
      else if (root.current) trapFocus(event, root.current)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId, closeObject, step])

  if (!object) return null
  const image: ImageEntry = images[object.image]
  const owned = inCart(object.id)
  const rows: [string, string][] = [
    ['Date', object.date], ['Origin', object.origin], ['Material', object.material],
    ['Dimensions', object.dimensions], ['Condition', object.condition],
  ]

  return (
    <div className="ov" ref={root} role="dialog" aria-modal="true" aria-labelledby="ov-title">
      <div className="ov-bg" />
      <div className="ov-media" ref={media}>
        <img src={imageUrl(object.image, 2000)} srcSet={imageSrcSet(object.image)} sizes="(min-width: 900px) 62vw, 100vw" alt={image.alt} style={image.focus ? { objectPosition: image.focus } : undefined} />
      </div>
      <div className="ov-info" data-lenis-prevent>
        <div className="ov-top" data-ov>
          <span className="mono">{object.id}</span>
          <button type="button" className="ov-close" onClick={closeObject}>Close</button>
        </div>
        <div className="ov-body">
          <p className="mono ov-col" data-ov>{collectionById(object.collection).name}</p>
          <h2 id="ov-title" className="ov-title" data-ov>{object.title}</h2>
          <p className="ov-note" data-ov>{object.note}</p>
          <dl className="ov-spec">
            {rows.map(([label, value]) => <div key={label} data-ov><dt className="mono">{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </div>
        <div className="ov-buy" data-ov>
          <span className="ov-price">{formatPrice(object.price)}</span>
          <button
            type="button"
            className="btn"
            onClick={() => { if (owned) { closeObject(); setDrawerOpen(true) } else addToCart(object.id) }}
          >{owned ? 'In cart, view' : 'Add to cart'}</button>
        </div>
        <div className="ov-step mono" data-ov>
          <button type="button" onClick={() => step(-1)}>Previous</button>
          <span>{objects.findIndex((item) => item.id === object.id) + 1} / {objects.length}</span>
          <button type="button" onClick={() => step(1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
