import type { ImageKey } from './images'

export type CollectionId = 'technology' | 'analog' | 'artifacts' | 'specimens' | 'design' | 'art'
export type Era = 'Deep Time' | 'Before 1900' | '1900–1949' | '1950–1979' | 'Contemporary'

export interface Collection { id: CollectionId; name: string; line: string; image: ImageKey }

export interface ArchiveObject {
  id: string
  title: string
  collection: CollectionId
  era: Era
  date: string
  sortYear: number
  origin: string
  material: string
  dimensions: string
  condition: string
  price: number
  image: ImageKey
  note: string
}

export const collections: Collection[] = [
  { id: 'technology', name: 'Vintage Technology', line: 'Machines for seeing and writing', image: 'silverCamera' },
  { id: 'analog', name: 'Analog Equipment', line: 'Signal, carried by hand', image: 'reel' },
  { id: 'artifacts', name: 'Historical Artifacts', line: 'Instruments of measure', image: 'globe' },
  { id: 'specimens', name: 'Natural Specimens', line: 'Made without intention', image: 'ammonite' },
  { id: 'design', name: 'Designer Objects', line: 'Form under discipline', image: 'lamella' },
  { id: 'art', name: 'Contemporary Art', line: 'Work that refuses a function', image: 'portrait' },
]

type Row = Omit<ArchiveObject, 'id'>
const rows: Row[] = [
  { title: 'Twin-Reel Transport', collection: 'analog', era: '1950–1979', date: '1968', sortYear: 1968, origin: 'West Germany', material: 'Steel, copper, lacquer', dimensions: '42 × 38 × 19 cm', condition: 'Serviced, fully working', price: 4800, image: 'reel', note: 'Built for broadcast rooms, this transport moves tape with an evenness that later machines rarely matched. The copper hubs have darkened where decades of hands reached for them.' },
  { title: 'Silver Body 35', collection: 'technology', era: '1950–1979', date: '1961', sortYear: 1961, origin: 'Japan', material: 'Chromed brass, leatherette, glass', dimensions: '14 × 9 × 8 cm', condition: 'Shutter accurate, light brassing', price: 1450, image: 'silverCamera', note: 'A compact mechanical camera that needs no battery and asks for no opinion. Its weight is the first thing anyone remarks on.' },
  { title: 'Dresden Reflex', collection: 'technology', era: '1950–1979', date: '1974', sortYear: 1974, origin: 'East Germany', material: 'Alloy, leatherette, optical glass', dimensions: '15 × 10 × 9 cm', condition: 'Working, clean optics', price: 980, image: 'reflex', note: 'A product of a precision industry working behind a closed border. The lens renders with a slight, unmistakable softness at full aperture.' },
  { title: 'Rangefinder No. 7', collection: 'technology', era: '1950–1979', date: '1972', sortYear: 1972, origin: 'Japan', material: 'Chromed alloy, glass', dimensions: '14 × 8 × 7 cm', condition: 'Excellent, bright viewfinder', price: 1280, image: 'rangefinder', note: 'Quiet enough to use during a recital. It was made for people who preferred not to be noticed taking a photograph.' },
  { title: 'Cinema Spool Assembly', collection: 'technology', era: '1950–1979', date: 'c. 1952', sortYear: 1952, origin: 'France', material: 'Cast aluminium, steel', dimensions: '61 × 44 × 30 cm', condition: 'Display condition', price: 3600, image: 'projector', note: 'Salvaged from a provincial cinema when it converted to digital projection. The spools still turn with a long, heavy inertia.' },
  { title: 'Portable Writing Machine', collection: 'design', era: '1950–1979', date: '1958', sortYear: 1958, origin: 'Italy', material: 'Enamelled steel, rubber', dimensions: '33 × 32 × 13 cm', condition: 'Restored, new ribbon', price: 1650, image: 'typewriter', note: 'Industrial design at the moment it became a cultural ambition. Every key returns with a crisp, slightly theatrical snap.' },
  { title: 'Valve Preamplifier', collection: 'analog', era: '1950–1979', date: '1963', sortYear: 1963, origin: 'United Kingdom', material: 'Steel chassis, glass valve', dimensions: '28 × 22 × 16 cm', condition: 'Recapped, working', price: 2900, image: 'valve', note: 'A single exposed valve glows at the centre of the circuit. It takes a full minute to warm up and rewards the wait.' },
  { title: 'Modular Voltage Panel', collection: 'analog', era: '1950–1979', date: '1979', sortYear: 1979, origin: 'United States', material: 'Anodised aluminium, bakelite', dimensions: '48 × 26 × 12 cm', condition: 'Calibrated, minor wear', price: 5400, image: 'synth', note: 'An instrument with no presets and no memory. Each sound exists only until someone moves a dial.' },
  { title: 'Walnut Transistor Receiver', collection: 'analog', era: '1950–1979', date: '1957', sortYear: 1957, origin: 'Netherlands', material: 'Walnut veneer, brass, glass', dimensions: '31 × 18 × 11 cm', condition: 'Working, original dial', price: 720, image: 'radio', note: 'The dial still lists stations that stopped broadcasting long ago, a small map of a vanished airwave.' },
  { title: 'Brass Surveying Level', collection: 'artifacts', era: 'Before 1900', date: 'c. 1890', sortYear: 1890, origin: 'England', material: 'Lacquered brass, glass', dimensions: '38 × 14 × 22 cm', condition: 'Fine, original patina', price: 3200, image: 'surveyor', note: 'Used to set the gradients of railway lines. Its accuracy remains well within what its maker promised.' },
  { title: 'Compound Microscope', collection: 'artifacts', era: 'Before 1900', date: '1884', sortYear: 1884, origin: 'Germany', material: 'Brass, steel, mahogany case', dimensions: '32 × 15 × 15 cm', condition: 'Complete with case', price: 4200, image: 'microscope', note: 'Supplied to a teaching laboratory and kept with its fitted case. Faint pencil notes remain inside the lid.' },
  { title: 'Tidal Calculating Train', collection: 'artifacts', era: '1900–1949', date: 'c. 1910', sortYear: 1910, origin: 'Scotland', material: 'Brass, steel', dimensions: '86 × 40 × 120 cm', condition: 'Conserved, static', price: 28500, image: 'tide', note: 'A mechanical computer that summed the motion of moon and sun to forecast the sea. It is the most improbable object in the collection.' },
  { title: 'Telegraph Station', collection: 'artifacts', era: '1900–1949', date: '1902', sortYear: 1902, origin: 'United States', material: 'Brass, oak, copper wire', dimensions: '46 × 30 × 18 cm', condition: 'Complete, wired', price: 2400, image: 'telegraph', note: 'A complete key and sounder on its original board. The worn key shows the exact place one operator rested a finger.' },
  { title: 'Pair of Library Globes', collection: 'artifacts', era: 'Before 1900', date: 'c. 1820', sortYear: 1820, origin: 'Low Countries', material: 'Engraved paper, plaster, carved wood', dimensions: '72 × 48 × 48 cm each', condition: 'Stable, old restorations', price: 36000, image: 'globe', note: 'One charts the earth and the other the heavens, as library pairs traditionally did. Old varnish has aged both to a soft amber.' },
  { title: 'Cased Pair of Dials', collection: 'artifacts', era: '1900–1949', date: '1911', sortYear: 1911, origin: 'England', material: 'Brass, glass, mahogany', dimensions: '34 × 18 × 9 cm', condition: 'Very good', price: 1900, image: 'dials', note: 'Two matched instruments kept side by side so that each could check the other.' },
  { title: 'Iridescent Ore', collection: 'specimens', era: 'Deep Time', date: 'Precambrian', sortYear: -1000000000, origin: 'Labrador, Canada', material: 'Mineral', dimensions: '11 × 9 × 6 cm', condition: 'Natural', price: 640, image: 'ore', note: 'Blue and gold appear only at certain angles, then vanish as the stone turns.' },
  { title: 'Quartz Cluster', collection: 'specimens', era: 'Deep Time', date: 'Cretaceous', sortYear: -100000000, origin: 'Arkansas, USA', material: 'Quartz', dimensions: '24 × 18 × 14 cm', condition: 'Natural, minor tip wear', price: 1350, image: 'quartz', note: 'Grown slowly in a hydrothermal vein. Each termination formed without interference from its neighbours.' },
  { title: 'Rock Crystal Spray', collection: 'specimens', era: 'Deep Time', date: 'Miocene', sortYear: -15000000, origin: 'Minas Gerais, Brazil', material: 'Rock crystal', dimensions: '16 × 15 × 12 cm', condition: 'Natural', price: 880, image: 'crystal', note: 'Needles radiate from a single point like a frozen detonation.' },
  { title: 'Amethyst Point', collection: 'specimens', era: 'Deep Time', date: 'Cretaceous', sortYear: -130000000, origin: 'Artigas, Uruguay', material: 'Amethyst', dimensions: '19 × 11 × 10 cm', condition: 'Polished', price: 2100, image: 'amethyst', note: 'The violet deepens toward the tip, recording a change in the fluid that formed it.' },
  { title: 'Ribbed Ammonite', collection: 'specimens', era: 'Deep Time', date: 'Jurassic', sortYear: -180000000, origin: 'Dorset, England', material: 'Fossilised shell', dimensions: '17 × 15 × 5 cm', condition: 'Prepared', price: 1120, image: 'ammonite', note: 'A logarithmic spiral preserved for a hundred and eighty million years, with every rib intact.' },
  { title: 'Sectioned Ammonite', collection: 'specimens', era: 'Deep Time', date: 'Cretaceous', sortYear: -110000000, origin: 'Mahajanga, Madagascar', material: 'Fossil, calcite', dimensions: '14 × 11 × 3 cm', condition: 'Cut and polished', price: 780, image: 'section', note: 'Cut through its centre to reveal the chambers the animal used to control its buoyancy.' },
  { title: 'Nacreous Ammonite', collection: 'specimens', era: 'Deep Time', date: 'Cretaceous', sortYear: -105000000, origin: 'Mahajanga, Madagascar', material: 'Fossil, aragonite', dimensions: '21 × 18 × 6 cm', condition: 'Polished', price: 2650, image: 'nacre', note: 'Suture lines branch across the shell like a river system seen from altitude.' },
  { title: 'Skeleton Leaf', collection: 'specimens', era: 'Contemporary', date: '2021', sortYear: 2021, origin: 'Kyoto, Japan', material: 'Pressed leaf, archival mount', dimensions: '30 × 24 cm framed', condition: 'Fragile, mounted', price: 340, image: 'leaf', note: 'Insects consumed everything except the structure. What remains is a diagram of the leaf.' },
  { title: 'Three Knots', collection: 'art', era: 'Contemporary', date: '2022', sortYear: 2022, origin: 'Oslo, Norway', material: 'Cast silver alloy', dimensions: '26 × 9 × 9 cm each', condition: 'As made', price: 9800, image: 'knots', note: 'Three attempts at the same gesture, cast in metal so that none of them could be corrected.' },
  { title: 'Double Portrait', collection: 'art', era: 'Contemporary', date: '2019', sortYear: 2019, origin: 'Athens, Greece', material: 'Patinated bronze resin', dimensions: '80 × 48 × 12 cm', condition: 'As made', price: 14500, image: 'portrait', note: 'Two faces surface from one dark plane, close enough to speak and turned away from each other.' },
  { title: 'Black Relief No. 3', collection: 'art', era: 'Contemporary', date: '2023', sortYear: 2023, origin: 'Antwerp, Belgium', material: 'Carved limewood, gilding', dimensions: '60 × 60 × 8 cm', condition: 'As made', price: 7200, image: 'relief', note: 'Gold is applied only where light would naturally catch, so the work seems to be lit from within.' },
  { title: 'Planar Light', collection: 'design', era: 'Contemporary', date: '2018', sortYear: 2018, origin: 'Milan, Italy', material: 'Blackened steel, opal glass', dimensions: '58 × 22 × 22 cm', condition: 'Limited edition, 12 of 40', price: 3900, image: 'planar', note: 'A lamp reduced to the planes that hold and hide its source.' },
  { title: 'Lamella Chair', collection: 'design', era: 'Contemporary', date: '2020', sortYear: 2020, origin: 'Copenhagen, Denmark', material: 'Stained ash', dimensions: '78 × 64 × 70 cm', condition: 'Studio prototype', price: 8600, image: 'lamella', note: 'Thin ribs of steam-bent ash carry the load together. No single piece could support a person alone.' },
  { title: 'Stacked Form', collection: 'design', era: 'Contemporary', date: '2024', sortYear: 2024, origin: 'Rotterdam, Netherlands', material: 'Lacquered plywood', dimensions: '44 × 70 × 30 cm', condition: 'As made', price: 5100, image: 'stacked', note: 'A study in repetition that shifts from solid to transparent as you walk around it.' },
]

export const objects: ArchiveObject[] = rows.map((row, i) => ({ ...row, id: `A001-${String(i + 1).padStart(4, '0')}` }))
export const eras: Era[] = ['Deep Time', 'Before 1900', '1900–1949', '1950–1979', 'Contemporary']
export const objectById = (id: string) => objects.find((o) => o.id === id)
export const collectionById = (id: CollectionId) => collections.find((c) => c.id === id)!
export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
