"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const comisiones = [
  { label: "Ciudad Universitaria - Matemática", value: "25108" },
  { label: "Ramos Mejía - Matemática", value: "75106" },
  { label: "Ramos Mejía - Análisis Matemático 1", value: "77214" },
];

const carrerasPorComision: any = {
  "25108": [
    "Arquitectura","Diseño Gráfico","Diseño de Imagen y Sonido",
    "Diseño de Indumentaria","Diseño Textil","Diseño Industrial",
    "Lic. en Planificación y Diseño del Paisaje","Medicina",
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
    recursante: "",
    materias_total: "",
    materias_presenciales: "",
    materias_ubaxxi: "",
    horas_estudio: "",
    trabajo: "",
    viaje: "",
    primer_universitario: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

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
      alert("Error al guardar alumno");
      return;
    }

    const respuestas = [
      { pregunta: "Edad", respuesta: form.edad },
      { pregunta: "Genero", respuesta: form.genero },
      { pregunta: "Nacionalidad", respuesta: form.nacionalidad },
      { pregunta: "Estado civil", respuesta: form.estado_civil },
      { pregunta: "Colegio", respuesta: form.colegio },
      { pregunta: "Nota matemática secundaria", respuesta: form.nota_mate },
      { pregunta: "Recursante Matemática 51", respuesta: form.recursante },
      { pregunta: "Materias inscriptas", respuesta: form.materias_total },
      { pregunta: "Materias presenciales", respuesta: form.materias_presenciales },
      { pregunta: "Materias UBAXXI", respuesta: form.materias_ubaxxi },
      { pregunta: "Horas de estudio", respuesta: form.horas_estudio },
      { pregunta: "Situación laboral", respuesta: form.trabajo },
      { pregunta: "Tiempo de viaje", respuesta: form.viaje },
      { pregunta: "Primer universitario", respuesta: form.primer_universitario },
    ].map((r) => ({
      dni: form.dni,
      pregunta: r.pregunta,
      respuesta: r.respuesta,
    }));

    await supabase.from("respuestas_estudiante").insert(respuestas);

    alert("Registro completado");
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registro Estudiantil</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input name="dni" placeholder="DNI" onChange={handleChange} className="border p-2"/>
        <input name="apellido" placeholder="Apellido" onChange={handleChange} className="border p-2"/>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} className="border p-2"/>
        <input name="gmail" placeholder="Gmail" onChange={handleChange} className="border p-2"/>

        {/* COMISION */}
        <select name="comision" onChange={handleChange} className="border p-2">
          <option value="">Seleccionar Comisión</option>
          {comisiones.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {/* CARRERA */}
        <select name="carrera" onChange={handleChange} className="border p-2">
          <option value="">Seleccionar Carrera</option>
          {carrerasPorComision[form.comision]?.map((c: string) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input name="edad" placeholder="Edad" onChange={handleChange} className="border p-2"/>

        <select name="genero" onChange={handleChange} className="border p-2">
          <option value="">Genero</option>
          <option>Masculino</option>
          <option>Femenino</option>
          <option>Otro</option>
        </select>

        <select name="nacionalidad" onChange={handleChange} className="border p-2">
          <option value="">Nacionalidad</option>
          <option>Argentina</option>
          <option>Brasil</option>
          <option>Bolivia</option>
          <option>Colombia</option>
          <option>Chile</option>
          <option>Ecuador</option>
          <option>Perú</option>
          <option>Paraguay</option>
          <option>Uruguay</option>
          <option>Venezuela</option>
          <option>Otro</option>
        </select>

        <select name="estado_civil" onChange={handleChange} className="border p-2">
          <option value="">Estado Civil</option>
          <option>Soltero</option>
          <option>Casado</option>
        </select>

        <select name="colegio" onChange={handleChange} className="border p-2">
          <option value="">Tipo de Colegio</option>
          <option>Público</option>
          <option>Privado</option>
        </select>

        <input name="nota_mate" placeholder="Nota matemática secundaria" onChange={handleChange} className="border p-2"/>

        <select name="recursante" onChange={handleChange} className="border p-2">
          <option value="">Recursante</option>
          <option>Si</option>
          <option>No</option>
        </select>

        <input name="materias_total" placeholder="Materias totales" onChange={handleChange} className="border p-2"/>
        <input name="materias_presenciales" placeholder="Materias presenciales" onChange={handleChange} className="border p-2"/>
        <input name="materias_ubaxxi" placeholder="Materias UBAXXI" onChange={handleChange} className="border p-2"/>

        <select name="horas_estudio" onChange={handleChange} className="border p-2">
          <option value="">Horas de estudio</option>
          <option>2 horas</option>
          <option>4 horas</option>
          <option>6 horas</option>
          <option>8 horas</option>
          <option>10 horas</option>
          <option>12 horas</option>
        </select>

        <select name="trabajo" onChange={handleChange} className="border p-2">
          <option value="">Situación laboral</option>
          <option>Trabajo</option>
          <option>No Trabajo</option>
        </select>

        <select name="viaje" onChange={handleChange} className="border p-2">
          <option value="">Tiempo de viaje</option>
          <option>Menos de 30 min</option>
          <option>30 min - 1 hora</option>
          <option>Más de 1 hora</option>
        </select>

        <input name="primer_universitario" placeholder="Primer universitario (Si/No)" onChange={handleChange} className="border p-2"/>

        <button className="bg-blue-500 text-white p-3 rounded">
          Registrar
        </button>
      </form>
    </div>
  );
}


