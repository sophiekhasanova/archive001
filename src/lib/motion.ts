import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { Flip } from 'gsap/Flip'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(CustomEase, Flip, ScrollSmoother, ScrollTrigger, SplitText)
CustomEase.create('archive-io', '0.76,0,0.18,1')
CustomEase.create('archive-out', '0.16,1,0.3,1')

export const EASE = { inOut: 'archive-io', out: 'archive-out' }
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let smoother: ScrollSmoother | null = null
let entranceDelay = reducedMotion() ? 0 : 2.05

export const getEntranceDelay = () => entranceDelay
export const setEntranceDelay = (value: number) => { entranceDelay = reducedMotion() ? 0 : value }

export function initSmoother() {
  if (reducedMotion()) return
  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 0.75,
    smoothTouch: false,
    ignoreMobileResize: true,
  })
}

export function scrollToTop() {
  if (smoother) smoother.scrollTop(0)
  else window.scrollTo(0, 0)
}

const scrollLocks = new Set<string>()

export function lockScroll(owner: 'overlay' | 'drawer', locked: boolean) {
  if (locked) scrollLocks.add(owner)
  else scrollLocks.delete(owner)
  const active = scrollLocks.size > 0
  smoother?.paused(active)
  document.documentElement.classList.toggle('is-locked', active)
}

/** Applies the shared line, image and parallax treatments inside a page. */
export function revealAll(root: HTMLElement) {
  const reduced = reducedMotion()

  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    gsap.set(el, { autoAlpha: 1 })
    if (reduced) return
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 112,
        duration: 1.25,
        ease: EASE.out,
        stagger: 0.085,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      }),
    })
  })

  if (reduced) return

  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const image = el.querySelector('img')
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.45, ease: EASE.inOut, clearProps: 'clipPath' })
    if (image) tl.fromTo(image, { scale: 1.28 }, { scale: 1, duration: 1.9, ease: EASE.out, clearProps: 'transform' }, 0.1)
  })

  root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax)
    const travel = (amount / (100 + amount * 2)) * 100
    gsap.fromTo(el, { yPercent: -travel }, {
      yPercent: travel,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
}

export function trapFocus(event: KeyboardEvent, root: HTMLElement) {
  if (event.key !== 'Tab') return
  const items = [...root.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input')]
    .filter((item) => item.offsetParent !== null)
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}

export { Flip, gsap, ScrollTrigger, SplitText }
