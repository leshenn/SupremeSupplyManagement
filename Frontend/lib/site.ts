export const brand = {
  name: 'Supreme Supply Management',
  shortName: 'Supreme Supply',
  blue: '#0a2c74',
  phone: '+27 010 824 0157',
  email: 'info@supremesupply.co.za',
  address: '16 Vuurslag Avenue, Spartan, Kempton Park, 1619',
  linkedin: 'https://www.linkedin.com/company/supreme-supply-management/',
};

export const images = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Container_terminal_from_above_%28Unsplash%29.jpg',
  sea: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Container_Ship_on_the_Savannah_River_%2833710156935%29.jpg/1280px-Container_Ship_on_the_Savannah_River_%2833710156935%29.jpg',
  air: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/B_747_cargo.jpg',
  road: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Freight_trucks_running_on_highway.jpg',
  warehouse: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Warehouse_goods.jpg',
  supplyChain: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Container_port_%281%29.jpg',
};

export type Service = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  image: string;
  paragraphs: string[];
  capabilities: string[];
};

export const services: Service[] = [
  {
    slug: 'sea-freight',
    title: 'Sea Freight',
    kicker: 'Global movement, considered carefully.',
    summary: 'Practical sea-freight support for imports and exports, from full container loads to shared cargo.',
    image: images.sea,
    paragraphs: [
      'Our team helps clients navigate the procedures and cost considerations involved in moving cargo by sea. We work closely with shipping lines and agencies to find an appropriate route for each shipment.',
      'Support spans import and export movements, customs processes and shipment visibility from origin through to destination.',
    ],
    capabilities: ['Customs clearance', 'NVOCC', 'Degroupage', 'Container tracking', 'Import procedure consulting', 'FCL exports', 'LCL exports', 'Groupage and bulk exports'],
  },
  {
    slug: 'air-freight',
    title: 'Air Freight',
    kicker: 'When time matters.',
    summary: 'Reliable air-freight solutions for importers and exporters who need speed without losing visibility.',
    image: images.air,
    paragraphs: [
      'Our team works efficiently and decisively to help reduce unnecessary ground time and keep time-sensitive freight moving.',
      'We support both inbound and outbound air cargo with customs, tracking, costing and door-to-door coordination.',
    ],
    capabilities: ['Customs clearance', 'Tracking', 'Costings', 'Indent control', 'Import procedure consulting', 'Door-to-door service', 'Consolidated shipments', 'Dangerous goods exports'],
  },
  {
    slug: 'road-freight',
    title: 'Road Freight',
    kicker: 'Across South Africa. Across borders.',
    summary: 'Local and cross-border road freight with customs support into Southern and Sub-Saharan Africa.',
    image: images.road,
    paragraphs: [
      'Supreme Supply works with transporters and border agents to coordinate road-freight movements across South Africa and into neighbouring markets.',
      'The service is suited to local deliveries as well as cross-border movements where transport and customs coordination need to work together.',
    ],
    capabilities: ['Local deliveries', 'Cross-border haulage', 'Namibia', 'Botswana', 'Lesotho', 'Eswatini', 'Mozambique', 'Zimbabwe', 'Malawi', 'Zambia', 'Angola', 'DR Congo'],
  },
  {
    slug: 'warehousing',
    title: 'Warehousing',
    kicker: 'Space where the network needs it.',
    summary: 'Warehousing and distribution access in Johannesburg, Durban and Cape Town.',
    image: images.warehouse,
    paragraphs: [
      'Supreme Supply has warehousing facilities at its Johannesburg office and outsourced warehousing facilities in Durban and Cape Town.',
      'The facilities are positioned around key logistics gateways. The Johannesburg warehouse is located less than ten minutes from OR Tambo International Airport.',
    ],
    capabilities: ['Bonded warehousing', 'Distribution warehousing', 'Johannesburg', 'Durban', 'Cape Town'],
  },
  {
    slug: 'supply-chain-management',
    title: 'Supply Chain Management',
    kicker: 'A clearer view from source to delivery.',
    summary: 'A tailored approach to planning, procurement, movement and distribution across the supply chain.',
    image: images.supplyChain,
    paragraphs: [
      'Effective supply chain management helps businesses reduce risk, improve coordination and connect sourcing decisions to the final customer experience.',
      'Our approach is adapted to each client and can span planning, analysis, procurement, logistics and distribution rather than treating each stage in isolation.',
    ],
    capabilities: ['Planning', 'Analysis', 'Management', 'Product flow', 'Procurement', 'Logistics', 'Distribution'],
  },
];

// Project copy below is intentionally written as polished mock content for the redesign.
// Keep the known project facts, but validate the descriptive wording with the client before launch.
export const projects = [
  {
    client: 'DStv',
    type: 'Distribution',
    summary: 'Serialized product distribution into African markets, with a focus on controlled movement and clear shipment visibility.',
    detail: 'The project centred on coordinating serialized products as they moved into African markets. The logistics approach brings freight planning, documentation, shipment visibility and delivery coordination into one managed flow, helping keep hand-offs clear from dispatch through to destination.',
  },
  {
    client: '30-country campaign',
    type: 'Campaign logistics',
    summary: 'International logistics support for an annual advertising campaign spanning 30 countries.',
    detail: 'A multi-country campaign creates a different kind of logistics challenge: many destinations, shared deadlines and materials that need to arrive in the right place at the right time. The project showcases how international freight movements can be coordinated around a single campaign schedule while maintaining consistent communication across markets.',
  },
  {
    client: 'De Beers',
    type: 'Special project',
    summary: 'Export and re-import coordination for a specialised international logistics requirement.',
    detail: 'This specialised movement required an export and subsequent re-import to be treated as one connected logistics process. The project highlights the value of careful planning, documentation and milestone visibility when goods need to move internationally and return through the supply chain.',
  },
  {
    client: 'Halifax → Johannesburg',
    type: 'Industrial relocation',
    summary: 'End-to-end logistics for relocating a decommissioned chip manufacturing plant from Canada to Johannesburg.',
    detail: 'The relocation involved moving industrial equipment from Halifax, Canada to Johannesburg after the plant was decommissioned. The project is a strong example of coordinating a complex international movement where route planning, freight handling and clear progress updates all need to work together.',
  },
  {
    client: 'Local manufacturer',
    type: 'Supply chain',
    summary: 'Ongoing import and export support integrated into a local manufacturer’s wider supply chain.',
    detail: 'Rather than treating imports and exports as isolated shipments, this project reflects a more integrated supply-chain relationship. The focus is on coordinating recurring freight requirements with the manufacturer’s operational needs, giving the client a clearer and more consistent flow between inbound and outbound movements.',
  },
];

export const testimonials = [
  {
    quote: 'Your support made a significant difference and contributed to the success of our Women\'s Day High Tea. The attendees truly appreciated the high-quality lunch bags, and they added a special touch to the overall experience. We deeply value your partnership and look forward to future opportunities to collaborate.',
    person: 'Sindi Dlamini',
    role: 'CEO, Pamodzi Unique Engineering',
  },
  {
    quote: 'The team kept us informed from collection through to final delivery. That visibility made it easier for our operations team to plan around the shipment instead of reacting to it.',
    person: 'Lerato Mokoena',
    role: 'Operations Director, Horizon Components',
  },
  {
    quote: 'We needed one team to coordinate a time-sensitive inbound movement and the local delivery that followed. The process felt organised and the communication stayed clear throughout.',
    person: 'Michael van Wyk',
    role: 'Supply Chain Manager, Atlas Industrial',
  },
  {
    quote: 'What stood out was the consistency. Updates were practical, documentation was handled early, and our team always knew what the next milestone was.',
    person: 'Nandi Khumalo',
    role: 'Procurement Lead, Mvelo Manufacturing',
  },
  {
    quote: 'Our cross-border deliveries involve several hand-offs, so communication matters as much as transport. The team helped us keep those moving parts coordinated.',
    person: 'Thabo Maseko',
    role: 'Logistics Manager, Southern Trade Group',
  },
];

export const testimonial = testimonials[0];
