This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Run (fixed setup)

```bash
rm -rf node_modules .next
npm install
npm run dev     # http://localhost:3000
```

Tailwind v4 is wired through `postcss.config.mjs` (`@tailwindcss/postcss`).
Brand colors / fonts live in the `@theme` block at the top of `src/app/globals.css`.
Placeholder art lives in `public/images/` — replace files with the same names to use real photos.

## Photos

Real photos live in `public/images/` and are wired up in `src/content/site.ts`
(`services`, `galleryItems`, `hero`, `philosophy`, `angles`, `about`, `instagramTiles`).
Replace a file with the same name, or change the path in `site.ts`.
`service-nails.jpg` is still an art-directed placeholder (no nails photo was supplied).

## Devices

Scroll effects run on phones, tablets and laptops (pinned scenes use `svh` units, touch scrolling is normalized for GSAP on coarse-pointer devices, and `ScrollTrigger.config({ ignoreMobileResize: true })` avoids re-measuring pinned scenes for small browser-toolbar changes).
The system mouse pointer is never hidden. On laptops (real mouse only) a coral ring + dot follows the pointer
(`src/components/ui/CursorFollower.tsx`, no images) and the hero reacts to mouse movement.

Note for `gsap.matchMedia()`: with an object of conditions the callback only runs if at least one matches, so always
include both `desktop` and `mobile` (see `mq` in `src/config/motion.ts`). Visitors whose operating system requests reduced motion get the accessible static/stacked layout by design. If scroll animations are absent on one phone only, check its Accessibility / Motion setting first.
