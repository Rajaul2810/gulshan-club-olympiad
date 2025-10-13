import Hero from '@/components/Hero';
import MessageSection from '@/components/Message';
import SponsorsSection from '@/components/Sponsor';
import ClubSection from '@/app/club/page';
import SportsCategorySection from '@/components/SportsCategory';

export default function Home() {
  return (
    <>
      <Hero />
      <MessageSection />
      {/* <ClubSection /> */}
      <SponsorsSection />
      <SportsCategorySection />
    </>
  );
}
