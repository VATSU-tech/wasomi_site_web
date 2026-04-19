import { useEffect } from "react";
import AOS from "aos";

export function AosProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      delay: 0,
    });
  }, []);
  return <>{children}</>;
}
