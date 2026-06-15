import React from 'react';
import { Hero } from '@/components/Hero';
import { Ticker } from '@/components/Ticker';
import { Segments } from '@/components/Segments';
import { About } from '@/components/About';
import { PrizePool } from '@/components/PrizePool';
import { SponsorsCarousel } from '@/components/SponsorsCarousel';
import { Highlights } from '@/components/Highlights';
import { Testimonials } from '@/components/Testimonials';
import { CTABanner } from '@/components/CTABanner';
import { FAQ } from '@/components/FAQ';

export default function Home({
  dbSegments,
  dbSponsors,
  dbFAQs,
  dbPhotos,
  dbReviews,
}: {
  dbSegments?: any[];
  dbSponsors?: any;
  dbFAQs?: any[];
  dbPhotos?: string[];
  dbReviews?: any[];
}) {
  return (
    <>
      <Hero />
      <Ticker />
      <Segments dbSegments={dbSegments} />
      <About />
      <PrizePool />
      <SponsorsCarousel />
      <Highlights dbPhotos={dbPhotos} />
      <Testimonials dbTestimonials={dbReviews} />
      <CTABanner />
      <FAQ dbFAQs={dbFAQs} />
    </>
  );
}