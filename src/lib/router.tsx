import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { EASE, gsap, reducedMotion, ScrollTrigger, scrollToTop, setEntranceDelay } from './motion'

export type Path = '/' | '/archive'
interface Location { path: Path; search: string }
interface Router extends Location { navigate: (to: string) => void }

const RouterContext = createContext<Router | null>(null)
const readLocation = (): Location => ({
  path: window.location.pathname.startsWith('/archive') ? '/archive' : '/',
  search: window.location.search,
})

function playShutter(label: string, swap: () => void, done: () => void) {
  const shutter = document.querySelector<HTMLElement>('.shutter')
  if (!shutter || reducedMotion()) { swap(); scrollToTop(); ScrollTrigger.refresh(); done(); return }
  const columns = shutter.querySelectorAll('i')
  const text = shutter.querySelector<HTMLElement>('.shutter-label span')!
  text.textContent = label
  setEntranceDelay(0.62)
  gsap.timeline({ onComplete: () => { gsap.set(shutter, { visibility: 'hidden' }); done() } })
    .set(shutter, { visibility: 'visible' })
    .fromTo(columns, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.72, ease: EASE.inOut, stagger: 0.045 })
    .fromTo(text, { yPercent: 110 }, { yPercent: 0, duration: 0.55, ease: EASE.out }, 0.34)
    .add(() => { scrollToTop(); swap(); ScrollTrigger.refresh() })
    .to(text, { yPercent: -110, duration: 0.42, ease: EASE.inOut }, '+=0.08')
    .set(columns, { transformOrigin: '50% 0%' })
    .to(columns, { scaleY: 0, duration: 0.78, ease: EASE.inOut, stagger: 0.045 }, '-=0.16')
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(readLocation)
  const current = useRef(location)
  const busy = useRef(false)
  current.current = location

  const change = useCallback((next: Location, push: string | null) => {
    const apply = () => {
      if (push) window.history.pushState({}, '', push)
      flushSync(() => setLocation(next))
    }
    if (next.path === current.current.path) { apply(); return }
    if (busy.current) return
    busy.current = true
    playShutter(next.path === '/archive' ? 'Entering the index' : 'Archive 001', apply, () => { busy.current = false })
  }, [])

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin)
    const next: Location = { path: url.pathname.startsWith('/archive') ? '/archive' : '/', search: url.search }
    if (next.path === current.current.path && next.search === current.current.search) { scrollToTop(); return }
    change(next, url.pathname + url.search)
  }, [change])

  useEffect(() => {
    const onPop = () => change(readLocation(), null)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [change])

  const value = useMemo(() => ({ ...location, navigate }), [location, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const router = useContext(RouterContext)
  if (!router) throw new Error('useRouter must be used inside RouterProvider')
  return router
}
