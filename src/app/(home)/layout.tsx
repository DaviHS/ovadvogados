import { type PropsWithChildren } from "react";
import { Header } from "./_components";

const AppLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <div className="relative">
      <Header/>
      <main className="pt-10">
        {children}
      </main>
    </div>
  )
};

export default AppLayout;