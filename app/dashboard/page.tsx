"use client";

import Link from "next/link";
import {
  Users,
  ClipboardCheck,
  BarChart,
  FileText,
  BookOpen,
  Bot
} from "lucide-react";

const items = [
  {
    name: "Registro Estudiantil",
    path: "/dashboard/registro-estudiantil",
    icon: Users,
    color: "bg-blue-500"
  },
  {
    name: "Registro de Asistencias",
    path: "/dashboard/registro-asistencias",
    icon: ClipboardCheck,
    color: "bg-green-500"
  },
  {
    name: "Control de Asistencias",
    path: "/dashboard/control-asistencias",
    icon: BarChart,
    color: "bg-yellow-500"
  },
  {
    name: "Control de Notas",
    path: "/dashboard/control-notas",
    icon: FileText,
    color: "bg-purple-500"
  },
  {
    name: "Autoevaluaciones",
    path: "/dashboard/autoevaluaciones",
    icon: BookOpen,
    color: "bg-pink-500"
  },
  {
    name: "Chatbot",
    path: "/dashboard/chatbot",
    icon: Bot,
    color: "bg-gray-700"
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Sistema Académico
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <Link key={i} href={item.path}>
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:scale-105 transition cursor-pointer">
                
                <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full ${item.color}`}>
                  <Icon className="text-white w-8 h-8" />
                </div>

                <p className="text-lg font-semibold">{item.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
