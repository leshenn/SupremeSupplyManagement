import Link from 'next/link';

export default function NotFound() {
  return <section className="not-found"><div className="shell"><span className="eyebrow">404</span><h1>That page has moved on.</h1><p>The page you requested could not be found.</p><Link className="button" href="/">Return home</Link></div></section>;
}
