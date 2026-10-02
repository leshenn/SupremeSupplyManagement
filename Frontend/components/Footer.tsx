import Link from 'next/link';
import { getContactSettings } from '@/lib/cms';

export async function Footer() {
  const contact = await getContactSettings();

  return (
    <footer className="footer">
      <div className="shell footer-top">
        <div className="footer-intro">
          <Link className="brand footer-brand" href="/">
            <img src="/logo.png" alt="" />
            <span>Supreme Supply Management</span>
          </Link>
          <p>Personalised, end-to-end logistics and supply chain solutions.</p>
        </div>

        <div className="footer-links">
          <div>
            <span>Explore</span>
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div>
            <span>Contact</span>
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            )}
          </div>
        </div>
      </div>
      <div className="shell footer-base">
        <span>© {new Date().getFullYear()} Supreme Supply Management</span>
        {contact.address && <span>{contact.address}</span>}
      </div>
    </footer>
  );
}
