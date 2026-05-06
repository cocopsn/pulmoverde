/**
 * Initial knowledge base for the PulmoVerde RAG bot.
 * Run via POST /api/admin/reindex with `seed: true`.
 *
 * Each entry becomes one row in `rag_documents`. The bot retrieves the
 * top-K most relevant entries for any user question. Edit through the
 * admin panel — the seed is only for first-run / reset.
 */
import { escenarios } from "@/data/escenarios";
import { perfiles, niveles, datosContexto } from "@/data/perfiles-ica";
import { colonias } from "@/data/colonias";

export interface SeedDoc {
  title: string;
  content: string;
  category: string;
  source?: string;
}

const organizacion: SeedDoc[] = [
  {
    title: "Qué es PulmoVerde",
    category: "organizacion",
    source: "PulmoVerde",
    content: `PulmoVerde es una plataforma ciudadana de educación ambiental y bienestar animal para Saltillo, Coahuila. Su misión es traducir información compleja sobre la Ley de Protección y Trato Digno a los Seres Sintientes (Coahuila, 2023) y la calidad del aire local en herramientas accionables para cualquier persona del municipio.

La plataforma tiene tres módulos: (1) Explorador de la Ley de Seres Sintientes con 15 escenarios reales y la sanción aplicable, (2) Traductor del Aire que convierte el Índice de Calidad del Aire (ICA) en recomendaciones por perfil de riesgo, y (3) Compromisos Ciudadanos donde cualquier persona firma acciones concretas y se visualiza dónde se concentra la respuesta en un mapa de Saltillo.

PulmoVerde no es gobierno: es ciudadanía organizada que conecta la ley existente con la vida cotidiana.`,
  },
  {
    title: "Equipo desarrollador",
    category: "organizacion",
    source: "Tec de Monterrey Saltillo, Semana Tec con Sentido Humano",
    content: `PulmoVerde fue desarrollado en mayo de 2026 dentro del programa Semana Tec con Sentido Humano del Tecnológico de Monterrey Campus Saltillo.

Equipo: Armando Javier Flores Salazar, David Gil Alvarado, Ramón De León Cabrera, Emiliano García Cárdenas.

La organización social receptora (OSF) es el Centro de Bienestar Animal Municipal de Saltillo (CBAM), dirigido por Isaac Medina.`,
  },
  {
    title: "Centro de Bienestar Animal Municipal de Saltillo (CBAM)",
    category: "organizacion",
    source: "CBAM",
    content: `El CBAM es la organización social receptora de PulmoVerde. Es la entidad municipal encargada del bienestar animal en Saltillo: rescate, esterilización, adopción y aplicación de la Ley de Seres Sintientes a nivel municipal.

Director: Isaac Medina.

Para reportes de maltrato o abandono el canal principal es la Dirección de Medio Ambiente Municipal y, en casos penales, la Comisaría de Seguridad Pública (844-411-6800) o la Fiscalía General del Estado (844-411-2000).`,
  },
  {
    title: "Licencia y fuentes",
    category: "organizacion",
    source: "PulmoVerde",
    content: `PulmoVerde se distribuye bajo licencia Creative Commons BY-NC-SA 4.0: cualquier persona puede usar, adaptar y compartir el contenido para fines no comerciales mientras dé crédito y comparta bajo la misma licencia.

Fuentes consultadas: SIMA Coahuila, IMPLAN Saltillo, Congreso de Coahuila (Ley de Protección y Trato Digno a los Seres Sintientes 2023), IQAir, RUOA-UNAM, Vanguardia, Código Penal de Coahuila.`,
  },
];

const aire: SeedDoc[] = [
  {
    title: "Calidad del aire en Saltillo — panorama 2025-2026",
    category: "aire",
    source: "Vanguardia / SIMA Coahuila",
    content: `Saltillo registró ${datosContexto.diasMalaCalidad2025} días con mala calidad del aire en 2025. El primer trimestre de 2026 registró ${datosContexto.diasMalaCalidad2026Q1} días — la cifra más baja en cinco años.

La concentración promedio de partículas PM2.5 en Saltillo es ${datosContexto.pm25VsOMS}× superior al valor de referencia anual de la Organización Mundial de la Salud (OMS), según IQAir. Esto significa que el aire que respira un saltillense en promedio contiene más del doble de partículas finas que lo que la OMS considera seguro.

PM2.5 son partículas tan pequeñas que penetran hasta los alvéolos pulmonares y al torrente sanguíneo. Causan asma, EPOC, infartos y se vinculan con bajo peso al nacer.`,
  },
  {
    title: "Niveles del Índice de Calidad del Aire (ICA)",
    category: "aire",
    source: "NOM-172-SEMARNAT",
    content: niveles
      .map(
        (n) =>
          `${n.nombre} (ICA ${n.rango}): código de color ${n.color}. ${
            n.id === "buena"
              ? "Aire saludable. Sin restricciones."
              : n.id === "aceptable"
              ? "Algunos grupos sensibles deben moderar la exposición."
              : n.id === "mala"
              ? "Toda la población debe reducir la exposición. Cerrar ventanas si hay olor."
              : n.id === "muy_mala"
              ? "Riesgo significativo para todos. Permanecer en interiores."
              : "Emergencia sanitaria. No salir bajo ninguna circunstancia."
          }`,
      )
      .join("\n\n"),
  },
  ...perfiles.map((p) => ({
    title: `Recomendaciones por nivel ICA — ${p.nombre}`,
    category: "aire",
    source: "PulmoVerde Traductor del Aire",
    content: `Perfil: ${p.nombre}.\n\n${niveles
      .map((n) => `Aire ${n.nombre} (${n.rango}): ${p.recomendaciones[n.id]}`)
      .join("\n\n")}`,
  })),
  {
    title: "Cinco fuentes principales de contaminación en Saltillo",
    category: "aire",
    source: "SMA Coahuila / IMPLAN",
    content: datosContexto.fuentes
      .map((f) => `${f.nombre}: ${f.porcentaje}% del PM2.5 atribuible.`)
      .join("\n") +
      `\n\nLas ladrilleras artesanales (28%) y la quema de basura (22%) son responsables de casi la mitad del PM2.5 inhalable en la zona metropolitana. Ambas son ilegales sin permiso ambiental y se denuncian a la Dirección de Medio Ambiente Municipal.`,
  },
  {
    title: "Red de monitoreo del aire en Saltillo",
    category: "aire",
    source: "SMA Coahuila + Municipio + RUOA-UNAM",
    content: `Saltillo cuenta con: ${datosContexto.sensores.smaCoahuila} sensores de la Secretaría de Medio Ambiente de Coahuila (SMA), ${datosContexto.sensores.municipio} sensores municipales, ${datosContexto.sensores.estacionesAutomaticas} estaciones automáticas y ${datosContexto.sensores.unam} estación de la Red Universitaria de Observatorios Atmosféricos (RUOA-UNAM).

Los datos en tiempo real están en http://aire.saltillo.gob.mx (municipal) y en https://www.aire.cdmx.gob.mx (federal). El bot puede explicar cómo leer un valor ICA específico — pregúntale "qué hago si el ICA está en 130".`,
  },
];

const ley: SeedDoc[] = [
  {
    title: "Ley de Protección y Trato Digno a los Seres Sintientes — visión general",
    category: "ley",
    source: "Congreso de Coahuila, 2023",
    content: `La Ley de Protección y Trato Digno a los Seres Sintientes de Coahuila se publicó en 2023. Reconoce a los animales no humanos como seres sintientes (capaces de experimentar dolor, miedo y bienestar) y establece obligaciones para personas físicas, criaderos y autoridades.

Las violaciones más graves (abandono, crueldad, peleas, envenenamiento) están tipificadas en el Código Penal de Coahuila como delitos con penas de 1 a 6 años de prisión y multas de hasta 2,000 días de salario mínimo. Otras violaciones (venta ambulante, mutilación estética, criaderos sin veterinario) son faltas administrativas con multa y/o decomiso.

Canales de denuncia: Comisaría de Seguridad Pública (844-411-6800) para delitos en flagrancia, Fiscalía General del Estado (844-411-2000) para denuncia formal, y la Dirección de Medio Ambiente Municipal para faltas administrativas.`,
  },
  ...escenarios.map((e) => ({
    title: `Escenario: ${e.titulo}`,
    category: "ley",
    source: e.articulo,
    content: `${e.descripcion}\n\nCategoría: ${e.categoria}.\nFundamento legal: ${e.articulo}.\nSanción: ${e.sancion}.\nCanal de denuncia: ${e.canalDenuncia}.`,
  })),
  {
    title: "Cómo y dónde denunciar maltrato animal en Saltillo",
    category: "ley",
    source: "PulmoVerde",
    content: `Para denunciar:

1. EMERGENCIA / DELITO EN CURSO (animal siendo golpeado, peleas en flagrancia): Comisaría de Seguridad Pública 844-411-6800.

2. DENUNCIA FORMAL DE DELITO (envenenamiento, peleas, atropello intencional): Fiscalía General del Estado 844-411-2000.

3. FALTA ADMINISTRATIVA (perros en azotea, sin agua, criaderos ilegales, venta ambulante): Dirección de Medio Ambiente Municipal de Saltillo.

4. CRIADEROS QUE VENDEN CACHORROS ENFERMOS: Dirección de Medio Ambiente + PROFECO.

Recomendaciones para cualquier denuncia: documenta con fotos y video con fecha visible, anota dirección exacta, hora y testigos. La denuncia anónima es válida pero la denuncia con nombre tiene más fuerza legal.`,
  },
];

const compromisos: SeedDoc[] = [
  {
    title: "Compromisos ciudadanos disponibles en PulmoVerde",
    category: "compromisos",
    source: "PulmoVerde",
    content: `Cualquier persona puede firmar uno o varios compromisos ciudadanos:

- Esterilizar a mi mascota (controla la sobrepoblación canina y reduce abandono).
- No quemar basura (evita el 22% del PM2.5 atribuible).
- Afinar mi vehículo (reduce el 25% de PM2.5 vehicular).
- Adoptar en lugar de comprar (combate criaderos ilegales y venta ambulante).
- Reportar ladrilleras ilegales (responsables del 28% del PM2.5).
- Reducir uso de automóvil (transporte público, bici, caminar).
- Separar mis residuos (reduce quema y vertederos a cielo abierto).
- Difundir la Ley de Seres Sintientes (multiplica el conocimiento ciudadano).

Cada firma queda registrada con nombre y colonia, y se visualiza en el mapa de Saltillo en tiempo real.`,
  },
  {
    title: "Por qué firmar un compromiso ciudadano",
    category: "compromisos",
    source: "PulmoVerde",
    content: `Firmar un compromiso ciudadano en PulmoVerde no es un trámite legal: es un acto público de adhesión personal. Sirve para:

1. Generar evidencia de demanda ciudadana frente a autoridades locales.
2. Visualizar dónde se concentra la conciencia ambiental por colonia.
3. Crear comunidad — verás compromisos firmados por personas de tu propia colonia.
4. Recordarte a ti mismo a qué te comprometiste, y darle seguimiento.

Los datos se guardan en Supabase (cumple con leyes de protección de datos personales) y solo se almacena el primer nombre y la colonia, no datos sensibles.`,
  },
];

const colonias_doc: SeedDoc[] = [
  {
    title: "Colonias cubiertas por PulmoVerde",
    category: "colonias",
    source: "IMPLAN Saltillo",
    content: `PulmoVerde permite firmar compromisos en ${colonias.length} colonias del municipio de Saltillo: ${colonias
      .map((c) => c.nombre)
      .join(", ")}.

Si tu colonia no está en la lista, escríbenos: estamos ampliando la cobertura. La selección inicial corresponde a las colonias con mayor densidad poblacional y a las zonas con peor calidad del aire registrada en el sistema SIMA.`,
  },
];

export const SEED_DOCUMENTS: SeedDoc[] = [
  ...organizacion,
  ...aire,
  ...ley,
  ...compromisos,
  ...colonias_doc,
];
