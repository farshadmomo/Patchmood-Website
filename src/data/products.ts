export interface Product {
  id: string
  name: string
  slug: string
  mood: string
  shortDescription: string
  description: string
  price: number
  category: string
  tags: string[]
  featured: boolean
  gradient: string
  accentColor: string
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Dusk Reverie',
    slug: 'dusk-reverie',
    mood: 'Melancholic',
    shortDescription: 'When the day fades and thoughts linger.',
    description:
      'A muted palette of dusty rose and deep charcoal. Wear it when the world quiets and your mind does not. Structured fit, raw hem, breathes like an exhale.',
    price: 89,
    category: 'Patch Collection',
    tags: ['evening', 'introspective', 'muted'],
    featured: true,
    gradient: 'linear-gradient(145deg, oklch(0.22 0.09 310) 0%, oklch(0.48 0.11 355) 55%, oklch(0.32 0.06 20) 100%)',
    accentColor: 'oklch(0.72 0.14 355)',
  },
  {
    id: '2',
    name: 'Solar Flux',
    slug: 'solar-flux',
    mood: 'Euphoric',
    shortDescription: 'Warmth you can wear. Energy you can feel.',
    description:
      'Burnt amber bleeds into deep saffron. A piece for the mornings that feel like victories, for days you need to announce yourself before you speak.',
    price: 112,
    category: 'Patch Collection',
    tags: ['bold', 'warm', 'confident'],
    featured: false,
    gradient: 'linear-gradient(155deg, oklch(0.45 0.19 50) 0%, oklch(0.72 0.21 75) 50%, oklch(0.82 0.16 95) 100%)',
    accentColor: 'oklch(0.82 0.20 75)',
  },
  {
    id: '3',
    name: 'Still Water',
    slug: 'still-water',
    mood: 'Contemplative',
    shortDescription: 'Quiet depth. No need to explain.',
    description:
      'Deep teal dissolves into pale mist at the hem. Cut for stillness. Wear it when you want to observe without being observed.',
    price: 96,
    category: 'Patch Collection',
    tags: ['calm', 'deep', 'minimal'],
    featured: false,
    gradient: 'linear-gradient(165deg, oklch(0.22 0.10 215) 0%, oklch(0.40 0.09 200) 50%, oklch(0.62 0.05 210) 100%)',
    accentColor: 'oklch(0.62 0.10 200)',
  },
  {
    id: '4',
    name: 'Night Static',
    slug: 'night-static',
    mood: 'Restless',
    shortDescription: 'Too loud to sleep. Too tired to run.',
    description:
      "Electric indigo over raw coal. For 3am thoughts that won't settle. Oversized, heavy fabric, the kind of weight that grounds you.",
    price: 104,
    category: 'Patch Collection',
    tags: ['dark', 'electric', 'oversized'],
    featured: false,
    gradient: 'linear-gradient(135deg, oklch(0.12 0.04 290) 0%, oklch(0.28 0.20 275) 55%, oklch(0.18 0.10 295) 100%)',
    accentColor: 'oklch(0.60 0.22 275)',
  },
  {
    id: '5',
    name: 'Tender Archive',
    slug: 'tender-archive',
    mood: 'Nostalgic',
    shortDescription: 'Everything you almost forgot.',
    description:
      'Faded blush and aged cream, like a letter you never sent. Vintage cut, soft enough to fall into. Some moods deserve ceremony.',
    price: 78,
    category: 'Patch Collection',
    tags: ['soft', 'vintage', 'gentle'],
    featured: false,
    gradient: 'linear-gradient(150deg, oklch(0.82 0.07 355) 0%, oklch(0.91 0.04 60) 55%, oklch(0.78 0.06 30) 100%)',
    accentColor: 'oklch(0.75 0.10 10)',
  },
  {
    id: '6',
    name: 'Crimson Resolve',
    slug: 'crimson-resolve',
    mood: 'Fierce',
    shortDescription: 'Decided. Unapologetic. Present.',
    description:
      "Deep crimson into coal black. Structured shoulders, clean lines. For the days you've already won before you begin.",
    price: 128,
    category: 'Patch Collection',
    tags: ['bold', 'structured', 'power'],
    featured: false,
    gradient: 'linear-gradient(140deg, oklch(0.18 0.04 15) 0%, oklch(0.42 0.24 22) 55%, oklch(0.28 0.12 10) 100%)',
    accentColor: 'oklch(0.62 0.26 22)',
  },
]

export const featuredProduct = products.find((p) => p.featured)!
export const gridProducts = products.filter((p) => !p.featured)
