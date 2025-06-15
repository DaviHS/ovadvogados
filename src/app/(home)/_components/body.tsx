"use client";

import { 
  Benefits, 
  CtaFinal, 
  Footer, 
  Hero, 
  Problems, 
  Solutions, 
  Validations } from "@/components/landingPage";

export const Body = () => {
  return (
    <>
     <Hero/>
     <Problems/>
     <Solutions/>
     <Benefits/>
     <Validations/>
     <CtaFinal/>
     <Footer/>
    </>
  );
};
