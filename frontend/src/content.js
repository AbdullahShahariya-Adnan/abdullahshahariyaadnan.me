// ────────────────────────────────────────────────────────────
// EDIT ME: This file holds all the text and links shown on the site.
// Change anything here and the whole site updates automatically —
// no need to touch any other file.
// ────────────────────────────────────────────────────────────

export const content = {
  siteTitle: "Adnan",
  siteDescription:
    "Computer Science student, aspiring cybersecurity professional, and full-stack developer.",

  // Navbar logo (top-left corner)
  logo: {
    bold: "Adnan",
    light: "",
  },

  // Hero section (the big text at the top of the homepage)
  hero: {
    greeting: "Hello, I'm",
    firstName: "Abdullah",
    lastName: "Shahariya Adnan",
    tagline: "FULL-STACK DEVELOPER  |  ASPIRING CYBERSECURITY PRO  |  PROBLEM SOLVER",
    ctaLabel: "Contact Me",
    photo: "/adnan-photo.png", // put a new photo in frontend/public/ and change this filename
  },

  // About section (short version shown on the homepage)
  about: {
    bio: `I'm a Computer Science student at the University of Pécs, Hungary, with a strong interest in cybersecurity, software development, and cloud technologies. I enjoy building web applications using Angular, NestJS, and SQL databases while continuously improving my skills in Linux and ethical hacking. My goal is to build a career in cybersecurity and secure software engineering.`,
    stats: [
      { label: "Full-Stack Dev", sub: "Angular + NestJS" },
      { label: "Databases", sub: "MySQL, SQL Server" },
      { label: "Cybersecurity", sub: "Linux & networking" },
    ],
  },

  // "What I do" cards
  services: [
    {
      title: "Full-Stack Development",
      desc: "Building complete web applications end to end — Angular and NestJS on the frontend and backend, with clean REST APIs in between.",
    },
    {
      title: "Database Design",
      desc: "Structuring relational data in MySQL and SQL Server, from schema design to writing efficient queries and migrations.",
    },
    {
      title: "Cybersecurity Fundamentals",
      desc: "Studying Linux systems, networking, and ethical hacking through hands-on practice on TryHackMe and coursework.",
    },
  ],

  // Gallery section — photos and videos.
  // type: "image" or "video". Put your files in frontend/public/gallery/
  // and reference them here as "/gallery/filename.jpg".
  gallery: {
    subtitle: "A few photos and clips — projects, events, and behind the scenes.",
    items: [
      { type: "image", src: "/adnan-photo.png", caption: "Add more of your own photos here" },
      // { type: "image", src: "/gallery/photo-2.jpg", caption: "..." },
      // { type: "video", src: "/gallery/video-1.mp4", caption: "..." },
    ],
  },

  // Contact info + social links (footer, hero icon row, email links)
  contact: {
    email: "abdullahshahariyatasin@gmail.com",
    github: "https://github.com/AbdullahShahariya-Adnan",
    linkedin: "https://www.linkedin.com/in/abdullah-shahariya-adnan/",
  },
};
