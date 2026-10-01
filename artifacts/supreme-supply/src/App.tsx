import { useEffect, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, Plus, X } from 'lucide-react';
import brandMark from '@assets/logo_1790859211612.png';

const services = [
  {
    title: 'Sea freight',
    summary: 'A considered route for imports and exports, across full and shared loads.',
    details: 'Guidance on procedures and cost-effective methods for moving cargo by sea, supported by close work with shipping lines and agencies.',
    tags: ['Customs clearance', 'NVOCC', 'Degroupage', 'Container tracking with Globetrack', 'Import procedure consulting', 'Customs procedures', 'Track & trace', 'FCL & LCL exports', 'Groupage & bulk exports'],
  },
  {
    title: 'Air freight',
    summary: 'Time-conscious airfreight for importers and exporters.',
    details: 'A reliable, cost-effective and efficient airfreight service. Trained staff work decisively to help avoid unnecessary time on the ground.',
    tags: ['Customs clearance', 'Tracking', 'Costings', 'Indent control', 'Import procedure consulting', 'Customs procedures', 'Door to door', 'Consolidated shipments', 'Groupage & bulk exports', 'Dangerous goods exports'],
  },
  {
    title: 'Road freight',
    summary: 'Cross-border and local transport, with customs support.',
    details: 'Working with transporters and border agents to support cross-border transport and customs services into Southern and Sub-Saharan Africa, as well as local South African deliveries.',
    tags: ['Cross haul', 'Local delivery', 'Namibia', 'Botswana', 'Mozambique', 'Zimbabwe', 'Zambia', 'Angola', 'DR Congo', 'Lesotho', 'Eswatini', 'Malawi'],
  },
  {
    title: 'Warehousing',
    summary: 'Storage and distribution access across key South African gateways.',
    details: 'Own warehousing facilities at the Johannesburg office, with outsourced facilities in Durban and Cape Town positioned for access to airports, depots and seaports. Johannesburg is less than 10 minutes from OR Tambo International Airport.',
    tags: ['Bonded warehousing', 'Distribution warehouse', 'Johannesburg', 'Durban', 'Cape Town'],
  },
  {
    title: 'Supply chain management',
    summary: 'A tailored view from sourcing and planning through to delivery.',
    details: 'An adaptable service that looks across the stages of a supply chain, helping clients reduce risk and align buying, production, logistics and distribution with their needs.',
    tags: ['Plan & source', 'Analysis', 'Management', 'Product', 'Procurement', 'Logistics', 'Distribution'],
  },
];

const projects = [
  { name: 'DStv', index: '01 / DISTRIBUTION', detail: 'Distribution of serialized products into Africa.' },
  { name: 'Great Wall of China', index: '02 / CAMPAIGN LOGISTICS', detail: 'Annual advertising campaign spanning 30 countries.' },
  { name: 'De Beers', index: '03 / SPECIAL PROJECT', detail: 'Logistics for an export and re-import project.' },
  { name: 'Halifax → Johannesburg', index: '04 / INDUSTRIAL RELOCATION', detail: 'Decommissioning logistics for a chip manufacturing plant from Canada to Johannesburg.' },
  { name: 'Local manufacturer', index: '05 / SUPPLY CHAIN', detail: 'A contract involving imports and exports for a local manufacturer.' },
  { name: 'Worldwide', index: '06 / GLOBAL MOVEMENT', detail: 'Ongoing imports and exports across international routes.' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const go = () => setMenuOpen(false);
  const submitQuote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !validEmail || !message) {
      setFormError('Please provide your name, a valid email address and a message.');
      return;
    }
    const subject = encodeURIComponent(`Quote request — ${name}`);
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Company: ${data.get('company') || 'Not provided'}`,
      `Email: ${email}`,
      `Phone: ${data.get('phone') || 'Not provided'}`,
      `Service required: ${data.get('service') || 'Not specified'}`,
      '',
      'Message:',
      message,
    ].join('\n'));
    window.location.href = `mailto:info@supremesupply.co.za?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="site-shell">
      <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="wrap nav-inner">
          <a className="brand" href="#home" aria-label="Supreme Supply Management home" onClick={go}>
            <img className="brand-mark" src={brandMark} alt="" />
            <span className="brand-wordmark">Supreme Supply<small>Management</small></span>
          </a>
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
            {[['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Projects', '#projects'], ['Contact', '#contact']].map(([label, href]) => (
              <a key={label} href={href} onClick={go}>{label}</a>
            ))}
          </nav>
          <a className="nav-cta" href="#contact">Request a quote <ArrowUpRight size={15} /></a>
          <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <div className="hero-label">Supreme Supply Management</div>
            <h1 className="display">Logistics,<br /><span>in better</span> motion.</h1>
            <div className="hero-bottom">
              <p>Personalised, end-to-end logistics and supply chain solutions—connecting South Africa to the world.</p>
              <div className="hero-actions">
                <a className="button" href="#contact">Request a quote <ArrowRight size={15} /></a>
                <a className="button button-outline" href="#services">Explore services <ArrowDown size={14} /></a>
              </div>
            </div>
          </div>
          <span className="hero-index">SOUTH AFRICA · GLOBAL NETWORK</span>
          <span className="scroll-mark" aria-hidden="true" />
        </section>

        <section className="reach" aria-label="Global network">
          <div className="wrap">
            <div className="reach-top">
              <span className="eyebrow">Connected at scale</span>
              <span className="reach-note">A global collaboration network, built around your movement.</span>
            </div>
            <div className="stats">
              <div className="stat"><strong>250<span style={{ color: 'var(--brand-blue-light)' }}>+</span></strong><span>Offices</span></div>
              <div className="stat"><strong>120</strong><span>Countries</span></div>
              <div className="stat"><strong>6</strong><span>Continents</span></div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="wrap intro-grid">
            <aside className="intro-aside reveal">
              <span className="eyebrow">About Supreme Supply</span>
              <p>A South African freight forwarder with a global outlook and a personal way of working.</p>
            </aside>
            <div className="intro-copy reveal delay-1">
              <h2 className="display">Complex networks.<br /><em>One clear point of contact.</em></h2>
              <p>Supreme Supply Management brings together freight forwarding and supply chain management across imports and exports, cross-border logistics, warehousing and distribution. Our leadership brings more than 20 years of experience to the work.</p>
              <a className="text-link" href="#story">Meet Supreme Supply <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section id="services" className="section services">
          <div className="wrap">
            <div className="section-head reveal">
              <div><span className="eyebrow">What we move</span><h2 className="section-title display">The right route.<br />The right way through.</h2></div>
              <p className="section-intro">Five connected capabilities, brought together around the requirements of each shipment and each client.</p>
            </div>
            <div className="service-list">
              {services.map((service, i) => (
                <article className="service-row" key={service.title}>
                  <span className="service-num">0{i + 1}</span>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <button className="learn-button" onClick={() => setExpanded(expanded === i ? null : i)} aria-expanded={expanded === i} aria-controls={`service-details-${i}`}>
                    {expanded === i ? 'Close details' : 'Learn more'} <ArrowRight size={14} />
                  </button>
                  <button className="service-toggle" onClick={() => setExpanded(expanded === i ? null : i)} aria-label={`${expanded === i ? 'Close' : 'Open'} ${service.title} details`} aria-expanded={expanded === i} aria-controls={`service-details-${i}`}><Plus size={18} /></button>
                  {expanded === i && <div className="service-details" id={`service-details-${i}`}><p>{service.details}</p><div className="detail-tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="feature-band" aria-label="Sea freight">
          <div className="wrap feature-copy reveal">
            <span className="eyebrow">End-to-end movement</span>
            <h2 className="display">From first mile<br />to final arrival.</h2>
            <p>With efficiency, reliability and visibility across the supply chain, your cargo keeps moving with a team focused on the detail.</p>
          </div>
        </section>

        <section id="story" className="section story">
          <div className="wrap story-grid">
            <div className="story-visual reveal" role="img" aria-label="Organised warehouse operations"><span className="story-caption">Care in every handover</span></div>
            <div className="story-text reveal delay-1">
              <span className="eyebrow">A considered approach</span>
              <h2 className="display">Personal service.<br />Clear progress.</h2>
              <p>Our mission is to provide personalised, high-quality and cost-effective end-to-end logistics. We work with foresight, open communication and regular shipment updates, while continually improving processes and systems.</p>
              <div className="principles">
                <div className="principle"><strong>Communication</strong><span>Open dialogue and ongoing updates on shipment progress.</span></div>
                <div className="principle"><strong>Technology</strong><span>Up-to-date shipment tracking, with focus on on-time and intact delivery.</span></div>
                <div className="principle"><strong>Improvement</strong><span>Continual attention to workflow efficiency, service quality and delivery.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap why">
            <div className="reveal">
              <span className="eyebrow">Why Supreme Supply</span>
              <h2 className="display">More connected.<br />Less complicated.</h2>
              <p className="why-copy">A single, service-focused relationship, backed by a global network and an online system for shipment visibility.</p>
            </div>
            <div className="strength-list reveal delay-1">
              {[
                'More than 20 years of leadership experience',
                'Personalised service with one point of contact',
                'International collaboration network',
                'Online system and up-to-date tracking',
                'Service focused at every handover',
              ].map((item, i) => <div className="strength" key={item}><span>0{i + 1}</span><p>{item}</p></div>)}
            </div>
          </div>
        </section>

        <section className="credential">
          <div className="wrap credential-inner">
            <div>
              <span className="eyebrow">Proudly South African</span>
              <h2 className="display">Progress that includes everyone.</h2>
              <p>Supreme Supply Management is a Level 1 B-BBEE contributor. The company describes this as part of its commitment to economic transformation, sustainable BEE principles and inclusive economic participation.</p>
              <a className="text-link" href="https://supremesupply.co.za/page-6/" target="_blank" rel="noreferrer">View B-BBEE certificate <ArrowUpRight size={15} /></a>
            </div>
            <div className="level-mark" aria-label="Level 1 B-BBEE contributor"><div><strong>Level 1</strong><span>B-BBEE contributor</span></div></div>
          </div>
        </section>

        <section id="projects" className="section projects">
          <div className="wrap">
            <div className="projects-heading reveal">
              <div><span className="eyebrow">Selected work</span><h2 className="display">Logistics in motion.</h2></div>
              <p className="section-intro">Different cargo. Different corners of the world. Every project has its own route.</p>
            </div>
            <div className="projects-grid">
              {projects.map((project) => <article className="project reveal" key={project.name}>
                <div className="project-top"><span>{project.index}</span><ArrowUpRight size={17} /></div>
                <div><h3>{project.name}</h3><p>{project.detail}</p></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="testimonial">
          <div className="wrap testimonial-inner">
            <div className="reveal"><span className="eyebrow">A note from a client</span><h2 className="display">Partnership,<br />in practice.</h2></div>
            <div className="reveal delay-1">
              <p className="testimonial-summary">Sindi Dlamini, CEO of Pamodzi Unique Engineering, thanked Supreme Supply for sponsoring lunch bags for the organisation’s Women’s Day High Tea. She noted that attendees appreciated their quality and that the contribution added a special touch to the event.</p>
              <p className="testimonial-by">Sindi Dlamini<br />CEO, Pamodzi Unique Engineering</p>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="wrap">
            <div className="contact-head reveal">
              <div><span className="eyebrow">Start a conversation</span><h2 className="display">Let’s move<br />something forward.</h2></div>
              <p>Tell us what you need to move. Share a few details and we’ll help start the conversation.</p>
            </div>
            <div className="contact-layout">
              <div className="contact-details reveal">
                <div className="contact-item"><span>Call</span><a href="tel:+27108240157">+27 010 824 0157</a></div>
                <div className="contact-item"><span>Email</span><a href="mailto:info@supremesupply.co.za">info@supremesupply.co.za</a></div>
                <div className="contact-item"><span>Visit</span><p>16 Vuurslag Avenue<br />Spartan, Kempton Park, 1619</p></div>
                <div className="contact-item"><span>Connect</span><a href="https://www.linkedin.com/company/supreme-supply-management/" target="_blank" rel="noreferrer">Supreme Supply on LinkedIn <ArrowUpRight size={13} /></a></div>
              </div>
              <form className="contact-form reveal delay-1" onSubmit={submitQuote} noValidate>
                <div className="field"><label htmlFor="name">Name *</label><input id="name" name="name" autoComplete="name" required /></div>
                <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" autoComplete="organization" /></div>
                <div className="field"><label htmlFor="email">Email *</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
                <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" autoComplete="tel" /></div>
                <div className="field full"><label htmlFor="service">Service required</label><select id="service" name="service" defaultValue=""><option value="">Select a service</option>{services.map((service) => <option key={service.title}>{service.title}</option>)}</select></div>
                <div className="field full"><label htmlFor="message">Message *</label><textarea id="message" name="message" required /></div>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                {sent && <p className="form-note" role="status">Your email draft is ready. If it didn’t open, email us at info@supremesupply.co.za.</p>}
                <button className="button" type="submit">Request a quote <ArrowRight size={15} /></button>
                <p className="form-note">Submitting opens your email app with your request addressed to info@supremesupply.co.za.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <a className="footer-brand-lockup" href="#home" aria-label="Supreme Supply Management home">
                <img className="brand-mark" src={brandMark} alt="" />
                <span className="brand-wordmark">Supreme Supply<small>Management</small></span>
              </a>
              <p>Freight forwarding and supply chain solutions, from South Africa to the world.</p>
            </div>
            <div className="footer-col"><h3>Services</h3>{services.map((service) => <a href="#services" key={service.title}>{service.title}</a>)}</div>
            <div className="footer-col"><h3>Company</h3><a href="#about">About</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div>
            <div className="footer-col"><h3>Get in touch</h3><a href="tel:+27108240157">+27 010 824 0157</a><a href="mailto:info@supremesupply.co.za">info@supremesupply.co.za</a><a href="https://www.linkedin.com/company/supreme-supply-management/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={12} /></a></div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Supreme Supply Management</span><span>16 Vuurslag Avenue, Spartan, Kempton Park, 1619</span></div>
        </div>
      </footer>
    </div>
  );
}

export default App;
