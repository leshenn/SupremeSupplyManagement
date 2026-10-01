export type MockPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string[];
  image?: string;
  imageAlt?: string;
};

const blogImages = {
  port: 'https://images.unsplash.com/photo-1770710195407-b31627609c0b?auto=format&fit=crop&fm=jpg&q=80&w=1800',
  forklift: 'https://images.unsplash.com/photo-1776441325715-9f99c06ca417?auto=format&fit=crop&fm=jpg&q=80&w=1800',
  warehouse: 'https://images.unsplash.com/photo-1774946103680-3d34a461a581?auto=format&fit=crop&fm=jpg&q=80&w=1800',
  ship: 'https://images.unsplash.com/photo-1774929108070-b60d3879e071?auto=format&fit=crop&fm=jpg&q=80&w=1800',
  airCargo: 'https://images.unsplash.com/photo-1774698078446-59299e016718?auto=format&fit=crop&fm=jpg&q=80&w=1800',
  cargoPlane: 'https://images.unsplash.com/photo-1767868279881-5792a650cd8f?auto=format&fit=crop&fm=jpg&q=80&w=1800',
  road: 'https://images.unsplash.com/photo-1576728475513-68e60fbb65ff?auto=format&fit=crop&fm=jpg&q=80&w=1800',
  truck: 'https://images.unsplash.com/photo-1778575455073-c790da77968d?auto=format&fit=crop&fm=jpg&q=80&w=1800',
};

export const mockPosts: MockPost[] = [
  {
    slug: 'building-resilient-supply-chains',
    title: 'Building more resilient supply chains',
    date: '2026-09-18',
    excerpt: 'A practical look at visibility, supplier coordination and why small process improvements can make logistics more dependable.',
    image: blogImages.port,
    imageAlt: 'Shipping containers at an international port',
    content: [
      'Resilient supply chains are rarely built around one dramatic change. In practice, they are strengthened through consistent visibility, clear ownership and dependable communication between suppliers, freight partners and customers.',
      'For businesses moving goods across borders, the most useful improvements are often simple: better shipment milestones, earlier exception reporting and a shared understanding of who owns each next step.',
      'The goal is not to remove every disruption. It is to build a process that identifies issues early and responds quickly enough to keep the wider supply chain moving.'
    ]
  },
  {
    slug: 'choosing-the-right-freight-mode',
    title: 'Choosing the right freight mode',
    date: '2026-09-04',
    excerpt: 'Sea, air and road freight each solve a different problem. The right option comes down to urgency, cost, volume and destination.',
    image: blogImages.ship,
    imageAlt: 'Container ship at a busy cargo port',
    content: [
      'The fastest route is not always the best route, and the cheapest route is not always the most economical once stock availability and delivery deadlines are considered.',
      'Air freight is valuable when timing is critical. Sea freight is generally better suited to larger volumes and planned movements. Road freight remains essential for regional distribution and cross-border movements across Southern Africa.',
      'A useful freight decision starts with the commercial requirement first, then works backwards into the transport mode, route and supporting customs process.'
    ]
  },
  {
    slug: 'visibility-across-the-journey',
    title: 'Why shipment visibility matters',
    date: '2026-08-21',
    excerpt: 'Tracking is most useful when it supports decisions, not when it simply adds another status update to an inbox.',
    image: blogImages.forklift,
    imageAlt: 'Forklift working between stacked shipping containers',
    content: [
      'Shipment visibility gives teams the information they need to plan around the movement of goods. It becomes especially important when a delay affects production, stock availability or a customer commitment.',
      'Useful visibility combines tracking information with clear communication. A status update should explain what has happened, what it means and what the next action is.',
      'That approach helps turn logistics data into something operational teams can actually use.'
    ]
  },
  {
    slug: 'customs-clearance-with-fewer-surprises',
    title: 'Customs clearance with fewer surprises',
    date: '2026-08-07',
    excerpt: 'Good customs preparation starts before cargo reaches the border. Clean documentation and early checks reduce avoidable delays.',
    image: blogImages.port,
    imageAlt: 'Container terminal representing customs and import processes',
    content: [
      'Customs delays are often caused by issues that could have been identified before the shipment moved. Missing information, inconsistent values and unclear commodity descriptions all create unnecessary friction.',
      'A stronger process checks commercial documents early and makes sure the information used by suppliers, freight partners and clearing teams is aligned.',
      'That preparation does not remove every inspection or query, but it gives the shipment a cleaner path through the process.'
    ]
  },
  {
    slug: 'warehousing-beyond-storage',
    title: 'Warehousing is more than storage',
    date: '2026-07-24',
    excerpt: 'The right warehouse position can reduce handling, improve stock flow and make distribution easier to manage.',
    image: blogImages.warehouse,
    imageAlt: 'Warehouse storage and distribution facility',
    content: [
      'Warehousing works best when it is treated as part of the supply chain rather than a place where stock simply waits.',
      'Location, inventory visibility, handling processes and proximity to transport routes all influence how efficiently goods move in and out of a facility.',
      'For importers and distributors, a well-positioned warehouse can create more flexibility between inbound freight and final delivery.'
    ]
  },
  {
    slug: 'cross-border-road-freight-southern-africa',
    title: 'Planning cross-border road freight in Southern Africa',
    date: '2026-07-10',
    excerpt: 'Cross-border road movements depend on route planning, documentation and communication at every hand-off.',
    image: blogImages.truck,
    imageAlt: 'Freight truck travelling on a regional road',
    content: [
      'Road freight is a practical way to reach neighbouring markets, but border processes mean the movement needs more coordination than a domestic delivery.',
      'Transport availability, border requirements, documentation and receiving arrangements should be considered together rather than one step at a time.',
      'Clear milestone updates also help customers understand whether a delay is on the road, at a border or at the final delivery point.'
    ]
  },
  {
    slug: 'when-air-freight-makes-sense',
    title: 'When air freight makes commercial sense',
    date: '2026-06-26',
    excerpt: 'Air freight can cost more per kilogram, but the wider commercial picture may make speed the more economical choice.',
    image: blogImages.airCargo,
    imageAlt: 'Cargo aircraft being handled at an airport',
    content: [
      'Air freight is usually associated with urgent cargo, but urgency is only one reason to use it. High-value goods, production-critical parts and stock-out situations can all justify faster transport.',
      'The correct comparison is not only freight rate versus freight rate. Businesses should also consider the cost of downtime, delayed sales and holding extra stock.',
      'Used selectively, air freight can be a useful tool inside a broader supply-chain strategy.'
    ]
  },
  {
    slug: 'fcl-vs-lcl-sea-freight',
    title: 'FCL or LCL: choosing how to ship by sea',
    date: '2026-06-12',
    excerpt: 'Full-container and shared-container options each have trade-offs around cost, volume, handling and transit planning.',
    image: blogImages.ship,
    imageAlt: 'Container ship carrying sea freight',
    content: [
      'FCL gives one shipper the use of a full container, while LCL combines smaller consignments from multiple shippers. Neither is automatically better.',
      'Cargo volume, handling sensitivity, sailing frequency and destination charges all influence the decision.',
      'A good comparison looks at the total shipment cost and operational requirement, not only the ocean-freight line item.'
    ]
  },
  {
    slug: 'planning-project-cargo',
    title: 'What changes when freight becomes project cargo',
    date: '2026-05-29',
    excerpt: 'Large, unusual or high-value movements need a plan built around the cargo rather than a standard freight routine.',
    image: blogImages.cargoPlane,
    imageAlt: 'Large cargo aircraft used for specialised freight',
    content: [
      'Project cargo often involves dimensions, values or handling requirements that do not fit a normal transport template.',
      'The movement may require specialist equipment, route checks, permits, staged delivery or coordination between several service providers.',
      'The earlier those constraints are understood, the more realistic the transport plan and project timeline become.'
    ]
  },
  {
    slug: 'better-documents-fewer-delays',
    title: 'Better documents, fewer avoidable delays',
    date: '2026-05-15',
    excerpt: 'Commercial invoices, packing lists and shipping instructions look routine until one inconsistency holds up the movement.',
    image: blogImages.road,
    imageAlt: 'Freight transport representing the movement supported by shipping documents',
    content: [
      'Documentation is one of the least visible parts of logistics until something is wrong. A small mismatch can create questions at customs, with a carrier or at the receiving point.',
      'Standardising how shipment information is prepared helps reduce those avoidable problems. Product descriptions, quantities, values and references should stay consistent across the document set.',
      'That discipline becomes increasingly valuable as shipment volumes grow and more people become involved in the process.'
    ]
  },
];

export function getMockPost(slug: string) {
  return mockPosts.find((post) => post.slug === slug);
}
