import { useEffect, useState } from 'react';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/layout/LoadingScreen';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ThreeDBackground from './components/ThreeDBackground';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Education from './components/sections/Education';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Interests from './components/sections/Interests';
import Contact from './components/sections/Contact';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [loading]);

  return (
    <>
      <CustomCursor />
      <ThreeDBackground />

      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <Navbar />

      <main className="relative">
        <Hero />
        <About />
        <Education />
        <Projects />
        <Skills />
        <Experience />
        <Interests />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
