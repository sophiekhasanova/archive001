/**
 * Central image registry. To replace a photo with a local asset, set `local`
 * (for example `local: '/objects/reel.jpg'`). Nothing else needs to change.
 */
export interface ImageEntry {
  photo: string
  page: string
  width: number
  height: number
  alt: string
  focus?: string
  local?: string
}

const entry = (photo: string, page: string, width: number, height: number, alt: string, focus?: string): ImageEntry => ({
  photo, page: `https://unsplash.com/photos/${page}`, width, height, alt, focus,
})

export const images = {
  reel: entry('1526708286628-e9e0b57f84fa', 'mwWZTLr9Tcg', 8256, 6192, 'Twin-reel machine with copper hubs on a black ground'),
  silverCamera: entry('1672186565554-83b4f85a7634', 'FdNi_4Jg3_E', 4928, 3264, 'Silver 35mm camera on a black ground'),
  reflex: entry('1761701389990-31c503f130a0', 'lqqSwKfkCig', 2991, 2240, 'Reflex camera under green light'),
  rangefinder: entry('1643635739259-a9b21a9d9b11', 'wRcL-3QN7VM', 8077, 5385, 'Rangefinder camera on a dark table'),
  projector: entry('1568876694728-451bbf694b83', 'SnXIF8_2oPw', 5590, 3144, 'Monochrome cinema projector spools'),
  typewriter: entry('1758483225009-097478350b9e', 'S0rG5EpxiLA', 6000, 4000, 'Portable typewriter holding a blank sheet'),
  valve: entry('1776244957134-07b3b1b53662', 'UkE0KTiBtok', 6240, 4160, 'Glass vacuum tube among black control knobs'),
  synth: entry('1761503588211-1ba834b55b48', 'vJPZ4Gy6RZM', 5184, 3456, 'Synthesizer panel with knobs and amber switches'),
  radio: entry('1573154622954-b5fae2c1eed8', 'idwpKeO-ZWk', 5712, 2507, 'Brown transistor radio with an illuminated dial', '35% 50%'),
  surveyor: entry('1780246032224-efa538f1def7', 'PSK74ybL9b8', 4864, 3648, 'Brass surveying instrument on polished wood'),
  microscope: entry('1763066472871-a49d025f9f64', 'CzrgXZEhg_M', 5735, 3823, 'Brass microscope beside a red wooden box', '70% 50%'),
  tide: entry('1786294112123-344d5faa0d6a', 'Vi6-zFxM-Us', 2080, 3120, 'Brass mechanical tide predictor with gears'),
  telegraph: entry('1785908497617-efd4665a18b4', 'k9rwcGU_NcY', 6016, 4016, 'Telegraph apparatus on a wooden board'),
  globe: entry('1784466505225-1c5c04afddbb', 'jV-pxYr-qsY', 6726, 4484, 'Two antique library globes in a dim room', '26% 50%'),
  dials: entry('1764250244454-e063cef0f730', 'tKDrBCMrsy0', 3000, 1967, 'Two round instruments in a wooden case'),
  ore: entry('1648079363698-367afe62e118', 'wDLZZs61hn8', 2160, 2700, 'Blue and yellow mineral on black'),
  quartz: entry('1726925998496-55604c88910b', 'SxwG6PLOc44', 4966, 3639, 'Clear quartz crystal cluster'),
  crystal: entry('1562162135-9f64f33e623b', '-XvhrIC1Mhc', 4497, 3653, 'Spray of clear crystal on black'),
  amethyst: entry('1643884132093-d995d75a7e67', 'NP7wGviTS64', 2848, 4288, 'Large violet crystal on black'),
  ammonite: entry('1711075781376-bc5107736730', 'MNEGikPGkAM', 5407, 3605, 'Ribbed spiral ammonite on black'),
  section: entry('1631631648875-87ba160d9329', 'rJUw_UwK-44', 3005, 3999, 'Sectioned ammonite showing its chambers'),
  nacre: entry('1730454978813-7064ddca416d', 'NzXFLzFwCzk', 5088, 3392, 'Polished ammonite with amber chambers'),
  leaf: entry('1756421637113-92fd5851820f', 'ncb07qxfYHQ', 6000, 4000, 'Skeletonised leaf on black'),
  knots: entry('1786835567881-97c8e5d975a2', '46NBK1Ws1Vw', 5590, 3727, 'Three curved silver metal sculptures'),
  portrait: entry('1620745899139-041867b2a477', '0AnQmPN-MPM', 8793, 5264, 'Carved faces emerging from a black surface'),
  relief: entry('1710545436279-c5e59df85fcd', 'YuHqVEv02ZA', 3840, 2160, 'Black and gold carved relief'),
  planar: entry('1737265396686-00377dcd99d0', 'AUkltwaacmA', 4000, 6000, 'Monochrome angular lamp'),
  lamella: entry('1737916067060-bb8b532cb64f', 'RyohALL22jM', 5184, 3456, 'Ribbed black sculptural chair'),
  stacked: entry('1726910133626-9b573eca70ff', 'VfOGf5RWkeg', 4050, 2700, 'Black curved stacked form'),
} satisfies Record<string, ImageEntry>

export type ImageKey = keyof typeof images

const WIDTHS = [640, 960, 1400, 2000, 2800]

export function imageUrl(key: ImageKey, width = 1400): string {
  const image: ImageEntry = images[key]
  if (image.local) return image.local
  return `https://images.unsplash.com/photo-${image.photo}?auto=format&fit=max&q=82&w=${Math.min(width, image.width)}`
}

export function imageSrcSet(key: ImageKey): string | undefined {
  const image: ImageEntry = images[key]
  if (image.local) return undefined
  return WIDTHS.filter((w) => w <= image.width).map((w) => `${imageUrl(key, w)} ${w}w`).join(', ')
}
