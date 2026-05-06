"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { IMG } from "@/lib/images";
import AnimatedSection from "./ui/AnimatedSection";

export default function Manifiesto() {
  return (
    <section className="relative py-28 overflow-hidden bg-primary">
      {/* Background image, low opacity */}
      <Image
        src={IMG.forest.src}
        alt={IMG.forest.alt}
        fill
        quality={75}
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary" />

      <div className="relative max-w-[900px] mx-auto px-6 text-center">
        <AnimatedSection>
          <Quote className="w-10 h-10 text-success mx-auto mb-6 opacity-70" />
          <p className="font-[family-name:var(--font-display)] text-2xl md:text-4xl text-white leading-snug font-light italic">
            &ldquo;La ley no protege lo que la gente no conoce. La calidad del
            aire no mejora si nadie la entiende.&rdquo;
          </p>
          <p className="text-white/60 text-sm mt-6 uppercase tracking-wider">
            — Manifiesto PulmoVerde
          </p>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                k: "01",
                t: "Información clara",
                d: "Traducimos artículos legales y datos científicos al español de la calle.",
              },
              {
                k: "02",
                t: "Acción inmediata",
                d: "Cada explicación termina en un canal de denuncia o un compromiso firmable.",
              },
              {
                k: "03",
                t: "Memoria pública",
                d: "Los compromisos firmados quedan visibles en un mapa del municipio.",
              },
            ].map(({ k, t, d }) => (
              <div
                key={k}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <p className="text-success font-mono text-xs mb-3">{k}</p>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white mb-2">
                  {t}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
