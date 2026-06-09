"use client";
import { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { BentoFeatures } from "@/components/sections/BentoFeatures";
import { Comparison } from "@/components/sections/Comparison";
import { Testimonials } from "@/components/sections/Testimonials";
import { Niches } from "@/components/sections/Niches";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { DemoModal } from "@/components/DemoModal";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const openDemo = () => setDemoOpen(true);
  const closeDemo = () => setDemoOpen(false);

  return (
    <main>
      <Navbar onDemo={openDemo} />
      <Hero onDemo={openDemo} />
      <BentoFeatures />
      <Comparison />
      <Testimonials />
      <Niches />
      <Pricing />
      <FAQ />
      <CTA onDemo={openDemo} />
      <Footer />
      <DemoModal open={demoOpen} onClose={closeDemo} />
      <FloatingWhatsApp />
    </main>
  );
}
