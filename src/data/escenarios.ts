export type Categoria = "Abandono" | "Maltrato físico" | "Negligencia" | "Venta ilegal" | "Crueldad";

export interface Escenario {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  articulo: string;
  sancion: string;
  canalDenuncia: string;
  icono: string;
}

export const escenarios: Escenario[] = [
  {
    id: 1,
    titulo: "Vecino se mudó y dejó a su perro encerrado",
    descripcion:
      "Tu vecino se mudó y dejó a su perro encerrado sin comida ni agua. El animal lleva días ladrando y nadie se hace cargo.",
    categoria: "Abandono",
    articulo: "Art. 4 fracc. XLII Ley de Seres Sintientes + Código Penal de Coahuila",
    sancion: "2-4 años de prisión, 100-500 días multa",
    canalDenuncia: "Comisaría de Seguridad Pública: 844-411-6800",
    icono: "Home",
  },
  {
    id: 2,
    titulo: "Caja de cachorros abandonada en terreno baldío",
    descripcion:
      "Alguien dejó una caja de cachorros recién nacidos en un terreno baldío sin ningún tipo de cuidado.",
    categoria: "Abandono",
    articulo: "Art. 4 fracc. XLII Ley de Seres Sintientes + Código Penal de Coahuila",
    sancion: "2-4 años de prisión, 100-500 días multa",
    canalDenuncia: "Dirección de Medio Ambiente Municipal",
    icono: "Package",
  },
  {
    id: 3,
    titulo: "Perro viejo abandonado en carretera",
    descripcion:
      "Una persona deja a su perro viejo en la carretera porque ya no lo quiere. El animal no sabe regresar a casa.",
    categoria: "Abandono",
    articulo: "Art. 4 fracc. XLII Ley de Seres Sintientes + Código Penal de Coahuila",
    sancion: "2-4 años de prisión, 100-500 días multa + decomiso de todos sus animales",
    canalDenuncia: "Comisaría de Seguridad Pública: 844-411-6800",
    icono: "MapPin",
  },
  {
    id: 4,
    titulo: "Vecino golpea a su perro con frecuencia",
    descripcion:
      "Tu vecino golpea a su perro de manera constante. El animal muestra signos visibles de maltrato físico.",
    categoria: "Maltrato físico",
    articulo: "Art. 20 Código Penal de Coahuila",
    sancion: "1-3 años de prisión, 100-500 días multa",
    canalDenuncia: "Comisaría de Seguridad Pública: 844-411-6800",
    icono: "AlertTriangle",
  },
  {
    id: 5,
    titulo: "Perro amarrado sin agua bajo el sol",
    descripcion:
      "Un negocio mantiene a un perro amarrado sin agua bajo el sol directo como supuesto perro guardián. El animal sufre deshidratación.",
    categoria: "Maltrato físico",
    articulo: "Art. 20 Código Penal de Coahuila — Negligencia punible",
    sancion: "1-3 años de prisión, 100-500 días multa",
    canalDenuncia: "Dirección de Medio Ambiente Municipal",
    icono: "Sun",
  },
  {
    id: 6,
    titulo: "Atropello intencional de un perro",
    descripcion:
      "Alguien atropelló a un perro intencionalmente con su vehículo. Hay testigos del acto.",
    categoria: "Maltrato físico",
    articulo: "Art. 20 Código Penal — Crueldad agravada",
    sancion: "2-4 años de prisión, agravante por dolo",
    canalDenuncia: "Ministerio Público / Fiscalía General del Estado",
    icono: "Car",
  },
  {
    id: 7,
    titulo: "Perro en azotea sin sombra ni agua",
    descripcion:
      "Un perro vive permanentemente en una azotea sin sombra, sin agua y sin alimento adecuado.",
    categoria: "Negligencia",
    articulo: "Art. 20 Código Penal + Ley Seres Sintientes Cap. IV",
    sancion: "1-3 años de prisión, 100-500 días multa",
    canalDenuncia: "Dirección de Medio Ambiente Municipal",
    icono: "CloudSun",
  },
  {
    id: 8,
    titulo: "15 perros hacinados en un cuarto",
    descripcion:
      "Una persona tiene 15 perros hacinados en un cuarto pequeño. Los animales están desnutridos y enfermos.",
    categoria: "Negligencia",
    articulo: "Art. 20 Código Penal — Acumulación animal",
    sancion: "1-3 años de prisión + decomiso de los animales",
    canalDenuncia: "Comisaría de Seguridad Pública: 844-411-6800",
    icono: "Users",
  },
  {
    id: 9,
    titulo: "Criadero vende cachorros enfermos sin certificado",
    descripcion:
      "Un criadero vende cachorros enfermos sin certificado veterinario. Los compradores descubren enfermedades graves días después.",
    categoria: "Negligencia",
    articulo: "Art. 34 Ley de Seres Sintientes — Requiere médico veterinario con título y cédula",
    sancion: "Clausura del establecimiento + multa administrativa",
    canalDenuncia: "Dirección de Medio Ambiente Municipal + PROFECO",
    icono: "FileWarning",
  },
  {
    id: 10,
    titulo: "Venta de cachorros en redes sociales sin autorización",
    descripcion:
      "Una persona vende cachorros por Facebook e Instagram sin ningún tipo de autorización ni certificación veterinaria.",
    categoria: "Venta ilegal",
    articulo: "Art. 20 fracc. III Ley de Seres Sintientes",
    sancion: "Multa administrativa + decomiso de animales",
    canalDenuncia: "Dirección de Medio Ambiente Municipal",
    icono: "Smartphone",
  },
  {
    id: 11,
    titulo: "Perritos como premio en kermés escolar",
    descripcion:
      "En una kermés escolar regalan perritos como premio en un juego de azar.",
    categoria: "Venta ilegal",
    articulo: "Art. 20 fracc. V Ley de Seres Sintientes",
    sancion: "Multa administrativa al organizador del evento",
    canalDenuncia: "Dirección de Medio Ambiente Municipal",
    icono: "Gift",
  },
  {
    id: 12,
    titulo: "Venta de perritos en el semáforo",
    descripcion:
      "Un señor vende perritos de raza en el semáforo, expuestos al sol y al tráfico.",
    categoria: "Venta ilegal",
    articulo: "Art. 20 fracc. III — Venta ambulante prohibida",
    sancion: "Multa administrativa + decomiso de animales",
    canalDenuncia: "Policía Municipal / Dirección de Medio Ambiente",
    icono: "TrafficCone",
  },
  {
    id: 13,
    titulo: "Organización de peleas de perros",
    descripcion:
      "Se organizan peleas de perros clandestinas en una propiedad. Se cobra entrada y se hacen apuestas.",
    categoria: "Crueldad",
    articulo: "Código Penal de Coahuila — Crueldad agravada",
    sancion: "2-6 años de prisión, 1,000-2,000 días multa + decomiso de animales",
    canalDenuncia: "Fiscalía General del Estado: 844-411-2000",
    icono: "Swords",
  },
  {
    id: 14,
    titulo: "Envenenamiento deliberado de perros callejeros",
    descripcion:
      "Alguien coloca veneno en alimento para matar perros callejeros del vecindario de forma deliberada.",
    categoria: "Crueldad",
    articulo: "Código Penal + Ley Seres Sintientes — Crueldad extrema",
    sancion: "2-6 años de prisión + responsabilidad civil por daños",
    canalDenuncia: "Fiscalía General del Estado: 844-411-2000",
    icono: "Skull",
  },
  {
    id: 15,
    titulo: "Mutilación estética sin justificación médica",
    descripcion:
      "Corte de orejas o cola a un perro por razones puramente estéticas, sin justificación médica veterinaria.",
    categoria: "Crueldad",
    articulo: "Art. 20 fracc. I Ley de Seres Sintientes",
    sancion: "Multa administrativa + posible clausura de establecimiento",
    canalDenuncia: "Dirección de Medio Ambiente Municipal",
    icono: "Scissors",
  },
];

export const categorias: Categoria[] = [
  "Abandono",
  "Maltrato físico",
  "Negligencia",
  "Venta ilegal",
  "Crueldad",
];
