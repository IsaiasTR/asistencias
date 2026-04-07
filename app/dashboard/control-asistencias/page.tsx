"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ControlAsistencias() {

  const [dni, setDni] = useState("");
  const [asistencias, setAsistencias] = useState<any[]>([]);

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const cerrarMensaje = () => {
    setMensaje("");
    setTipoMensaje("");
  };

  const handleBuscar = async (e: any) => {
    e.preventDefault();

    if (!dni) {
      setTipoMensaje("error");
      setMensaje("Debe ingresar un DNI");
      return;
    }

    // 🔎 Validar si el alumno existe
    const { data: alumno } = await supabase
      .from("alumnos")
      .select("dni")
      .eq("dni", dni)
      .single();

    if (!alumno) {
      setTipoMensaje("error");
      setMensaje("El DNI no está registrado");
      setAsistencias([]);
      return;
    }

    // 📊 Traer asistencias
    const { data, error } = await supabase
      .from("asistencias")
      .select("*")
      .eq("dni", dni)
      .order("clase", { ascending: true });

    if (error) {
      setTipoMensaje("error");
      setMensaje("Error al obtener asistencias");
      return;
    }

    if (!data || data.length === 0) {
      setTipoMensaje("error");
      setMensaje("No hay asistencias registradas");
      setAsistencias([]);
      return;
    }

    setAsistencias(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6 relative">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Control de Asistencias
        </h1>

        {/* 🔍 BUSCADOR */}
        <form onSubmit={handleBuscar} className="flex flex-col gap-4 mb-6">

          <input
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Ingresar DNI"
            className="input"
          />

          <div className="flex gap-4">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold">
              BUSCAR
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-xl font-semibold"
            >
              SALIR
            </button>
          </div>

        </form>

        {/* 📊 TABLA */}
        {asistencias.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">

              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Clase</th>
                  <th className="p-3 text-center">Estado</th>
                </tr>
              </thead>

              <tbody>
                {asistencias.map((a, i) => (
                  <tr key={i} className="border-t">

                    <td className="p-3 font-semibold">
                      {a.clase}
                    </td>

                    <td className={`p-3 text-center font-bold ${
                      a.presente ? "text-green-600" : "text-red-600"
                    }`}>
                      {a.presente ? "Presente" : "Ausente"}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

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


