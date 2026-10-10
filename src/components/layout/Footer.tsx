import Link from 'next/link';
import { brand, contact, navigation } from '@/content/site';
import { waLink } from '@/lib/utils';

export default function Footer() {
  return (
    <footer
      className="fluid-pad-x py-12 md:py-16 border-t"
      style={{
        backgroundColor: 'var(--color-ink)',
        color: 'var(--color-bone)',
        borderColor: 'var(--color-mulberry-light)',
      }}
      data-theme="dark"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl tracking-tight hover:text-[var(--color-coral)] transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {brand.name}
            </Link>
            <p
              className="mt-3 text-sm opacity-60 max-w-xs"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {brand.tagline}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 md:gap-16">
            <div>
              <h4
                className="text-xs uppercase tracking-[0.2em] opacity-40 mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Pages
              </h4>
              <ul className="space-y-2">
                {navigation.pages.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--color-coral)] transition-all"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                className="text-xs uppercase tracking-[0.2em] opacity-40 mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Connect
              </h4>
              <ul className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                <li>
                  <a
                    href={contact.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 hover:text-[var(--color-coral)] transition-all"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={contact.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 hover:text-[var(--color-coral)] transition-all"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={waLink(contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 hover:text-[var(--color-coral)] transition-all"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t text-xs opacity-40"
          style={{ borderColor: 'rgba(244,237,230,0.1)', fontFamily: 'var(--font-body)' }}
        >
          <p>© 2026 {brand.name}. All rights reserved.</p>
          <p>{contact.address}</p>
        </div>
      </div>
    </footer>
  );
}
