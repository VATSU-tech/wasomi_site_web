import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Motivation from "./sections/Motivation";
import Contact from "./sections/Contact";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Motivation />
        <Contact />
      </main>
    </div>
  );
}

export default App;
