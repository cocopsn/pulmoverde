"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Heart, Flame, Car, Home, Factory, Bus, Recycle, Megaphone,
  Send, CheckCircle2,
} from "lucide-react";
import { supabase, type Compromiso } from "@/lib/supabase";
import { colonias } from "@/data/colonias";
import AnimatedSection from "./ui/AnimatedSection";
import Button from "./ui/Button";

const acciones = [
  { id: "esterilizar", label: "Esterilizar a mi mascota", icon: Heart },
  { id: "no_quemar", label: "No quemar basura", icon: Flame },
  { id: "afinar", label: "Afinar mi vehiculo", icon: Car },
  { id: "adoptar", label: "Adoptar en lugar de comprar", icon: Home },
  { id: "reportar", label: "Reportar ladrilleras ilegales", icon: Factory },
  { id: "transporte", label: "Reducir uso de automovil", icon: Bus },
  { id: "residuos", label: "Separar mis residuos", icon: Recycle },
  { id: "difundir", label: "Difundir la Ley de Seres Sintientes", icon: Megaphone },
];

function Confetti() {
  const colors = ["#1B4332", "#52B788", "#C75B39", "#F5E6D3", "#7B2D8E"];
  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Compromisos() {
  const [nombre, setNombre] = useState("");
  const [colonia, setColonia] = useState("");
  const [selectedAcciones, setSelectedAcciones] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [compromisos, setCompromisos] = useState<Compromiso[]>([]);
  const [total, setTotal] = useState(0);

  const fetchCompromisos = useCallback(async () => {
    const { data, count } = await supabase
      .from("compromisos")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) setCompromisos(data);
    if (count !== null) setTotal(count);
  }, []);

  useEffect(() => {
    fetchCompromisos();

    const channel = supabase
      .channel("compromisos-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "compromisos" }, () => {
        fetchCompromisos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCompromisos]);

  const toggleAccion = (id: string) => {
    setSelectedAcciones((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !colonia || selectedAcciones.length === 0) return;

    setSubmitting(true);
    const { error } = await supabase.from("compromisos").insert({
      nombre: nombre.trim(),
      colonia,
      acciones: selectedAcciones,
    });

    if (!error) {
      setSuccess(true);
      setShowConfetti(true);
      setNombre("");
      setColonia("");
      setSelectedAcciones([]);
      setTimeout(() => {
        setShowConfetti(false);
        setSuccess(false);
      }, 4000);
    }
    setSubmitting(false);
  };

  return (
    <section id="compromisos" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">Modulo 3</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-primary mb-4">
              Firma tu Compromiso
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Unete a los ciudadanos de Saltillo que estan tomando accion concreta por el medio
              ambiente y el bienestar animal.
            </p>
          </div>
        </AnimatedSection>

        {/* Counter */}
        <AnimatedSection delay={100}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-primary/5 rounded-full px-8 py-4">
              <CheckCircle2 className="w-6 h-6 text-success" />
              <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-primary">
                {total}
              </span>
              <span className="text-muted">compromisos firmados</span>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario */}
          <AnimatedSection delay={200}>
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-secondary/50 p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Tu nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Solo tu primer nombre"
                    className="w-full px-4 py-3 rounded-xl border border-secondary bg-surface text-text-dark placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Tu colonia</label>
                  <select
                    value={colonia}
                    onChange={(e) => setColonia(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-secondary bg-surface text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Selecciona tu colonia</option>
                    {colonias.map((c) => (
                      <option key={c.nombre} value={c.nombre}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-3">
                    Mis compromisos ({selectedAcciones.length} seleccionados)
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {acciones.map((a) => {
                      const Icon = a.icon;
                      const isSelected = selectedAcciones.includes(a.id);
                      return (
                        <button
                          type="button"
                          key={a.id}
                          onClick={() => toggleAccion(a.id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 text-primary font-medium"
                              : "border-secondary bg-surface text-text-dark hover:border-primary/30"
                          }`}
                        >
                          <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? "text-primary" : "text-muted"}`} />
                          {a.label}
                          {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto text-success" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !nombre.trim() || !colonia || selectedAcciones.length === 0}
                  className="w-full"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Enviando..." : "Firmar mi compromiso"}
                </Button>

                {success && (
                  <div className="text-center text-success font-medium animate-pulse">
                    ¡Gracias por tu compromiso!
                  </div>
                )}
              </div>
            </form>
          </AnimatedSection>

          {/* Compromisos recientes */}
          <AnimatedSection delay={300}>
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-primary mb-6">
                Compromisos recientes
              </h3>
              <div className="space-y-4">
                {compromisos.length === 0 ? (
                  <div className="text-center text-muted py-12">
                    <p>Se el primero en firmar tu compromiso.</p>
                  </div>
                ) : (
                  compromisos.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white rounded-2xl border border-secondary/50 p-5 card-hover"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-text-dark">{c.nombre}</p>
                        <span className="text-xs text-muted bg-secondary/50 px-2 py-1 rounded-full">
                          {c.colonia}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {c.acciones.map((a) => {
                          const accion = acciones.find((ac) => ac.id === a);
                          return (
                            <span
                              key={a}
                              className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-full"
                            >
                              {accion?.label || a}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {showConfetti && <Confetti />}
      </div>
    </section>
  );
}
