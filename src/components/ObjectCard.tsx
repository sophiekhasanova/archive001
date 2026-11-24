import type { CSSProperties } from 'react'
import { formatPrice, type ArchiveObject } from '../data/objects'
import { useStore } from '../store/store'
import { Media } from './Media'

interface Props {
  object: ArchiveObject
  sizes?: string
  parallax?: number
  className?: string
  style?: CSSProperties
  reveal?: boolean
}

export function ObjectCard({ object, sizes, parallax, className = '', style, reveal = true }: Props) {
  const { openObject } = useStore()
  return (
    <button
      type="button"
      className={`card ${className}`}
      style={style}
      data-cursor="View"
      data-flip-id={object.id}
      aria-label={`View ${object.title}, ${formatPrice(object.price)}`}
      onClick={(event) => openObject(object.id, event.currentTarget.querySelector<HTMLElement>('.media'))}
    >
      <Media image={object.image} sizes={sizes} parallax={parallax} reveal={reveal} />
      <span className="card-cap">
        <span className="mono card-id">{object.id}</span>
        <span className="card-title">{object.title}</span>
        <span className="mono card-meta">{object.date}<b>{formatPrice(object.price)}</b></span>
      </span>
    </button>
  )
}
