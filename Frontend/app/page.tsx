import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { images } from '@/lib/site';

const principles = [
  {
    title: 'Personal Attention',
    copy: 'Real relationships and dedicated support.',
  },
  {
    title: 'Global Connections',
    copy: 'Access to international logistics networks.',
  },
  {
    title: 'Reliable Execution',
    copy: 'Taking ownership from start to finish.',
  },
  {
    title: 'Tailored Solutions',
    copy: 'Logistics that work around your business.',
  },
];

const shipmentSteps = [
  {
    number: '01',
    title: 'Tell Us What You Need',
    copy: 'Share your shipment details, origin, destination and requirements.',
  },
  {
    number: '02',
    title: 'We Build Your Solution',
    copy: 'Our team assesses your requirements and coordinates a suitable logistics solution.',
  },
  {
    number: '03',
    title: 'We Coordinate the Journey',
    copy: 'From freight arrangements and customs clearance to transportation and delivery, we manage the moving parts.',
  },
  {
    number: '04',
    title: 'Delivered with Care',
    copy: 'We remain involved throughout the process, keeping you informed and your business moving.',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero home-hero-full">
        <div className="home-hero-stage home-hero-edge">
          <Image
            src="/images/home-hero.jpg"
            alt="Container terminal viewed from above"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={90}
            className="home-hero-image"
          />
          <div className="home-hero-shade" aria-hidden="true" />
          <div className="shell home-hero-content-wrap">
            <div className="home-hero-content">
              <span className="eyebrow hero-eyebrow">Freight forwarding & supply chain management</span>
              <h1>Global logistics,<br /><em>made personal.</em></h1>
              <p>Personalised, end-to-end logistics solutions across South Africa and international markets.</p>
              <div className="hero-actions">
                <Link className="button button-white" href="/contact">Request a quote <ArrowRight size={16} /></Link>
                <a className="button button-ghost-light" href="#about">Supreme at a Glance</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-about" id="about">
        <div className="shell editorial-two-col">
          <div>
            {/*<span className="eyebrow">About Supreme Supply</span>*/}
            <h2>One point of contact for a complex supply chain.</h2>
          </div>
          <div className="body-copy">
            <p>In a world of complex supply chains, we believe logistics should feel straightforward.</p>
            <p>At Supreme, you're more than a shipment number. We take the time to understand your requirements, stay involved throughout the process and find solutions that work for your business.</p>
          </div>
        </div>

        <div className="shell stats-row stats-row-soft home-principles-row">
          {principles.map((item) => (
            <div key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.copy}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section shipment-steps-section">
        <div className="shell">
          <div className="shipment-steps-heading">
            <span className="eyebrow">How it works</span>
            <h2>Your Shipment, Made Simple.</h2>
          </div>

          <div className="shipment-route" aria-label="Four steps from shipment requirement to delivery">
            {shipmentSteps.map((step) => (
              <article className="shipment-step" key={step.number}>
                <div className="shipment-step-marker" aria-hidden="true">
                  <span>{step.number}</span>
                </div>
                <div className="shipment-step-copy">
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-quote-cta">
        <div className="shell home-quote-cta-inner">
          <div>
            <span className="eyebrow light">Ready when you are</span>
            <h2>Have a shipment in mind?</h2>
          </div>
          <div className="home-quote-actions">
            <Link className="button button-white" href="/contact">Request a quote <ArrowRight size={16} /></Link>
            <Link className="button button-ghost-light" href="/services">View our services <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
