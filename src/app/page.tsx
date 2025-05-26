import AboutUsSection from '@/components/section/about';
import ContactUs from '@/components/section/contactus';
import DemoStats from '@/components/section/demoStats';
import FAQ from '@/components/section/faq';
import Hero from '@/components/section/hero';
import HowItWorks from "@/components/section/howItWorks";
import UseCase from '@/components/section/useCase';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Hero />
      <DemoStats />
      <HowItWorks />
      <UseCase />
      <AboutUsSection />
      <FAQ />
      <ContactUs />
    </div>
  );
}
