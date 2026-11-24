import { images, imageSrcSet, imageUrl, type ImageEntry, type ImageKey } from '../data/images'

interface Props {
  image: ImageKey
  sizes?: string
  parallax?: number
  eager?: boolean
  reveal?: boolean
  className?: string
}

export function Media({ image, sizes = '50vw', parallax = 0, eager = false, reveal = true, className = '' }: Props) {
  const entry: ImageEntry = images[image]
  return (
    <div className={`media ${className}`} data-reveal={reveal ? '' : undefined}>
      <div className="media-in" data-parallax={parallax || undefined} style={parallax ? { inset: `-${parallax}% 0` } : undefined}>
        <img
          src={imageUrl(image)}
          srcSet={imageSrcSet(image)}
          sizes={sizes}
          alt={entry.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={entry.focus ? { objectPosition: entry.focus } : undefined}
        />
      </div>
    </div>
  )
}
