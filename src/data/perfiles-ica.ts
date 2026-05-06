export type NivelICA = "buena" | "aceptable" | "mala" | "muy_mala" | "extrema";

export interface NivelInfo {
  id: NivelICA;
  nombre: string;
  rango: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const niveles: NivelInfo[] = [
  { id: "buena", nombre: "Buena", rango: "0-50", color: "#52B788", bgColor: "bg-success", textColor: "text-white" },
  { id: "aceptable", nombre: "Aceptable", rango: "51-100", color: "#F4D03F", bgColor: "bg-yellow-400", textColor: "text-text-dark" },
  { id: "mala", nombre: "Mala", rango: "101-150", color: "#E76F51", bgColor: "bg-warning", textColor: "text-white" },
  { id: "muy_mala", nombre: "Muy mala", rango: "151-200", color: "#9B2226", bgColor: "bg-danger", textColor: "text-white" },
  { id: "extrema", nombre: "Extremadamente mala", rango: ">200", color: "#7B2D8E", bgColor: "bg-purple", textColor: "text-white" },
];

export interface Perfil {
  id: string;
  nombre: string;
  icono: string;
  recomendaciones: Record<NivelICA, string>;
}

export const perfiles: Perfil[] = [
  {
    id: "nino",
    nombre: "Nino menor de 12",
    icono: "Baby",
    recomendaciones: {
      buena: "Actividades normales al aire libre. Aprovecha para jugar en el parque.",
      aceptable: "Reducir tiempo de juego exterior intenso. Preferir actividades moderadas.",
      mala: "Evitar educacion fisica al aire libre. Recreo en interiores.",
      muy_mala: "Permanecer en interiores. Cerrar ventanas. Evitar toda actividad exterior.",
      extrema: "No salir de casa bajo ninguna circunstancia. Acudir a medico si hay sintomas respiratorios.",
    },
  },
  {
    id: "embarazada",
    nombre: "Mujer embarazada",
    icono: "Heart",
    recomendaciones: {
      buena: "Sin restricciones. Caminar y hacer ejercicio moderado con normalidad.",
      aceptable: "Evitar ejercicio intenso al aire libre. Caminatas cortas solamente.",
      mala: "Caminar solo en interiores. Evitar zonas de trafico pesado.",
      muy_mala: "No salir de casa. Usar purificador de aire si es posible.",
      extrema: "Emergencia: contactar medico si hay dificultad respiratoria. No salir.",
    },
  },
  {
    id: "adulto_mayor",
    nombre: "Adulto mayor (60+)",
    icono: "UserRound",
    recomendaciones: {
      buena: "Actividades normales. Buen dia para caminar al parque.",
      aceptable: "Reducir esfuerzo fisico al aire libre. Paseos cortos.",
      mala: "Permanecer en interiores. Monitorear presion arterial.",
      muy_mala: "No salir. Mantener ventanas cerradas. Tener medicamentos a la mano.",
      extrema: "Emergencia cardiovascular posible. No salir. Contactar medico ante cualquier sintoma.",
    },
  },
  {
    id: "deportista",
    nombre: "Deportista",
    icono: "Dumbbell",
    recomendaciones: {
      buena: "Entrenar con normalidad al aire libre. Condiciones optimas.",
      aceptable: "Entrenar en horarios de menor contaminacion (6-8 AM). Hidratarse bien.",
      mala: "Entrenar exclusivamente en interiores. No correr al aire libre.",
      muy_mala: "Suspender entrenamiento intenso. Solo ejercicio ligero en interiores.",
      extrema: "No hacer ejercicio. El esfuerzo fisico aumenta la inhalacion de particulas.",
    },
  },
  {
    id: "trabajador",
    nombre: "Trabajador al aire libre",
    icono: "HardHat",
    recomendaciones: {
      buena: "Trabajo normal sin restricciones.",
      aceptable: "Usar cubrebocas N95 si es posible. Hidratarse frecuentemente.",
      mala: "Rotacion de actividades. Descansos cada hora en interiores.",
      muy_mala: "Suspender trabajo exterior si es posible. Usar proteccion N95 obligatoria.",
      extrema: "No trabajar al aire libre bajo ninguna circunstancia. Riesgo grave a la salud.",
    },
  },
];

export const datosContexto = {
  diasMalaCalidad2025: 164,
  diasMalaCalidad2026Q1: 39,
  pm25VsOMS: 2.4,
  fuentes: [
    { nombre: "Ladrilleras artesanales", icono: "Factory", porcentaje: 28 },
    { nombre: "Quema de basura", icono: "Flame", porcentaje: 22 },
    { nombre: "Vehiculos automotores", icono: "Car", porcentaje: 25 },
    { nombre: "Industria nocturna", icono: "Moon", porcentaje: 15 },
    { nombre: "Polvo por aridez del suelo", icono: "Wind", porcentaje: 10 },
  ],
  sensores: {
    smaCoahuila: 30,
    municipio: 19,
    unam: 1,
    estacionesAutomaticas: 4,
  },
};
