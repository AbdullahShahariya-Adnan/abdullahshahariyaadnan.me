
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

// Load homepage sections directly to avoid layout shifts
// caused by lazy components appearing after initial rendering.
import Services from "./components/Services.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Gallery from "./components/Gallery.jsx";
import SocialFeed from "./components/SocialFeed.jsx";
import Education from "./components/Education.jsx";
import TalkCta from "./components/TalkCta.jsx";
import Contact from "./components/Contact.jsx";

// Keep separate pages lazy-loaded.
const Admin = lazy(() => import("./pages/Admin.jsx"));

const ProjectsPage = lazy(() =>
  import("./pages/ProjectsPage.jsx")
);

const ProjectDetail = lazy(() =>
  import("./pages/ProjectDetail.jsx")
);

const AboutPage = lazy(() =>
  import("./pages/AboutPage.jsx")
);

const BlogPage = lazy(() =>
  import("./pages/BlogPage.jsx").then((module) => ({
    default: module.BlogPage,
  }))
);

const BlogDetail = lazy(() =>
  import("./pages/BlogPage.jsx").then((module) => ({
    default: module.BlogDetail,
  }))
);

function PageLoader() {
  return (
    <div
      className="min-h-[30vh] flex items-center justify-center"
      role="status"
      aria-label="Loading content"
    >
      <span className="text-muted text-sm">
        Loading...
      </span>
    </div>
  );
}

function GalleryPage({ collection = "gallery" }) {
  return (
    <>
      <Navbar />

      <main className="pt-14">
        <Gallery
          initialCollection={collection}
          standalone
        />
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

  const sections = parseList(
    settings.home_sections,
    defaultSections
  );

  const ordered = [
    ...sections,
    ...defaultSections.filter(
      (section) =>
        !sections.some(
          (item) => item.id === section.id
        )
    ),
  ];

  return (
    <>
      <Navbar />

      <main>
        {ordered
          .filter(
            (section) =>
              section.visible !== false &&
              homeComponents[section.id]
          )
          .map((section) => {
            const Component =
              homeComponents[section.id];

            return (
              <Component key={section.id} />
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
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/projects"
            element={<ProjectsPage />}
          />

          <Route
            path="/gallery"
            element={<GalleryPage />}
          />

          <Route
            path="/gallery/travelling"
            element={
              <GalleryPage collection="travelling" />
            }
          />

          <Route
            path="/projects/:id"
            element={<ProjectDetail />}
          />

          <Route
            path="/about"
            element={<AboutPage />}
          />

          <Route
            path="/blog"
            element={<BlogPage />}
          />

          <Route
            path="/blog/:slug"
            element={<BlogDetail />}
          />

          <Route
            path="/admin"
            element={<Admin />}
          />
        </Routes>
      </Suspense>
    </>
  );
}
