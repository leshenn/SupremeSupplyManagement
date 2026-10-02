export type NetworkSection = {
  number: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  closing?: string;
};

export type GlobalNetworkPageContent = {
  heroTitle: string;
  heroIntro: string;
  sections: NetworkSection[];
};

export const fallbackGlobalNetworkPage: GlobalNetworkPageContent = {
  heroTitle: 'Big enough to connect you to the world. Personal enough to know your name.',
  heroIntro: 'International reach backed by personal coordination, trusted relationships and one dedicated Supreme team.',
  sections: [
    {
      number: '01',
      title: 'More Than a Network. A Partnership.',
      paragraphs: [
        'We understand that international logistics can be complex. Different time zones, customs requirements, documentation and transportation providers all need to work together.',
        "That's where Supreme makes the difference.",
        'We bring the moving parts together, maintain communication and remain personally invested in the outcome of every shipment.',
        'Our role is not simply to arrange transportation. It is to make your logistics experience easier, more dependable and more connected.',
      ],
    },
    {
      number: '02',
      title: 'A World of Connections. One Point of Contact.',
      paragraphs: [
        'Behind every successful shipment is a network of people, expertise and connections working together.',
        'At Supreme, our global network extends beyond borders, connecting businesses to international markets through established logistics relationships and trusted industry partners.',
        'From the point of origin to final destination, we coordinate the movement of your cargo across continents, combining international reach with the personal attention of a dedicated logistics partner.',
        'Whether your business is importing, exporting or expanding into new markets, we bring the connections, coordination and commitment to keep your supply chain moving.',
      ],
      closing: 'Global reach, without losing the personal touch.',
    },
    {
      number: '03',
      title: 'Global Reach. Local Understanding.',
      paragraphs: [
        'International logistics is about more than moving goods from one country to another. It requires an understanding of markets, regulations, transportation routes and the people who make global trade possible.',
        'Through our international network, we facilitate freight movements across major global trade lanes while maintaining a strong understanding of South African logistics requirements.',
        'Our network supports:',
      ],
      bullets: [
        'International import and export movements',
        'Global air and ocean freight connections',
        'Road freight and cross-border transportation',
        'Customs clearing and trade coordination',
        'Warehousing and distribution',
        'Multimodal logistics solutions',
        'End-to-end shipment coordination',
      ],
      closing: 'From international origins to destinations across South Africa and beyond, we connect the different stages of your logistics journey.',
    },
    {
      number: '04',
      title: 'Connected by Expertise. Driven by Relationships.',
      paragraphs: [
        'Strong networks are built on strong relationships. We believe the strength of a logistics network is measured not only by its geographical reach, but by the people behind it.',
        'Our established relationships across the logistics industry allow us to coordinate solutions that respond to the individual requirements of each shipment.',
        'Rather than offering a one-size-fits-all approach, we consider your cargo, timelines, budget and operational priorities before developing a suitable logistics solution.',
        'And while our network works across borders, you have a dedicated Supreme team to engage with, communicate with and hold accountable.',
      ],
      closing: 'You deal with us. We take care of the connections.',
    },
    {
      number: '05',
      title: 'One Network. Multiple Possibilities.',
      paragraphs: [
        'Every shipment has its own requirements. Some demand speed, others require cost efficiency, specialised handling or carefully coordinated transportation across multiple modes.',
        'Our network allows us to bring different logistics capabilities together under one coordinated solution.',
      ],
    },
  ],
};
