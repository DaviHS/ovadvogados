import { type PropsWithChildren } from "react";

const AppLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <div className="relative">
      <main className="pt-16"> 
        {children}
      </main>
    </div>
  )
};

export default AppLayout;