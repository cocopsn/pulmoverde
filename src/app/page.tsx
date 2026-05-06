"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import LeyExplorer from "@/components/LeyExplorer";
import AirQuality from "@/components/AirQuality";
import Compromisos from "@/components/Compromisos";
import Footer from "@/components/Footer";

const MapaCompromisos = dynamic(() => import("@/components/MapaCompromisos"), {
  ssr: false,
  loading: () => (
    <div className="py-24 bg-secondary/20">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <div className="h-[500px] rounded-3xl bg-secondary/30 animate-pulse flex items-center justify-center">
          <p className="text-muted">Cargando mapa...</p>
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <LeyExplorer />
        <AirQuality />
        <Compromisos />
        <MapaCompromisos />
      </main>
      <Footer />
    </>
  );
}
