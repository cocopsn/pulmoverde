"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, Sparkles, Wind, PawPrint, Scale } from "lucide-react";
import { IMG } from "@/lib/images";

function AnimatedCounter({
  target, suffix = "",
}: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2200;
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
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src={IMG.hero.src}
        alt={IMG.hero.alt}
        fill
        priority
        quality={85}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/70 to-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1B4332] via-transparent to-[#7B2D8E]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(82,183,136,0.25),transparent_55%)]" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-32">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium">
            <Sparkles className="w-3.5 h-3.5 text-success" />
            Saltillo · Coahuila · 2026
          </div>
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.05] mb-6 text-center tracking-tight">
          Saltillo respira.
          <br />
          <span className="bg-gradient-to-r from-white via-success/90 to-secondary bg-clip-text text-transparent">
            Saltillo protege.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 font-light text-center leading-relaxed">
          La Ley de Seres Sintientes existe. Los datos del aire existen. Solo
          falta que <em className="not-italic font-medium text-success">lleguen a ti</em>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
          <a
            href="#stats"
            className="group inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full font-medium text-sm hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/20 transition-all"
          >
            Explorar la plataforma
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a
            href="#compromisos"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-7 py-3.5 rounded-full font-medium text-sm hover:bg-white/15 transition-all"
          >
            Firmar mi compromiso
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { icon: PawPrint, target: 250000, suffix: "", label: "perros en situación de calle" },
            { icon: Wind, target: 164, suffix: "", label: "días de mala calidad del aire en 2025" },
            { icon: Scale, target: 4, suffix: " años", label: "de prisión por abandono animal" },
          ].map(({ icon: Icon, target, suffix, label }, i) => (
            <div
              key={i}
              className="group relative backdrop-blur-md bg-white/8 border border-white/15 rounded-2xl p-5 hover:bg-white/12 transition-all"
            >
              <Icon className="w-5 h-5 text-success mb-3" />
              <p className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-white leading-none">
                <AnimatedCounter target={target} suffix={suffix} />
              </p>
              <p className="text-white/65 text-xs md:text-[13px] mt-2 leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="w-5 h-9 border-2 border-white/25 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2.5 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
