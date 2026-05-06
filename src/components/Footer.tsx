import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="w-6 h-6 text-success" />
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold">PulmoVerde</span>
        </div>

        <div className="text-center space-y-6 text-white/70 text-sm leading-relaxed">
          <p className="text-white/90 font-medium">
            Plataforma ciudadana de educacion ambiental
          </p>

          <p>
            Proyecto de Semana Tec con Sentido Humano · Mayo 2026
            <br />
            Tecnologico de Monterrey Campus Saltillo
          </p>

          <div className="border-t border-white/10 pt-6">
            <p className="text-white/90 font-medium mb-2">Desarrollado por:</p>
            <p>
              Armando Javier Flores Salazar · David Gil Alvarado
              <br />
              Ramon De Leon Cabrera · Emiliano Garcia Cardenas
            </p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-white/90 font-medium mb-2">
              OSF: Centro de Bienestar Animal Municipal de Saltillo (CBAM)
            </p>
            <p>Director: Isaac Medina</p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-xs text-white/50">
              Fuentes: SIMA Coahuila | IMPLAN Saltillo | Congreso de Coahuila
              <br />
              Ley de Proteccion y Trato Digno a los Seres Sintientes (2023)
            </p>
            <p className="text-xs text-white/40 mt-3">
              Licencia: CC BY-NC-SA 4.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
