import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ObjectCard } from '../components/ObjectCard'
import { imageUrl } from '../data/images'
import { collectionById, collections, eras, formatPrice, objects, type CollectionId, type Era } from '../data/objects'
import { EASE, Flip, getEntranceDelay, gsap, reducedMotion, revealAll, ScrollTrigger, SplitText } from '../lib/motion'
import { useRouter } from '../lib/router'
import { useStore } from '../store/store'

type Sort = 'accession' | 'oldest' | 'newest' | 'low' | 'high'
type View = 'gallery' | 'ledger'

const sorts: [Sort, string][] = [['accession', 'Accession'], ['oldest', 'Oldest'], ['newest', 'Newest'], ['low', 'Price, low'], ['high', 'Price, high']]
const slots = [
  { c: '1 / span 7', a: '4 / 3' }, { c: '9 / span 4', a: '4 / 5' }, { c: '2 / span 4', a: '4 / 5' }, { c: '7 / span 6', a: '3 / 2' },
  { c: '1 / span 5', a: '1 / 1' }, { c: '6 / span 3', a: '3 / 4' }, { c: '9 / span 4', a: '1 / 1' }, { c: '3 / span 8', a: '16 / 10' },
]

const readCollection = (search: string): CollectionId | 'all' => {
  const value = new URLSearchParams(search).get('c')
  return collections.some((c) => c.id === value) ? (value as CollectionId) : 'all'
}

export default function Archive() {
  const { search } = useRouter()
  const { openObject } = useStore()
  const [query, setQuery] = useState('')
  const [collection, setCollection] = useState<CollectionId | 'all'>(() => readCollection(search))
  const [era, setEra] = useState<Era | 'all'>('all')
  const [sort, setSort] = useState<Sort>('accession')
  const [view, setView] = useState<View>('gallery')
  const root = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const flipTween = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => { setCollection(readCollection(search)) }, [search])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = objects.filter((o) => {
      if (collection !== 'all' && o.collection !== collection) return false
      if (era !== 'all' && o.era !== era) return false
      if (!term) return true
      return [o.id, o.title, o.origin, o.material, o.date, collectionById(o.collection).name].join(' ').toLowerCase().includes(term)
    })
    const sorted = [...list]
    if (sort === 'oldest') sorted.sort((a, b) => a.sortYear - b.sortYear)
    if (sort === 'newest') sorted.sort((a, b) => b.sortYear - a.sortYear)
    if (sort === 'low') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'high') sorted.sort((a, b) => b.price - a.price)
    return sorted
  }, [query, collection, era, sort])

  const capture = () => {
    if (reducedMotion() || view !== 'gallery') return
    flipTween.current?.progress(1)
    flipState.current = Flip.getState(root.current!.querySelectorAll('.a-card'))
  }

  useLayoutEffect(() => {
    const el = root.current!
    const delay = getEntranceDelay()
    const ctx = gsap.context(() => {
      revealAll(el)
      gsap.set('.a-title', { autoAlpha: 1 })
      if (reducedMotion()) return
      SplitText.create('.a-title', {
        type: 'chars', mask: 'chars', autoSplit: true,
        onSplit: (self) => gsap.from(self.chars, { yPercent: 118, duration: 1.3, ease: EASE.out, stagger: 0.04, delay: delay + 0.08 }),
      })
      gsap.from('[data-a]', { y: 20, autoAlpha: 0, duration: 0.95, ease: EASE.out, stagger: 0.06, delay: delay + 0.42 })
    }, el)
    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const state = flipState.current
    flipState.current = null
    if (state && view === 'gallery') {
      flipTween.current = Flip.from(state, {
        targets: root.current!.querySelectorAll('.a-card'),
        duration: 0.95, ease: EASE.inOut, absolute: true, stagger: 0.012, prune: true,
        onEnter: (items) => gsap.fromTo(items, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.out, delay: 0.25 }),
        onComplete: () => ScrollTrigger.refresh(),
      })
    } else {
      ScrollTrigger.refresh()
    }
  }, [results, view])

  const clear = () => { capture(); setQuery(''); setCollection('all'); setEra('all') }
  const filtered = query || collection !== 'all' || era !== 'all'

  return (
    <div className="arc" ref={root}>
      <header className="a-head">
        <h1 className="a-title">Index</h1>
        <p className="a-count" data-a aria-live="polite"><span>{String(results.length).padStart(3, '0')}</span><small className="mono">of {String(objects.length).padStart(3, '0')} objects</small></p>
        <label className="a-search" data-a>
          <span className="mono">Search</span>
          <input type="search" value={query} placeholder="Brass, Jurassic, Japan…" onChange={(e) => { capture(); setQuery(e.target.value) }} />
        </label>
      </header>

      <div className="a-filters">
        <div className="f-row" data-a role="group" aria-label="Filter by collection">
          <span className="mono f-label">Collection</span>
          <div className="f-opts">
            {[{ id: 'all' as const, name: 'All' }, ...collections].map((c) => (
              <button type="button" key={c.id} aria-pressed={collection === c.id} onClick={() => { capture(); setCollection(c.id) }}>{c.name}</button>
            ))}
          </div>
        </div>
        <div className="f-row" data-a role="group" aria-label="Filter by era">
          <span className="mono f-label">Era</span>
          <div className="f-opts">
            {(['all', ...eras] as const).map((e) => (
              <button type="button" key={e} aria-pressed={era === e} onClick={() => { capture(); setEra(e) }}>{e === 'all' ? 'All' : e}</button>
            ))}
          </div>
        </div>
        <div className="f-row" data-a role="group" aria-label="Sort and view">
          <span className="mono f-label">Sort</span>
          <div className="f-opts">
            {sorts.map(([id, label]) => <button type="button" key={id} aria-pressed={sort === id} onClick={() => { capture(); setSort(id) }}>{label}</button>)}
          </div>
          <div className="f-view mono">
            <button type="button" aria-pressed={view === 'gallery'} onClick={() => setView('gallery')}>Gallery</button>
            <button type="button" aria-pressed={view === 'ledger'} onClick={() => setView('ledger')}>Ledger</button>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="a-empty">
          <p className="display">Nothing under <em>that name</em></p>
          <button type="button" className="btn btn-line" onClick={clear}>Clear filters</button>
        </div>
      ) : view === 'gallery' ? (
        <div className="a-grid">
          {results.map((object, i) => {
            const slot = slots[i % slots.length]
            return <ObjectCard key={object.id} object={object} className="a-card" reveal={false} sizes="(min-width: 900px) 50vw, 100vw" style={{ '--c': slot.c, '--a': slot.a } as React.CSSProperties} />
          })}
        </div>
      ) : (
        <ol className="ledger">
          {results.map((object) => (
            <li key={object.id}>
              <button type="button" data-cursor="View" onClick={(e) => openObject(object.id, e.currentTarget.querySelector('img'))}>
                <img src={imageUrl(object.image, 240)} alt="" loading="lazy" />
                <span className="mono l-id">{object.id}</span>
                <span className="l-title">{object.title}</span>
                <span className="l-col">{collectionById(object.collection).name}</span>
                <span className="mono l-date">{object.date}</span>
                <span className="l-price">{formatPrice(object.price)}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
      {filtered && results.length > 0 && <button type="button" className="a-clear mono" onClick={clear}>Clear filters</button>}
    </div>
  )
}
