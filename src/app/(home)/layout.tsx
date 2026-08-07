import { type PropsWithChildren } from "react";

const AppLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <div className="relative">
      {children}
    </div>
  )
};

export default AppLayout;