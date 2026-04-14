"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminAsistencias() {

  const [estado, setEstado] = useState<boolean | null>(null);
  const [autorizado, setAutorizado] = useState(false);

  // 🔒 PEDIR CLAVE
  useEffect(() => {
    const pass = prompt("Ingrese clave docente");

    if (pass === "1958") {
      setAutorizado(true);
    } else {
      window.location.href = "/dashboard";
    }
  }, []);

  // 🔄 Cargar estado SOLO si está autorizado
  useEffect(() => {
    if (!autorizado) return;

    const cargarEstado = async () => {
      const { data, error } = await supabase
        .from("control_asistencia")
        .select("habilitado")
        .eq("id", 1)
        .single();

      if (error) {
        alert("Error al cargar estado");
        return;
      }

      setEstado(data.habilitado);
    };

    cargarEstado();
  }, [autorizado]);

  const cambiarEstado = async (valor: boolean) => {
    const { error } = await supabase
      .from("control_asistencia")
      .update({ habilitado: valor })
      .eq("id", 1);

    if (error) {
      alert("Error al actualizar estado");
      return;
    }

    setEstado(valor);
  };

  // ⏳ Loader
  if (!autorizado || estado === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6">
          Panel de Asistencias
        </h1>

        <p className="mb-4 text-lg">Estado actual:</p>

        <p className={`text-2xl font-bold mb-6 ${
          estado ? "text-green-600" : "text-red-600"
        }`}>
          {estado ? "HABILITADO" : "DESHABILITADO"}
        </p>

        <div className="flex gap-4">

          <button
            onClick={() => cambiarEstado(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold"
          >
            HABILITAR
          </button>

          <button
            onClick={() => cambiarEstado(false)}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl font-semibold"
          >
            DESHABILITAR
          </button>

        </div>

      </div>

    </div>
  );
}

