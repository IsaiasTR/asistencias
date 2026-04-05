"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

    // 1. Guardar en alumnos
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
      console.log(error);
      return;
    }

    // 2. Guardar respuestas dinámicas
    const respuestas = [
      { pregunta: "Edad", respuesta: form.edad },
      { pregunta: "Genero", respuesta: form.genero },
      { pregunta: "Nacionalidad", respuesta: form.nacionalidad },
      { pregunta: "Estado civil", respuesta: form.estado_civil },
      { pregunta: "Colegio secundario", respuesta: form.colegio },
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

    // limpiar formulario
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
      recursante: "",
      materias_total: "",
      materias_presenciales: "",
      materias_ubaxxi: "",
      horas_estudio: "",
      trabajo: "",
      viaje: "",
      primer_universitario: ""
    });
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">
        Registro Estudiantil
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 max-w-3xl">

        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={(form as any)[key]}
            onChange={handleChange}
            className="border p-2"
          />
        ))}

        <button className="col-span-2 bg-blue-500 text-white p-3 rounded">
          Registrar
        </button>
      </form>
    </div>
  );
}

