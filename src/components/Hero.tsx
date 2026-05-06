"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-32 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Saltillo respira.
          <br />
          Saltillo protege.
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-light">
          La ley y los datos existen. Falta que lleguen a ti.
        </p>
        <a
          href="#stats"
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-all duration-300"
        >
          Explora la plataforma
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="backdrop-blur-card bg-white/10 border border-white/15 rounded-2xl p-6">
            <AnimatedCounter target={250000} />
            <p className="text-white/70 text-sm mt-2">perros en situacion de calle</p>
          </div>
          <div className="backdrop-blur-card bg-white/10 border border-white/15 rounded-2xl p-6">
            <AnimatedCounter target={164} />
            <p className="text-white/70 text-sm mt-2">dias con mala calidad del aire en 2025</p>
          </div>
          <div className="backdrop-blur-card bg-white/10 border border-white/15 rounded-2xl p-6">
            <AnimatedCounter target={4} suffix=" años" />
            <p className="text-white/70 text-sm mt-2">de prision por abandono animal</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
