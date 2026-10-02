export type CompanyValue = {
  number: string;
  title: string;
  body: string;
};

export type CompanyPageContent = {
  heroTitle: string;
  heroIntro: string;
  aboutTitle: string;
  aboutParagraphs: string[];
  mission: string;
  vision: string;
  valuesTitle: string;
  valuesIntro: string;
  values: CompanyValue[];
};

export const fallbackCompanyPage: CompanyPageContent = {
  heroTitle: 'Logistics built on relationships.',
  heroIntro: 'Personal service, practical solutions and global connections designed around the needs of your business.',
  aboutTitle: 'About Us',
  aboutParagraphs: [
    'Founded in 2018 from humble beginnings, Supreme Supply Management was built on a simple belief: logistics is about more than moving cargo — it is about building relationships, earning trust, and connecting businesses to opportunities around the world.',
    'With a hands-on, customer-focused approach, we provide personalised logistics solutions designed around the unique needs of every client. We understand that behind every shipment is a business, a commitment, and a customer depending on things being done right.',
    'With industry experience and a dedicated team, we provide tailored solutions across international freight forwarding, customs clearing, and supply chain management. From local movements to international shipments, we navigate the complexities of logistics with a focus on reliability, transparency, and cost-effective solutions.',
    'Our journey has been shaped by strong relationships, integrity, and a commitment to excellence. While our network connects us globally, our approach remains personal — because we believe that exceptional service starts with understanding people.',
    "At Supreme, we don't just move goods. We move businesses forward.",
  ],
  mission: 'To simplify global logistics through reliable, tailored solutions and personal service that keeps businesses moving forward.',
  vision: 'To be a trusted global logistics partner, connecting businesses and opportunities through lasting relationships and seamless supply chains.',
  valuesTitle: 'Our Values',
  valuesIntro: 'The principles behind every shipment, every decision and every relationship.',
  values: [
    {
      number: '01',
      title: 'People Before Shipments',
      body: 'We believe logistics is ultimately about people. We take the time to understand our clients, their challenges and what matters to their business. Every relationship deserves personal attention, not just another transaction.',
    },
    {
      number: '02',
      title: 'Trust Through Integrity',
      body: "We do what we say we will do. We believe in honest communication, transparency and taking responsibility, especially when things don't go according to plan. Trust is earned through actions, not promises.",
    },
    {
      number: '03',
      title: 'Ownership & Accountability',
      body: "When a shipment is entrusted to us, we treat it as our responsibility from beginning to end. We don't pass problems around or wait to be asked. We take initiative, find solutions and see things through.",
    },
    {
      number: '04',
      title: 'Global Thinking, Personal Service',
      body: 'Our network may span continents, but our approach remains personal. We combine international connections and local understanding to deliver solutions that make sense for each client.',
    },
    {
      number: '05',
      title: 'Always Moving Forward',
      body: "We never settle for simply doing things the way they've always been done. Through continuous improvement, technology and fresh thinking, we look for smarter, more efficient and cost-effective ways to serve our clients.",
    },
    {
      number: '06',
      title: 'We Grow Together',
      body: 'Our success is connected to the success of our clients, partners and people. We value long-term relationships over short-term wins and believe that when our clients grow, we grow with them.',
    },
  ],
};
