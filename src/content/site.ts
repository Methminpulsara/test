/**
 * ═══════════════════════════════════════════════════════════════
 * AURELLE STUDIO — Central Content File
 * ═══════════════════════════════════════════════════════════════
 *
 * ALL salon copy, services, prices, contact info, image paths and
 * links live here. Components never hard-code content — they import
 * from this file. To update the site, edit ONLY this file and drop
 * replacement images into /public/images/.
 *
 * Items marked [PLACEHOLDER] should be replaced with real data.
 */

// ─── Brand ────────────────────────────────────────────────────
export const brand = {
  name: 'Yor Salon', // [PLACEHOLDER] salon name
  tagline: 'Where every detail is deliberate.',
  shortDescription:
    'A modern premium salon in Colombo, crafted for women who value artistry, precision and an experience that feels personal.',
  siteUrl: 'https://aurellestudio.com', // [PLACEHOLDER]
  language: 'en',
} as const;

// ─── Navigation ───────────────────────────────────────────────
export const navigation = {
  chapters: [
    { id: 'hero', label: 'Intro', number: '01' },
    { id: 'philosophy', label: 'Philosophy', number: '02' },
    { id: 'looks', label: 'Looks', number: '03' },
    { id: 'services', label: 'Services', number: '04' },
    { id: 'social', label: 'Community', number: '05' },
    { id: 'booking', label: 'Book', number: '06' },
  ],
  pages: [
    { href: '/', label: 'Home', preview: '/images/hero-pink.jpg' },
    { href: '/services', label: 'Services', preview: '/images/lilac.jpg' },
    { href: '/gallery', label: 'Gallery', preview: '/images/bride.jpg' },
    { href: '/about', label: 'About', preview: '/images/team.jpg' },
    { href: '/contact', label: 'Contact', preview: '/images/studio-dark.jpg' },
  ],
} as const;

// ─── Services ─────────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  /** CSS object-position so faces stay in frame when cropped */
  focus?: string;
  category: 'hair' | 'bridal' | 'skin' | 'nails';
}

/** [PLACEHOLDER] — prices are temporary, in LKR */
export const services: Service[] = [
  {
    id: 'haircut',
    name: 'Haircut & Styling',
    description:
      'Precision cuts shaped to your face, lifestyle and texture. Includes consultation, wash, cut and a relaxed blow-dry finish.',
    price: 'from LKR 3,500',
    image: '/images/blowdry.jpg',
    focus: '60% 40%',
    category: 'hair',
  },
  {
    id: 'color',
    name: 'Hair Color & Balayage',
    description:
      'From subtle lived-in dimension to bold transformation — hand-painted balayage, full color, highlights and toning.',
    price: 'from LKR 12,000',
    image: '/images/lilac.jpg',
    focus: '50% 30%',
    category: 'hair',
  },
  {
    id: 'treatments',
    name: 'Keratin & Hair Treatments',
    description:
      'Deep conditioning, keratin smoothing and restorative treatments that bring back strength, shine and manageability.',
    price: 'from LKR 15,000',
    image: '/images/wash.jpg',
    focus: '50% 40%',
    category: 'hair',
  },
  {
    id: 'bridal',
    name: 'Bridal Makeup & Hair',
    description:
      'Your day, your look — from trial to final touch. We work with you to create a bridal style that photographs beautifully and lasts all day.',
    price: 'from LKR 45,000',
    image: '/images/bride.jpg',
    focus: '50% 30%',
    category: 'bridal',
  },
  {
    id: 'facial',
    name: 'Facial & Skin Care',
    description:
      'Customised facials using professional-grade products. Deep cleanse, hydration, brightening and anti-ageing protocols.',
    price: 'from LKR 6,000',
    image: '/images/makeup.jpg',
    focus: '50% 50%',
    category: 'skin',
  },
  {
    id: 'nails',
    name: 'Manicure & Pedicure',
    description:
      'Classic and gel manicures, spa pedicures, nail art — meticulous care with a clean, polished finish.',
    price: 'from LKR 4,500',
    image: '/images/service-nails.jpg',
    category: 'nails',
  },
];

// ─── Gallery / Looks ──────────────────────────────────────────
export interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
  aspect: 'portrait' | 'landscape' | 'square';
  /** CSS object-position so the subject stays in frame when cropped */
  focus?: string;
}

/**
 * Photos live in /public/images. Swap the files (same names) or edit the
 * paths here. Captions are intentionally descriptive, not claims.
 */
export const galleryItems: GalleryItem[] = [
  { src: '/images/bride.jpg', alt: 'Bride with soft waves and a bouquet', caption: 'Bridal Glow', aspect: 'portrait', focus: '50% 25%' },
  { src: '/images/lilac.jpg', alt: 'Long lilac waves', caption: 'Lilac Waves', aspect: 'portrait', focus: '50% 30%' },
  { src: '/images/curls-pink.jpg', alt: 'Golden curls against a pink wall', caption: 'Soft Curls', aspect: 'landscape', focus: '50% 40%' },
  { src: '/images/natural.jpg', alt: 'Natural textured curls', caption: 'Natural Texture', aspect: 'square', focus: '50% 40%' },
  { src: '/images/updo.jpg', alt: 'Stylist pinning a sculpted updo', caption: 'Sculpted Updo', aspect: 'landscape', focus: '65% 40%' },
  { src: '/images/hero-pink.jpg', alt: 'Rose-pink hair in motion', caption: 'Rose in Motion', aspect: 'portrait', focus: '45% 50%' },
  { src: '/images/back-pink.jpg', alt: 'Honey-toned waves from behind', caption: 'Honey Waves', aspect: 'portrait', focus: '50% 40%' },
];

// ─── Hero ─────────────────────────────────────────────────────
export const hero = {
  headline: ['Every', 'Detail,', 'Deliberate.'],
  subline: 'A modern salon experience in Colombo.',
  image: '/images/hero-pink.jpg',
  focus: '45% 50%',
  imageAlt: 'Rose-pink hair swept through the air',
  videoSrc: null as string | null, // add path to hero video if available
} as const;

// ─── Philosophy / Story ───────────────────────────────────────
export const philosophy = {
  statements: [
    'We believe beauty is not a formula.',
    'It is attention — to texture, to light, to you.',
    'Every visit is a conversation, not a transaction.',
    'We study the craft so the result feels effortless.',
    'Your confidence is our signature.',
  ],
  bigWord: 'Beauty',
  images: ['/images/studio-mirrors.jpg', '/images/curls-pink.jpg'],
  imageAlts: ['The salon floor with round mirrors', 'Golden curls against a pink wall'],
} as const;

/** "Every angle" scroll reveal: two shots with the same backdrop */
export const angles = {
  headline: 'Every angle,\nconsidered.',
  from: { src: '/images/back-pink.jpg', alt: 'Honey-toned waves from behind', label: 'From behind' },
  to: { src: '/images/curls-pink.jpg', alt: 'Golden curls from the front', label: 'From the front' },
} as const;

// ─── About / Team ─────────────────────────────────────────────
export const about = {
  storyHeadline: 'The Studio',
  storyBody: [
    'Aurelle Studio was born from a simple conviction: that a salon visit should feel like a creative collaboration, not a production line.',
    'We chose Colombo because this city understands the balance between tradition and reinvention. Our space is designed to slow you down — natural light, warm materials, and the quiet hum of artistry at work.',
    'Every stylist here is both a technician and an artist. We train continuously, we listen carefully, and we never cut corners.',
  ],
  team: [
    {
      name: 'Studio Founder', // [PLACEHOLDER]
      role: 'Creative Director & Lead Stylist',
      bio: 'With over a decade of experience across Colombo and abroad, our founder built Aurelle to be the salon they always wanted to work in.',
    },
    {
      name: 'Senior Stylist', // [PLACEHOLDER]
      role: 'Color Specialist',
      bio: 'A colour obsessive with an eye for dimension. Specialises in balayage, lived-in blondes and corrective colour.',
    },
  ],
  interiorImage: '/images/studio-dark.jpg',
  teamPhoto: '/images/team.jpg',
  stylingPhoto: '/images/styling.jpg',
} as const;

// ─── Contact / Location ──────────────────────────────────────
export const contact = {
  address: 'No. 00, Sample Road, Colombo 03, Sri Lanka', // [PLACEHOLDER]
  hours: 'Mon – Sat: 9:00 AM – 7:00 PM\nSunday: Closed', // [PLACEHOLDER]
  phone: '+94 77 000 0000', // [PLACEHOLDER]
  whatsapp: '+94770000000', // [PLACEHOLDER] — digits only for wa.me link
  email: 'hello@aurellestudio.com', // [PLACEHOLDER]
  mapLink:
    'https://maps.google.com/?q=Colombo+03+Sri+Lanka', // [PLACEHOLDER]
  social: {
    instagram: 'https://instagram.com/yourhandle', // [PLACEHOLDER]
    facebook: 'https://facebook.com/yourpage', // [PLACEHOLDER]
  },
} as const;

// ─── Social Proof ─────────────────────────────────────────────
/**
 * If you have real testimonials, add them here.
 * Otherwise we show an Instagram follow CTA instead.
 */
export const testimonials: {
  quote: string;
  name: string;
  detail?: string;
}[] = [
  // Uncomment and add real reviews:
  // { quote: '...', name: '...', detail: 'Bridal client, 2025' },
];

// ─── Kinetic Band Text ────────────────────────────────────────
export const kineticText =
  'Haircut · Color · Balayage · Bridal · Facial · Nails · ';

// ─── CTA / Booking ────────────────────────────────────────────
export const booking = {
  headline: 'Your chair is waiting.',
  subline: 'Book your appointment via WhatsApp or give us a call.',
  whatsappText:
    "Hi Aurelle Studio, I'd like to book an appointment.", // prefilled text
} as const;

// ─── Images Index ─────────────────────────────────────────────
/** Instagram preview tiles (use your own latest posts' photos) */
export const instagramTiles = [
  '/images/blowdry.jpg',
  '/images/lilac.jpg',
  '/images/updo.jpg',
  '/images/bride.jpg',
  '/images/natural.jpg',
  '/images/makeup.jpg',
] as const;

export const bookingImage = '/images/studio-dark.jpg';
