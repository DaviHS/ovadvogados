import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - RampSync",
    default: "Web - RampSync",
    absolute: "RampSync - Sistema Aeroportuários",
  },
  description: "Sistema completo para gerenciamento de aeroportos",
  icons: [
    {
      rel: "icon",
      url: "/logo.ico",
    },
  ],
};
