'use client';

import Image from 'next/image';
import { useState } from 'react';

type HeroImageProps = {
  src: string;
  alt: string;
};

export function HeroImage({ src, alt }: HeroImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      fetchPriority="high"
      sizes="100vw"
      quality={90}
      onLoad={() => setLoaded(true)}
      className={`home-hero-image ${loaded ? 'is-loaded' : ''}`}
    />
  );
}