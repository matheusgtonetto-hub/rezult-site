"use client";
import { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { DemoModal } from "@/components/DemoModal";

export default function PlanosPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <main>
      <Navbar onDemo={() => setDemoOpen(true)} />
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Em breve</p>
      </div>
      <Footer />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </main>
  );
}
