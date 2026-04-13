"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ControlAsistencias() {

  const [dni, setDni] = useState("");
  const [asistencias, setAsistencias] = useState<any[]>([]);
  const [alumno, setAlumno] = useState<any>(null);
  const [porcentaje, setPorcentaje] = useState<number | null>(null);

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

    // 🔎 Traer datos del alumno
    const { data: alumnoData } = await supabase
      .from("alumnos")
      .select("dni, apellido, nombre, comision")
      .eq("dni", dni)
      .single();

    if (!alumnoData) {
      setTipoMensaje("error");
      setMensaje("El DNI no está registrado");
      setAsistencias([]);
      setAlumno(null);
      setPorcentaje(null);
      return;
    }

    setAlumno(alumnoData);

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
      setPorcentaje(null);
      return;
    }

    setAsistencias(data);

    // 🔢 CALCULAR PORCENTAJE
    const total = data.length;
    const presentes = data.filter((a) => a.presente).length;

    const porcentajeFinal = (presentes / total) * 100;

    setPorcentaje(porcentajeFinal);
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

        {/* 👤 DATOS DEL ALUMNO */}
        {alumno && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-sm">

            <h2 className="text-xl font-bold text-blue-700 mb-3">
              Información del Alumno
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">

              <p><span className="font-semibold">DNI:</span> {alumno.dni}</p>
              <p><span className="font-semibold">Comisión:</span> {alumno.comision}</p>

              <p><span className="font-semibold">Apellido:</span> {alumno.apellido}</p>
              <p><span className="font-semibold">Nombre:</span> {alumno.nombre}</p>

            </div>

          </div>
        )}

        {/* 📊 TABLA */}
        {asistencias.length > 0 && (
          <>
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

            {/* 📈 PORCENTAJE */}
            {porcentaje !== null && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 text-center shadow-sm">

                <h2 className="text-xl font-bold text-green-700 mb-2">
                  Porcentaje de Asistencia
                </h2>

                <p className={`text-3xl font-bold ${
                  porcentaje >= 75
                    ? "text-green-600"
                    : porcentaje >= 50
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}>
                  {porcentaje.toFixed(1)}%
                </p>

              </div>
            )}
          </>
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




