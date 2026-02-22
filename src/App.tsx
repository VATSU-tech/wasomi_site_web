import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Motivation from "./sections/Motivation";
import Contact from "./sections/Contact";
import "./Typescript/events";
import Galerie from "./sections/Galerie";
import Partners from "./sections/Partners";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      offset: 90,
      once: true,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Partners />
        <Motivation />
        <Galerie />
        <Contact />
      </main>
    </div>
  );
}

export default App;
