import type { Metadata } from 'next';
import Image from 'next/image';
import { about, philosophy, brand } from '@/content/site';

export const metadata: Metadata = {
  title: 'About',
  description: `Our story, philosophy and the artisans behind ${brand.name}.`,
};

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-bone)', color: 'var(--color-ink)' }} data-theme="light">
      {/* Intro */}
      <section className="fluid-pad-x pb-16 pt-36 md:pb-24 md:pt-44">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[var(--color-rose)]" style={{ fontFamily: 'var(--font-body)' }}>
          About
        </p>
        <h1
          className="mb-14 leading-[0.86]"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4.5rem, 17vw, 18rem)', letterSpacing: '-0.045em' }}
        >
          The <span className="italic text-[var(--color-rose)]">Studio</span>
        </h1>

        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="space-y-6 md:col-span-6 md:col-start-1">
            {about.storyBody.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? 'text-2xl leading-snug md:text-3xl' : 'leading-relaxed text-[var(--color-ink-soft)]'}
                style={{ fontFamily: i === 0 ? 'var(--font-display)' : 'var(--font-body)' }}
              >
                {p}
              </p>
            ))}
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ clipPath: 'inset(0 round 999px 999px 0 0)' }}>
              <Image src={about.stylingPhoto} alt="A stylist blow-drying a client's hair in a bright studio" fill sizes="(max-width: 768px) 90vw, 30vw" className="object-cover" style={{ objectPosition: '55% 40%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Wide interior */}
      <section className="fluid-pad-x pb-20 md:pb-32">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl md:aspect-[21/9]">
          <Image src={about.interiorImage} alt="The salon floor with round mirrors" fill sizes="(max-width: 768px) 100vw, (max-width: 1400px) 92vw, 1300px" className="object-cover" />
        </div>
      </section>

      {/* Philosophy — numbered rows */}
      <section className="fluid-pad-x py-16 md:py-28" style={{ backgroundColor: 'var(--color-mulberry)', color: 'var(--color-bone)' }} data-theme="dark">
        <p className="mb-10 text-xs uppercase tracking-[0.3em] opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
          Our philosophy
        </p>
        <ol>
          {philosophy.statements.map((s, i) => (
            <li key={i} className="grid items-baseline gap-4 border-t py-6 md:grid-cols-12 md:py-9" style={{ borderColor: 'rgba(244,237,230,0.18)' }}>
              <span className="text-sm tabular-nums opacity-50 md:col-span-1" style={{ fontFamily: 'var(--font-body)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="md:col-span-11" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 4rem)', lineHeight: 1.05 }}>
                {s}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Team */}
      <section className="fluid-pad-x py-16 md:py-28">
        <h2 className="mb-10 leading-[0.9]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 9vw, 9rem)', letterSpacing: '-0.04em' }}>
          The <span className="italic text-[var(--color-rose)]">artisans</span>
        </h2>
        <div className="relative mb-14 aspect-[16/10] w-full overflow-hidden rounded-2xl md:aspect-[21/9]">
          <Image src={about.teamPhoto} alt="Three stylists laughing together with their tools" fill sizes="(max-width: 768px) 100vw, (max-width: 1400px) 92vw, 1300px" className="object-cover" style={{ objectPosition: '50% 30%' }} />
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          {about.team.map((m, i) => (
            <article key={i} className="border-t pt-6" style={{ borderColor: 'rgba(26,17,24,0.2)' }}>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--color-rose)]" style={{ fontFamily: 'var(--font-body)' }}>
                {m.role}
              </p>
              <h3 className="mb-3 text-4xl md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
                {m.name}
              </h3>
              <p className="max-w-md leading-relaxed text-[var(--color-ink-soft)]" style={{ fontFamily: 'var(--font-body)' }}>
                {m.bio}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
