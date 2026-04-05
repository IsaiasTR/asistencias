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

    // 🔴 VALIDAR CAMPOS VACÍOS
    const camposFaltantes = Object.entries(form)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (camposFaltantes.length > 0) {
      alert("Falta completar los siguientes campos");
      return;
    }

    // 🔴 VALIDAR DNI EXISTENTE
    const { data: existente } = await supabase
      .from("alumnos")
      .select("dni")
      .eq("dni", form.dni)
      .single();

    if (existente) {
      alert("Usted ya está registrado");
      return;
    }

    // 🔵 INSERTAR ALUMNO
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

    // 🔵 INSERTAR RESPUESTAS
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

    // 🟢 MENSAJE FINAL
    alert("Datos guardados correctamente");

    // 🔄 LIMPIAR FORMULARIO
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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
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

          <select name="genero" onChange={handleChange} className="input">
            <option value="">Género</option>
            <option>Masculino</option>
            <option>Femenino</option>
            <option>Otro</option>
          </select>

          <select name="nacionalidad" onChange={handleChange} className="input">
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

          <select name="estado_civil" onChange={handleChange} className="input">
            <option value="">Estado civil</option>
            <option>Soltero</option>
            <option>Casado</option>
          </select>

          <select name="colegio" onChange={handleChange} className="input">
            <option value="">Tipo de colegio de procedencia</option>
            <option>Público</option>
            <option>Privado religioso</option>
            <option>Privado laico</option>
            <option>Técnico</option>
            <option>Otro</option>
          </select>

          <input name="nota_mate" placeholder="Nota final de matemática en la secundaria" onChange={handleChange} className="input"/>

          <select name="primera_vez" onChange={handleChange} className="input">
            <option value="">¿Es la primera vez que cursás Matemática?</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>

          <select name="materias_total" onChange={handleChange} className="input">
            <option value="">Cantidad de materias que está cursando actualmente</option>
            {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
          </select>

          <select name="materias_presenciales" onChange={handleChange} className="input">
            <option value="">Materias presenciales</option>
            {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
          </select>

          <select name="materias_ubaxxi" onChange={handleChange} className="input">
            <option value="">Materias por UBAXXI</option>
            {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
          </select>

          <select name="horas_estudio" onChange={handleChange} className="input">
            <option value="">¿Cuántas horas por semana piensa dedicarle a esta materia?</option>
            <option>2 horas</option>
            <option>4 horas</option>
            <option>6 horas</option>
            <option>8 horas</option>
            <option>10 horas</option>
            <option>12 horas</option>
          </select>

          <select name="situacion_laboral" onChange={handleChange} className="input">
            <option value="">Situación laboral</option>
            <option>Trabajo</option>
            <option>No Trabajo</option>
          </select>

          <select name="tiempo_viaje" onChange={handleChange} className="input">
            <option value="">Tiempo de viaje para llegar a la sede</option>
            <option>Menos de 30 min</option>
            <option>30 min - 1 hora</option>
            <option>Más de 1 hora</option>
          </select>

          <select name="primer_universitario" onChange={handleChange} className="input">
            <option value="">¿Primer universitario en la familia?</option>
            <option>Si</option>
            <option>No</option>
          </select>

          <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold transition">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
