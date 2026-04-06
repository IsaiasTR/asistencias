"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const comisiones = [
  { label: "Ciudad Universitaria - Matemática", value: "25108" },
  { label: "Ramos Mejía - Matemática", value: "75106" },
  { label: "Ramos Mejía - Análisis Matemático 1", value: "77214" },
];

const carrerasPorComision: any = {
  "25108": [
    "Arquitectura","Diseño Gráfico","Diseño de Imagen y Sonido",
    "Diseño de Indumentaria","Diseño Textil","Diseño Industrial",
    "Lic. en Planificación y Diseño del Paisaje","Lic. en Psicología","Medicina",
    "Lic. en Enfermería","Lic. en Fonoaudiología","Lic. en Kinesiología",
    "Lic. en Nutrición","Lic. en Obstetricia",
    "Lic. en Producción de Bioimágenes","Lic. en Podología"
  ],
  "75106": [
    "Lic. en Psicología","Lic. en Musicoterapia",
    "Profesorado en Psicología","Lic. en Terapia Ocupacional"
  ],
  "77214": [
    "Lic. en Administración","Contador Público","Lic. en Economía",
    "Lic. en Sistemas","Actuario","Tec. en Análisis de Datos"
  ]
};

export default function RegistroEstudiantil() {

  const router = useRouter();

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const cerrarMensaje = () => {
    setMensaje("");
    setTipoMensaje("");
  };

  const [form, setForm] = useState({
    dni: "",
    apellido: "",
    nombre: "",
    gmail: "",
    comision: "",
    carrera: "",
    edad: "",
    genero: "",
    nacionalidad: "",
    estado_civil: "",
    colegio: "",
    nota_mate: "",
    primera_vez: "",
    materias_total: "",
    materias_presenciales: "",
    materias_ubaxxi: "",
    horas_estudio: "",
    situacion_laboral: "",
    tiempo_viaje: "",
    primer_universitario: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const camposFaltantes = Object.entries(form)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (camposFaltantes.length > 0) {

      const nombresCampos: any = {
        dni: "DNI",
        apellido: "Apellido",
        nombre: "Nombre",
        gmail: "Correo electrónico",
        comision: "Sede y materia",
        carrera: "Carrera",
        edad: "Edad",
        genero: "Género",
        nacionalidad: "Nacionalidad",
        estado_civil: "Estado civil",
        colegio: "Tipo de colegio",
        nota_mate: "Nota de matemática",
        primera_vez: "Primera vez cursando",
        materias_total: "Cantidad de materias",
        materias_presenciales: "Materias presenciales",
        materias_ubaxxi: "Materias UBAXXI",
        horas_estudio: "Horas de estudio",
        situacion_laboral: "Situación laboral",
        tiempo_viaje: "Tiempo de viaje",
        primer_universitario: "Primer universitario"
      };

      const camposLegibles = camposFaltantes.map(c => nombresCampos[c]);

      setTipoMensaje("error");
      setMensaje(`Falta completar: ${camposLegibles.join(", ")}`);
      return;
    }

    const { data: existente } = await supabase
      .from("alumnos")
      .select("dni")
      .eq("dni", form.dni)
      .single();

    if (existente) {
      setTipoMensaje("error");
      setMensaje("Usted ya está registrado");
      return;
    }

    const { error } = await supabase.from("alumnos").insert([
      {
        dni: form.dni,
        apellido: form.apellido,
        nombre: form.nombre,
        gmail: form.gmail,
        comision: form.comision,
        carrera: form.carrera,
      },
    ]);

    if (error) {
      setTipoMensaje("error");
      setMensaje("Error al guardar alumno");
      return;
    }

    const respuestas = [
      { pregunta: "Edad", respuesta: form.edad },
      { pregunta: "Genero", respuesta: form.genero },
      { pregunta: "Nacionalidad", respuesta: form.nacionalidad },
      { pregunta: "Estado civil", respuesta: form.estado_civil },
      { pregunta: "Tipo de colegio de procedencia", respuesta: form.colegio },
      { pregunta: "Nota matemática secundaria", respuesta: form.nota_mate },
      { pregunta: "Primera vez cursando Matemática", respuesta: form.primera_vez },
      { pregunta: "Materias inscriptas", respuesta: form.materias_total },
      { pregunta: "Materias presenciales", respuesta: form.materias_presenciales },
      { pregunta: "Materias UBAXXI", respuesta: form.materias_ubaxxi },
      { pregunta: "Horas de estudio", respuesta: form.horas_estudio },
      { pregunta: "Situación laboral", respuesta: form.situacion_laboral },
      { pregunta: "Tiempo de viaje", respuesta: form.tiempo_viaje },
      { pregunta: "Primer universitario", respuesta: form.primer_universitario },
    ].map((r) => ({
      dni: form.dni,
      pregunta: r.pregunta,
      respuesta: r.respuesta,
    }));

    await supabase.from("respuestas_estudiante").insert(respuestas);

    setTipoMensaje("success");
    setMensaje("Datos guardados correctamente");

    setForm({
      dni: "",
      apellido: "",
      nombre: "",
      gmail: "",
      comision: "",
      carrera: "",
      edad: "",
      genero: "",
      nacionalidad: "",
      estado_civil: "",
      colegio: "",
      nota_mate: "",
      primera_vez: "",
      materias_total: "",
      materias_presenciales: "",
      materias_ubaxxi: "",
      horas_estudio: "",
      situacion_laboral: "",
      tiempo_viaje: "",
      primer_universitario: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6 relative">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Registro Estudiantil
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input name="dni" placeholder="DNI" onChange={handleChange} className="input"/>
          <input name="apellido" placeholder="Apellidos" onChange={handleChange} className="input"/>
          <input name="nombre" placeholder="Nombres" onChange={handleChange} className="input"/>
          <input name="gmail" placeholder="Correo electrónico" onChange={handleChange} className="input"/>

          <select name="comision" onChange={handleChange} className="input">
            <option value="">Seleccionar sede y materia</option>
            {comisiones.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <select name="carrera" onChange={handleChange} className="input">
            <option value="">Seleccionar Carrera</option>
            {carrerasPorComision[form.comision]?.map((c: string) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input name="edad" placeholder="Edad" onChange={handleChange} className="input"/>

          {/* 🔥 BOTONES */}
          <div className="flex gap-4 mt-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold transition">
              REGISTRAR
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-xl font-semibold transition"
            >
              SALIR
            </button>
          </div>

        </form>
      </div>

      {/* 🔥 MODAL */}
      {mensaje && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center relative">

            <button
              onClick={cerrarMensaje}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className={`text-xl font-bold mb-4 ${
              tipoMensaje === "success" ? "text-green-600" : "text-red-600"
            }`}>
              {tipoMensaje === "success" ? "ÉXITO" : "ERROR"}
            </h2>

            <p className="text-lg">{mensaje}</p>

            <button
              onClick={cerrarMensaje}
              className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-xl"
            >
              Cerrar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}


