"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegistroAsistencias() {

  const [dni, setDni] = useState("");
  const [clave, setClave] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const cerrarMensaje = () => {
    setMensaje("");
    setTipoMensaje("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // 🔴 Validación básica
    if (!dni || !clave) {
      setTipoMensaje("error");
      setMensaje("Debe completar DNI y clave");
      return;
    }

    // 🔎 Verificar si el alumno existe
    const { data: alumno } = await supabase
      .from("alumnos")
      .select("dni")
      .eq("dni", dni)
      .single();

    if (!alumno) {
      setTipoMensaje("error");
      setMensaje("DNI o clave incorrectos");
      return;
    }

    // 🔑 Validar clave
    const { data: claveData } = await supabase
      .from("claves_clase")
      .select("clase")
      .eq("clave", clave)
      .eq("activa", true)
      .single();

    if (!claveData) {
      setTipoMensaje("error");
      setMensaje("DNI o clave incorrectos");
      return;
    }

    const clase = claveData.clase;

    // 🚫 Evitar doble registro
    const { data: existente } = await supabase
      .from("asistencias")
      .select("id")
      .eq("dni", dni)
      .eq("clase", clase)
      .single();

    if (existente) {
      setTipoMensaje("error");
      setMensaje(`Ya registraste asistencia para ${clase}`);
      return;
    }

    // ✅ Registrar asistencia
    const { error } = await supabase.from("asistencias").insert([
      {
        dni: dni,
        clase: clase,
        presente: true
      }
    ]);

    if (error) {
      setTipoMensaje("error");
      setMensaje("Error al registrar asistencia");
      return;
    }

    setTipoMensaje("success");
    setMensaje(`Asistencia registrada correctamente (${clase})`);

    setDni("");
    setClave("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6 relative">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Registro de Asistencias
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Ingresar DNI"
            className="input"
          />

          <input
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Clave de la clase"
            className="input"
          />

          <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold transition">
            REGISTRAR ASISTENCIA
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-xl font-semibold transition"
          >
            SALIR
          </button>

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
              {tipoMensaje === "success" ? "Éxito" : "Error"}
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

