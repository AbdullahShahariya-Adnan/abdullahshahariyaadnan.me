import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Gallery from "./components/Gallery.jsx";
import SocialFeed from "./components/SocialFeed.jsx";
import Education from "./components/Education.jsx";
import TalkCta from "./components/TalkCta.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Admin from "./pages/Admin.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import AboutPage from "./pages/AboutPage.jsx";

function GalleryPage({ collection = "gallery" }) {
  return <><Navbar /><main className="pt-14"><Gallery initialCollection={collection} standalone /></main><Footer /></>;
}

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Projects />
        <Gallery />
        <SocialFeed />
        <About />
        <Skills />
        <Education />
        <TalkCta />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/gallery/travelling" element={<GalleryPage collection="travelling" />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
