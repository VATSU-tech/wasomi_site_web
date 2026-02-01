import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Motivation from "./sections/Motivation";
import Contact from "./sections/Contact";
import './Typescript/events'
import Galerie from "./sections/Galerie";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Motivation />
        <Galerie />
        <Contact />
      </main>
    </div>
  );
}

export default App;
