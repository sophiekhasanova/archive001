import { useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import { Link } from '../components/Chrome'
import { Media } from '../components/Media'
import { ObjectCard } from '../components/ObjectCard'
import { imageUrl } from '../data/images'
import { collections, objectById, objects } from '../data/objects'
import { EASE, getEntranceDelay, gsap, reducedMotion, revealAll, SplitText } from '../lib/motion'
import { useRouter } from '../lib/router'
import { useStore } from '../store/store'

const featured = ['A001-0012', 'A001-0020', 'A001-0025', 'A001-0006', 'A001-0014', 'A001-0028'].map((id) => objectById(id)!)
const heroObject = objects[0]
const motionQuery = '(min-width: 900px) and (prefers-reduced-motion: no-preference)'

function Hero() {
  const { openObject } = useStore()
  return (
    <section className="hero">
      <button type="button" className="hero-media" data-cursor="View" aria-label={`View ${heroObject.title}`} onClick={(e) => openObject(heroObject.id, e.currentTarget.querySelector<HTMLElement>('.media'))}>
        <Media image={heroObject.image} sizes="(min-width: 900px) 72vw, 100vw" eager reveal={false} />
      </button>
      <h1 className="hero-title" aria-label="Archive 001">
        <span className="ht-a" aria-hidden="true">Archive</span>
        <span className="ht-b" aria-hidden="true">001</span>
      </h1>
      <p className="hero-lede" data-hero>A private collection of objects that outlived their purpose.</p>
      <p className="hero-cap mono" data-hero><span>{heroObject.id}</span><span>{heroObject.title}, {heroObject.date}</span></p>
      <p className="hero-scroll mono" data-hero>Scroll<i /></p>
    </section>
  )
}

function Manifesto() {
  return (
    <section className="manifesto">
      <p className="mono kicker">(01) The premise</p>
      <p className="manifesto-text">We collect what the world stopped making, stopped using, or never meant to make at all. Each object is examined, numbered and kept until it finds its next keeper.</p>
    </section>
  )
}

function Featured() {
  return (
    <section className="feat">
      <div className="feat-track">
        <div className="feat-intro">
          <p className="mono kicker">(02) Currently on view</p>
          <h2 className="display" data-split>Six objects, <em>held in the light</em></h2>
        </div>
        {featured.map((object, i) => (
          <ObjectCard key={object.id} object={object} className={`feat-card fc-${i}`} sizes="(min-width: 900px) 42vw, 92vw" reveal={false} />
        ))}
        <Link to="/archive" className="feat-end" cursor="Enter"><span className="mono">{objects.length} objects</span>Open the full index</Link>
      </div>
    </section>
  )
}

function CollectionsIndex() {
  const { navigate } = useRouter()
  const [active, setActive] = useState<number | null>(null)
  const section = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const moves = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null)

  useLayoutEffect(() => {
    moves.current = {
      x: gsap.quickTo(preview.current, 'x', { duration: 0.7, ease: 'power3' }),
      y: gsap.quickTo(preview.current, 'y', { duration: 0.7, ease: 'power3' }),
    }
  }, [])

  const onMove = (event: PointerEvent) => {
    const rect = section.current!.getBoundingClientRect()
    moves.current?.x(event.clientX - rect.left)
    moves.current?.y(event.clientY - rect.top)
  }

  return (
    <section className="cols" ref={section} onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      <div className="cols-head">
        <p className="mono kicker">(03) Six collections</p>
        <p className="cols-sub" data-split>Organised less by category than by the kind of attention each object asks for.</p>
      </div>
      <ol className="cols-list">
        {collections.map((collection, i) => (
          <li key={collection.id}>
            <button
              type="button"
              className={active !== null && active !== i ? 'is-dim' : ''}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => navigate(`/archive?c=${collection.id}`)}
              data-cursor="Open"
            >
              <span className="mono col-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="col-name">{collection.name}</span>
              <span className="col-line">{collection.line}</span>
              <span className="mono col-count">{String(objects.filter((o) => o.collection === collection.id).length).padStart(2, '0')}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className={`cols-preview ${active !== null ? 'is-on' : ''}`} ref={preview} aria-hidden="true">
        <div className="cols-frame">
          {collections.map((collection, i) => (
            <img key={collection.id} src={imageUrl(collection.image, 800)} alt="" loading="lazy" className={active === i ? 'is-on' : ''} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Editorial() {
  return (
    <section className="edit">
      <p className="mono kicker edit-kick">(04) Field notes, No. 1</p>
      <h2 className="display edit-title" data-split>On keeping <em>useless</em> things</h2>
      <div className="edit-tall"><Media image="globe" sizes="(min-width: 900px) 40vw, 92vw" parallax={9} /></div>
      <div className="edit-copy">
        <p data-split>A tide predictor no longer predicts anything. A telegraph key has nobody left to call. Yet neither has become less precise, less beautiful or less strange for having lost its job.</p>
        <p data-split>Retirement changes how an object is seen. Without a task to perform, its proportions, wear and small decisions finally come into view.</p>
      </div>
      <div className="edit-small"><Media image="tide" sizes="(min-width: 900px) 24vw, 60vw" parallax={7} /><p className="mono">A001-0012 / Tidal Calculating Train</p></div>
      <blockquote className="edit-quote" data-split>“The most valuable thing an object can do is remain.”</blockquote>
    </section>
  )
}

function Specimen() {
  return (
    <section className="spec">
      <div className="spec-frame"><Media image="nacre" sizes="100vw" reveal={false} /></div>
      <div className="spec-text">
        <p className="mono">A001-0022 / 105 million years</p>
        <h2 className="display">Nothing here was made to last. <em>It lasted anyway.</em></h2>
      </div>
    </section>
  )
}

function Provenance() {
  const steps = [
    ['Found', 'Sourced from estates, workshops, field collectors and retired institutions.'],
    ['Examined', 'Condition, age and history are recorded before anything is offered.'],
    ['Numbered', 'Every object receives a permanent accession number in the archive.'],
  ]
  return (
    <section className="prov">
      <p className="mono kicker">(05) Provenance</p>
      <div className="prov-grid">
        {steps.map(([title, text], i) => (
          <div key={title}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            <h3 data-split>{title}</h3>
            <p data-split>{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const delay = getEntranceDelay()
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      revealAll(el)
      const reduced = reducedMotion()
      gsap.set('.hero-title', { autoAlpha: 1 })

      if (!reduced) {
        ;['.ht-a', '.ht-b'].forEach((selector, i) => {
          SplitText.create(selector, {
            type: 'chars', mask: 'chars', autoSplit: true,
            onSplit: (self) => gsap.from(self.chars, { yPercent: 118, duration: 1.45, ease: EASE.out, stagger: 0.045, delay: delay + 0.12 + i * 0.22 }),
          })
        })
        gsap.fromTo('.hero-media', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: EASE.inOut, delay: delay - 0.25, clearProps: 'clipPath' })
        gsap.fromTo('.hero-media img', { scale: 1.34 }, { scale: 1, duration: 2.5, ease: EASE.out, delay: delay - 0.1 })
        gsap.from('[data-hero]', { y: 24, autoAlpha: 0, duration: 1.1, ease: EASE.out, stagger: 0.09, delay: delay + 0.85 })

        const heroScroll = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('.hero-media .media-in', { yPercent: 13, ease: 'none', scrollTrigger: heroScroll })
        gsap.to('.ht-a', { xPercent: -7, ease: 'none', scrollTrigger: heroScroll })
        gsap.to('.ht-b', { xPercent: 12, ease: 'none', scrollTrigger: heroScroll })

        const words = SplitText.create('.manifesto-text', { type: 'words' })
        gsap.fromTo(words.words, { opacity: 0.13 }, {
          opacity: 1, stagger: 0.05, ease: 'none',
          scrollTrigger: { trigger: '.manifesto-text', start: 'top 78%', end: 'bottom 48%', scrub: 0.6 },
        })

        gsap.fromTo('.spec-frame', { clipPath: 'inset(16% 24% 16% 24%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
          scrollTrigger: { trigger: '.spec', start: 'top top', end: '+=110%', scrub: true, pin: true, anticipatePin: 1 },
        })
        gsap.fromTo('.spec-frame img', { scale: 1.24 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.spec', start: 'top top', end: '+=110%', scrub: true } })
        gsap.from('.spec-text > *', { y: 36, autoAlpha: 0, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.spec', start: 'top -45%', end: '+=45%', scrub: true } })
      }

      mm.add(motionQuery, () => {
        const track = el.querySelector<HTMLElement>('.feat-track')!
        const distance = () => track.scrollWidth - window.innerWidth
        const slide = gsap.to(track, {
          x: () => -distance(), ease: 'none',
          scrollTrigger: { trigger: '.feat', start: 'top top', end: () => `+=${distance()}`, scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
        })
        el.querySelectorAll<HTMLElement>('.feat-card').forEach((card, i) => {
          const image = card.querySelector('img')
          gsap.fromTo(image, { xPercent: -7, scale: 1.16 }, { xPercent: 7, scale: 1.16, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true } })
          gsap.from(card.querySelector('.card-cap'), { y: 22 + i * 2, autoAlpha: 0, duration: 0.8, ease: EASE.out, scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left 78%', once: true } })
        })
      })
    }, el)
    return () => { mm.revert(); ctx.revert() }
  }, [])

  return (
    <div ref={root}>
      <Hero />
      <Manifesto />
      <Featured />
      <CollectionsIndex />
      <Editorial />
      <Specimen />
      <Provenance />
    </div>
  )
}
