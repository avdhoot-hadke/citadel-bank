import BentoGrid from "@/component/BentoGrid";
import CTASection from "@/component/CTA";
import Footer from "@/component/Footer";
import Hero from "@/component/Hero";
import LiveStatsBar from "@/component/LiveStatsBar";
import Navbar from "@/component/Navbar";
import { cookies } from "next/headers";

export default async function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <Navbar />
      <main>
        <Hero />
        <LiveStatsBar />
        <BentoGrid />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
