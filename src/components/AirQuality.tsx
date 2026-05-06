"use client";

import { useState } from "react";
import {
  Baby, Heart, UserRound, Dumbbell, HardHat,
  Factory, Flame, Car, Moon, Wind,
} from "lucide-react";
import { perfiles, niveles, datosContexto, type NivelICA } from "@/data/perfiles-ica";
import AnimatedSection from "./ui/AnimatedSection";

const perfilIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Baby, Heart, UserRound, Dumbbell, HardHat,
};

const fuenteIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Factory, Flame, Car, Moon, Wind,
};

export default function AirQuality() {
  const [selectedPerfil, setSelectedPerfil] = useState(perfiles[0].id);
  const [selectedNivel, setSelectedNivel] = useState<NivelICA>("buena");

  const perfil = perfiles.find((p) => p.id === selectedPerfil)!;
  const nivel = niveles.find((n) => n.id === selectedNivel)!;

  return (
    <section id="aire" className="py-24 bg-secondary/20">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">Modulo 2</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-primary mb-4">
              Traductor del Aire
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              El Indice de Calidad del Aire (ICA) traducido a recomendaciones concretas segun tu
              perfil de riesgo.
            </p>
          </div>
        </AnimatedSection>

        {/* Perfil selector */}
        <AnimatedSection delay={100}>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {perfiles.map((p) => {
              const Icon = perfilIconMap[p.icono] || Heart;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPerfil(p.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all ${
                    selectedPerfil === p.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white text-text-dark border border-secondary hover:border-primary/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {p.nombre}
                </button>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Nivel display */}
        <AnimatedSection delay={200}>
          <div
            className="rounded-3xl p-8 md:p-12 mb-8 text-center transition-all duration-500"
            style={{ backgroundColor: nivel.color + "20" }}
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ backgroundColor: nivel.color }}
            >
              <span className="text-white text-2xl font-bold">{nivel.nombre.charAt(0)}</span>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-text-dark mb-2">
              {nivel.nombre}
            </h3>
            <p className="text-muted mb-1">Rango ICA: {nivel.rango}</p>
          </div>
        </AnimatedSection>

        {/* Nivel cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-16">
          {niveles.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNivel(n.id)}
              className={`rounded-2xl p-4 text-center transition-all duration-300 border-2 ${
                selectedNivel === n.id
                  ? "border-current shadow-lg scale-105"
                  : "border-transparent hover:scale-102"
              }`}
              style={{
                backgroundColor: n.color + "15",
                borderColor: selectedNivel === n.id ? n.color : "transparent",
              }}
            >
              <div
                className="w-6 h-6 rounded-full mx-auto mb-2"
                style={{ backgroundColor: n.color }}
              />
              <p className="text-sm font-semibold text-text-dark">{n.nombre}</p>
              <p className="text-xs text-muted">{n.rango}</p>
            </button>
          ))}
        </div>

        {/* Recomendación */}
        <AnimatedSection>
          <div className="bg-white rounded-3xl border border-secondary/50 p-8 mb-16">
            <h4 className="text-sm uppercase tracking-wider text-muted mb-3">
              Recomendacion para: {perfil.nombre}
            </h4>
            <p className="text-lg text-text-dark leading-relaxed font-medium">
              {perfil.recomendaciones[selectedNivel]}
            </p>
          </div>
        </AnimatedSection>

        {/* ¿Por qué Saltillo? */}
        <AnimatedSection delay={100}>
          <div className="mb-16">
            <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
              ¿Por que Saltillo?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-secondary/50 p-6">
                <p className="text-4xl font-[family-name:var(--font-display)] font-bold text-danger mb-2">
                  {datosContexto.diasMalaCalidad2025}
                </p>
                <p className="text-text-dark font-medium">dias con mala calidad del aire en 2025</p>
                <p className="text-muted text-sm mt-1">
                  En 2026 (Q1) mejoro a {datosContexto.diasMalaCalidad2026Q1} dias — la cifra mas
                  baja en 5 años
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-secondary/50 p-6">
                <p className="text-4xl font-[family-name:var(--font-display)] font-bold text-warning mb-2">
                  {datosContexto.pm25VsOMS}x
                </p>
                <p className="text-text-dark font-medium">
                  PM2.5 superior al valor de referencia anual de la OMS
                </p>
                <p className="text-muted text-sm mt-1">Fuente: IQAir</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Fuentes de contaminación */}
        <AnimatedSection delay={200}>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-primary mb-6 text-center">
            5 fuentes principales de contaminacion
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {datosContexto.fuentes.map((f, i) => {
              const Icon = fuenteIconMap[f.icono] || Wind;
              return (
                <AnimatedSection key={i} delay={i * 100}>
                  <div className="bg-white rounded-2xl border border-secondary/50 p-5 text-center card-hover">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-[family-name:var(--font-display)] font-bold text-primary">
                      {f.porcentaje}%
                    </p>
                    <p className="text-xs text-muted mt-1 leading-tight">{f.nombre}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Sensores */}
        <AnimatedSection delay={300}>
          <div className="mt-12 bg-primary/5 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted mb-2">Red de monitoreo en Saltillo</p>
            <div className="flex flex-wrap justify-center gap-6">
              <div>
                <span className="text-xl font-bold text-primary">{datosContexto.sensores.smaCoahuila}</span>
                <span className="text-sm text-muted ml-1">sensores SMA</span>
              </div>
              <div>
                <span className="text-xl font-bold text-primary">{datosContexto.sensores.municipio}</span>
                <span className="text-sm text-muted ml-1">sensores municipales</span>
              </div>
              <div>
                <span className="text-xl font-bold text-primary">{datosContexto.sensores.estacionesAutomaticas}</span>
                <span className="text-sm text-muted ml-1">estaciones automaticas</span>
              </div>
              <div>
                <span className="text-xl font-bold text-primary">{datosContexto.sensores.unam}</span>
                <span className="text-sm text-muted ml-1">estacion RUOA-UNAM</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
