import { type PropsWithChildren } from "react";
import { Header } from "@/components/landingPage";

const AppLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <div className="relative">
      <Header/>
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
};

export default AppLayout;