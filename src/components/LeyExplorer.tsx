"use client";

import { useState } from "react";
import {
  Home, Package, MapPin, AlertTriangle, Sun, Car, CloudSun,
  Users, FileWarning, Smartphone, Gift, TrafficCone, Swords,
  Skull, Scissors, Phone, X, Scale, ChevronRight,
} from "lucide-react";
import { escenarios, categorias, type Categoria, type Escenario } from "@/data/escenarios";
import AnimatedSection from "./ui/AnimatedSection";
import Badge from "./ui/Badge";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Package, MapPin, AlertTriangle, Sun, Car, CloudSun,
  Users, FileWarning, Smartphone, Gift, TrafficCone, Swords,
  Skull, Scissors,
};

const badgeVariant: Record<Categoria, "abandono" | "maltrato" | "negligencia" | "venta" | "crueldad"> = {
  "Abandono": "abandono",
  "Maltrato físico": "maltrato",
  "Negligencia": "negligencia",
  "Venta ilegal": "venta",
  "Crueldad": "crueldad",
};

export default function LeyExplorer() {
  const [filtro, setFiltro] = useState<Categoria | "Todas">("Todas");
  const [selected, setSelected] = useState<Escenario | null>(null);

  const filtered = filtro === "Todas" ? escenarios : escenarios.filter((e) => e.categoria === filtro);

  return (
    <section id="ley" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">Modulo 1</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-primary mb-4">
              Explorador de la Ley
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              La Ley de Proteccion y Trato Digno a los Seres Sintientes de Coahuila explicada con
              situaciones reales que puedes encontrar en tu colonia.
            </p>
          </div>
        </AnimatedSection>

        {/* Filtros */}
        <AnimatedSection delay={100}>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setFiltro("Todas")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filtro === "Todas"
                  ? "bg-primary text-white"
                  : "bg-secondary/50 text-text-dark hover:bg-secondary"
              }`}
            >
              Todas
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filtro === cat
                    ? "bg-primary text-white"
                    : "bg-secondary/50 text-text-dark hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((esc, i) => {
            const Icon = iconMap[esc.icono] || Scale;
            return (
              <AnimatedSection key={esc.id} delay={i * 80}>
                <div
                  onClick={() => setSelected(esc)}
                  className="bg-white rounded-2xl border border-secondary/50 p-6 card-hover cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant={badgeVariant[esc.categoria]}>{esc.categoria}</Badge>
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 leading-snug">{esc.titulo}</h3>
                  <p className="text-muted text-sm line-clamp-2">{esc.descripcion}</p>
                  <div className="mt-4 flex items-center text-accent text-sm font-medium">
                    Ver detalles <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-surface rounded-3xl max-w-lg w-full p-8 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-muted hover:text-text-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <Badge variant={badgeVariant[selected.categoria]} className="mb-4">
                {selected.categoria}
              </Badge>

              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-primary mb-3">
                {selected.titulo}
              </h3>

              <p className="text-text-dark mb-6 leading-relaxed">{selected.descripcion}</p>

              <div className="space-y-4">
                <div className="bg-primary/5 rounded-xl p-4">
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Articulo</p>
                  <p className="text-sm font-medium text-text-dark">{selected.articulo}</p>
                </div>

                <div className="bg-danger/5 rounded-xl p-4">
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Sancion</p>
                  <p className="text-sm font-medium text-danger">{selected.sancion}</p>
                </div>

                <div className="bg-accent/5 rounded-xl p-4">
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Canal de denuncia</p>
                  <p className="text-sm font-medium text-text-dark">{selected.canalDenuncia}</p>
                  {selected.canalDenuncia.match(/\d{3}-\d{3}-\d{4}/) && (
                    <a
                      href={`tel:${selected.canalDenuncia.match(/\d{3}-\d{3}-\d{4}/)?.[0]?.replace(/-/g, "")}`}
                      className="inline-flex items-center gap-2 mt-2 text-accent text-sm font-medium hover:underline"
                    >
                      <Phone className="w-4 h-4" /> Llamar ahora
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
