import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { objectById, type ArchiveObject } from '../data/objects'

const KEY = 'archive-001-cart'

function loadCart(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string' && !!objectById(id)) : []
  } catch { return [] }
}

interface Store {
  cart: ArchiveObject[]
  inCart: (id: string) => boolean
  addToCart: (id: string) => void
  removeFromCart: (id: string) => void
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  activeId: string | null
  sourceRef: RefObject<HTMLElement | null>
  openObject: (id: string, source?: HTMLElement | null) => void
  showObject: (id: string) => void
  closeObject: () => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState(loadCart)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const sourceRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* storage is optional */ }
  }, [ids])

  const addToCart = useCallback((id: string) => setIds((list) => (list.includes(id) ? list : [...list, id])), [])
  const removeFromCart = useCallback((id: string) => setIds((list) => list.filter((item) => item !== id)), [])
  const openObject = useCallback((id: string, source?: HTMLElement | null) => {
    sourceRef.current = source ?? null
    setActiveId(id)
  }, [])
  const showObject = useCallback((id: string) => { sourceRef.current = null; setActiveId(id) }, [])
  const closeObject = useCallback(() => setActiveId(null), [])

  const value = useMemo<Store>(() => ({
    cart: ids.map((id) => objectById(id)!),
    inCart: (id) => ids.includes(id),
    addToCart, removeFromCart, drawerOpen, setDrawerOpen, activeId, sourceRef, openObject, showObject, closeObject,
  }), [ids, addToCart, removeFromCart, drawerOpen, activeId, openObject, showObject, closeObject])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreProvider')
  return store
}
