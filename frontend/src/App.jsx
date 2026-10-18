import { lazy, Suspense } from "react";
import {
  AppearanceTheme,
  useAppearance,
  parseList,
  defaultSections,
} from "./components/useAppearance.js";
import SiteMeta from "./components/SiteMeta.jsx";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Footer from "./components/Footer.jsx";

const Services = lazy(() => import("./components/Services.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const Skills = lazy(() => import("./components/Skills.jsx"));
const Projects = lazy(() => import("./components/Projects.jsx"));
const Gallery = lazy(() => import("./components/Gallery.jsx"));
const SocialFeed = lazy(() => import("./components/SocialFeed.jsx"));
const Education = lazy(() => import("./components/Education.jsx"));
const TalkCta = lazy(() => import("./components/TalkCta.jsx"));
const Contact = lazy(() => import("./components/Contact.jsx"));

const Admin = lazy(() => import("./pages/Admin.jsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.jsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.jsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const BlogPage = lazy(() =>
  import("./pages/BlogPage.jsx").then((module) => ({ default: module.BlogPage }))
);
const BlogDetail = lazy(() =>
  import("./pages/BlogPage.jsx").then((module) => ({ default: module.BlogDetail }))
);

function PageLoader() {
  return (
    <div className="min-h-[30vh] flex items-center justify-center" role="status" aria-label="Loading content">
      <span className="text-muted text-sm">Loading...</span>
    </div>
  );
}

function GalleryPage({ collection = "gallery" }) {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <Suspense fallback={<PageLoader />}>
          <Gallery initialCollection={collection} standalone />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

const homeComponents = {
  hero: Hero,
  services: Services,
  projects: Projects,
  gallery: Gallery,
  social: SocialFeed,
  about: About,
  skills: Skills,
  education: Education,
  talk: TalkCta,
  contact: Contact,
};

function Home() {
  const settings = useAppearance();
  const sections = parseList(settings.home_sections, defaultSections);
  const ordered = [
    ...sections,
    ...defaultSections.filter((x) => !sections.some((s) => s.id === x.id)),
  ];

  return (
    <>
      <Navbar />
      <main>
        {ordered
          .filter((x) => x.visible !== false && homeComponents[x.id])
          .map((x) => {
            const Component = homeComponents[x.id];
            return (
              <Suspense fallback={null} key={x.id}>
                <Component />
              </Suspense>
            );
          })}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <AppearanceTheme />
      <SiteMeta />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/travelling" element={<GalleryPage collection="travelling" />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </>
  );
}
