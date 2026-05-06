"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { supabase } from "@/lib/supabase";
import { colonias } from "@/data/colonias";
import AnimatedSection from "./ui/AnimatedSection";
import "leaflet/dist/leaflet.css";

interface ColoniaCount {
  nombre: string;
  lat: number;
  lng: number;
  count: number;
}

export default function MapaCompromisos() {
  const [data, setData] = useState<ColoniaCount[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: compromisos } = await supabase
        .from("compromisos")
        .select("colonia");

      if (compromisos) {
        const counts: Record<string, number> = {};
        compromisos.forEach((c) => {
          counts[c.colonia] = (counts[c.colonia] || 0) + 1;
        });

        const mapped = colonias
          .map((col) => ({
            nombre: col.nombre,
            lat: col.lat,
            lng: col.lng,
            count: counts[col.nombre] || 0,
          }))
          .filter((c) => c.count > 0);

        setData(mapped);
      }
    }

    fetchData();
  }, []);

  const getRadius = (count: number) => Math.min(8 + count * 3, 30);
  const getColor = (count: number) => {
    if (count >= 10) return "#1B4332";
    if (count >= 5) return "#52B788";
    return "#C75B39";
  };

  return (
    <section className="py-24 bg-secondary/20">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-primary mb-4">
              Mapa de Compromisos
            </h3>
            <p className="text-muted max-w-md mx-auto">
              Visualiza donde se concentran los compromisos ciudadanos en Saltillo.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="rounded-3xl overflow-hidden border border-secondary/50 shadow-lg h-[500px]">
            <MapContainer
              center={[25.42, -100.99]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              {data.map((col) => (
                <CircleMarker
                  key={col.nombre}
                  center={[col.lat, col.lng]}
                  radius={getRadius(col.count)}
                  fillColor={getColor(col.count)}
                  fillOpacity={0.7}
                  stroke={true}
                  color="#fff"
                  weight={2}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold text-sm">{col.nombre}</p>
                      <p className="text-xs text-gray-600">{col.count} compromisos</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </AnimatedSection>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-xs text-muted">1-4 compromisos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs text-muted">5-9 compromisos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted">10+ compromisos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
