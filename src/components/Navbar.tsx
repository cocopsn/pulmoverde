"use client";

import { useState, useEffect } from "react";
import { Leaf, Menu, X, MessageCircle } from "lucide-react";

const links = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#ley", label: "Ley" },
  { href: "#aire", label: "Aire" },
  { href: "#compromisos", label: "Compromisos" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md shadow-sm border-b border-secondary/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              scrolled ? "bg-primary text-white" : "bg-white/15 backdrop-blur text-white"
            }`}
          >
            <Leaf className="w-4 h-4" />
          </div>
          <span
            className={`font-[family-name:var(--font-display)] font-semibold text-lg transition-colors ${
              scrolled ? "text-primary" : "text-white"
            }`}
          >
            PulmoVerde
          </span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:opacity-70 ${
                scrolled ? "text-text-dark" : "text-white/90"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#compromisos"
            className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
              scrolled
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white text-primary hover:scale-[1.02]"
            }`}
          >
            Firmar
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden ${scrolled ? "text-text-dark" : "text-white"}`}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-secondary/30 px-6 py-4 space-y-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-text-dark hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#compromisos"
            onClick={() => setOpen(false)}
            className="block bg-primary text-white text-center text-sm font-medium px-4 py-2.5 rounded-full"
          >
            Firmar mi compromiso
          </a>
          <p className="text-xs text-muted flex items-center gap-1.5 pt-2">
            <MessageCircle className="w-3.5 h-3.5" /> Asistente disponible abajo a la derecha
          </p>
        </div>
      )}
    </nav>
  );
}
