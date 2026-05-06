"use client";

import { Search, BookOpen, PenLine, ArrowRight } from "lucide-react";
import AnimatedSection from "./ui/AnimatedSection";

const steps = [
  {
    icon: Search,
    badge: "Paso 1",
    title: "Encuentra tu situación",
    desc: "Recorre los 15 escenarios reales de la Ley de Seres Sintientes o pregúntale al asistente. Cada caso te dice el artículo, la sanción y el canal exacto de denuncia.",
    color: "#1B4332",
  },
  {
    icon: BookOpen,
    badge: "Paso 2",
    title: "Entiende el aire",
    desc: "El traductor del aire toma el ICA del SIMA y te dice qué hacer hoy según tu perfil — niño, embarazada, deportista o trabajador exterior.",
    color: "#52B788",
  },
  {
    icon: PenLine,
    badge: "Paso 3",
    title: "Firma tu compromiso",
    desc: "Eliges entre 8 acciones concretas y tu firma aparece en el mapa de Saltillo. La presión ciudadana se vuelve visible.",
    color: "#C75B39",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-28 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">
              Cómo funciona
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-primary mb-5 leading-tight">
              Tres módulos. Una decisión <span className="italic">consciente</span>.
            </h2>
            <p className="text-muted leading-relaxed">
              Sin cuentas, sin descargas, sin suscripciones. Funciona en
              cualquier teléfono y en cualquier red.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/20 via-success/40 to-accent/20" />

          {steps.map((step, i) => (
            <AnimatedSection key={i} delay={i * 120}>
              <div className="relative bg-white rounded-3xl border border-secondary/40 p-7 h-full hover:border-primary/30 hover:-translate-y-1 transition-all group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}15, ${step.color}30)`,
                  }}
                >
                  <step.icon className="w-7 h-7" style={{ color: step.color }} />
                </div>
                <p
                  className="text-xs uppercase tracking-wider font-mono mb-2"
                  style={{ color: step.color }}
                >
                  {step.badge}
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-5">
                  {step.desc}
                </p>
                <ArrowRight
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  style={{ color: step.color }}
                />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
