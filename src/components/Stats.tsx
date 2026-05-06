"use client";

import { PawPrint, Wind, Scale } from "lucide-react";
import AnimatedSection from "./ui/AnimatedSection";

const stats = [
  {
    icon: PawPrint,
    number: "250,000",
    label: "perros abandonados en Coahuila",
    source: "Fuente: SMA Coahuila",
  },
  {
    icon: Wind,
    number: "164",
    label: "dias con aire malo en 2025",
    source: "Fuente: Vanguardia / SIMA",
  },
  {
    icon: Scale,
    number: "2-4 años",
    label: "de carcel por abandono animal",
    source: "Fuente: Codigo Penal de Coahuila",
  },
];

export default function Stats() {
  return (
    <section id="stats" className="py-24 bg-secondary/30">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </p>
                <p className="text-text-dark font-medium mb-1">{stat.label}</p>
                <p className="text-muted text-xs">{stat.source}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
