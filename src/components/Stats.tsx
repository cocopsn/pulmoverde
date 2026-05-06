"use client";

import { PawPrint, Wind, Scale } from "lucide-react";
import AnimatedSection from "./ui/AnimatedSection";

const stats = [
  {
    icon: PawPrint,
    number: "250,000",
    label: "perros abandonados en Coahuila",
    source: "SMA Coahuila",
    accent: "#C75B39",
  },
  {
    icon: Wind,
    number: "164",
    label: "días con aire malo en 2025",
    source: "Vanguardia / SIMA",
    accent: "#1B4332",
  },
  {
    icon: Scale,
    number: "2-4 años",
    label: "de cárcel por abandono animal",
    source: "Código Penal de Coahuila",
    accent: "#7B2D8E",
  },
];

export default function Stats() {
  return (
    <section id="stats" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(82,183,136,0.08),transparent_60%)]" />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-14 max-w-xl mx-auto">
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">
              Por qué ahora
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-primary leading-tight">
              Tres cifras que cambian todo lo que crees sobre Saltillo.
            </h2>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 120}>
              <div className="group relative bg-white rounded-3xl p-7 border border-secondary/40 hover:border-transparent hover:shadow-2xl hover:shadow-primary/10 transition-all overflow-hidden h-full">
                <div
                  className="absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-[0.07] group-hover:opacity-15 transition-opacity"
                  style={{ background: stat.accent }}
                />
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                    style={{ background: stat.accent + "15" }}
                  >
                    <stat.icon className="w-7 h-7" style={{ color: stat.accent }} />
                  </div>
                  <p
                    className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold mb-3 leading-none tracking-tight"
                    style={{ color: stat.accent }}
                  >
                    {stat.number}
                  </p>
                  <p className="text-text-dark font-medium leading-snug mb-2">
                    {stat.label}
                  </p>
                  <p className="text-muted text-xs uppercase tracking-wider">
                    Fuente · {stat.source}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
