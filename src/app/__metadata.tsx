import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - RampSync",
    default: "Web - RampSync",
    absolute: "RampSync - Sistema de Atendimentos Aeroportuários",
  },
  description: "Sistema completo para gerenciamento de atendimentos e inspeções walkaround em aeroportos",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
};
