'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  ['Home', '/'],
  ['Company', '/company'],
  ['Services', '/services'],
  ['Global Network', '/global-network'],
  ['Blog', '/blog'],
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="site-header">
      <div className="shell nav-shell">

        <Link
          className="brand"
          href="/"
          onClick={closeMenu}
          aria-label="Supreme Supply Management home"
        >
          <img
            src="/logo.png"
            alt="Supreme Supply Management logo"
          />

          <span>Supreme Supply Management</span>
        </Link>

        <nav
          className={open ? 'nav-links is-open' : 'nav-links'}
          aria-label="Main navigation"
        >
          {links.map(([label, href]) => {
            const active =
              href === '/'
                ? pathname === '/'
                : pathname === href ||
                  pathname.startsWith(`${href}/`);

            return (
              <Link
                className={active ? 'active' : ''}
                key={href}
                href={href}
                onClick={closeMenu}
              >
                {label}
              </Link>
            );
          })}

          {/* Only displayed inside the mobile menu */}
          <Link
            className="mobile-contact-link"
            href="/contact"
            onClick={closeMenu}
          >
            Contact us
          </Link>
        </nav>

        {/* Desktop Contact button */}
        <Link
          className="nav-contact"
          href="/contact"
          onClick={closeMenu}
        >
          Contact us
        </Link>

        <button
          className="menu-button"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>

      </div>
    </header>
  );
}