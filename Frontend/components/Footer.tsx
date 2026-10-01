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
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="shell footer-base">
        <span>© {new Date().getFullYear()} Supreme Supply Management</span>
        <span>{contact.address}</span>
      </div>
    </footer>
  );
}
