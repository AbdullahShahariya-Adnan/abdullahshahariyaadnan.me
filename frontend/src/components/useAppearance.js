
import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

export const defaultSections = [
  "hero",
  "services",
  "projects",
  "gallery",
  "social",
  "about",
  "skills",
  "education",
  "talk",
  "contact",
].map((id) => ({
  id,
  visible: true,
}));

export const defaultNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
];

export const parseList = (raw, fallback) => {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

// Shared settings cache
let cachedSettings = null;
let settingsPromise = null;

// All components share the same API request.
function fetchSettings() {
  if (cachedSettings !== null) {
    return Promise.resolve(cachedSettings);
  }

  if (settingsPromise) {
    return settingsPromise;
  }

  settingsPromise = api
    .getSettings()
    .then((data) => {
      cachedSettings = data ?? {};
      return cachedSettings;
    })
    .catch((error) => {
      settingsPromise = null;
      throw error;
    });

  return settingsPromise;
}

export function useAppearance() {
  const [settings, setSettings] = useState(
    () => cachedSettings ?? {}
  );

  useEffect(() => {
    let active = true;

    fetchSettings()
      .then((data) => {
        if (active) {
          setSettings(data);
        }
      })
      .catch(() => {
        // Keep default appearance if settings are unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  return settings;
}

export function AppearanceTheme() {
  const settings = useAppearance();

  useEffect(() => {
    const root = document.documentElement;

    const colors = [
      ["accent_color", "--accent"],
      ["accent_color_2", "--accent-2"],
    ];

    for (const [key, cssVariable] of colors) {
      const value = settings[key];

      if (/^#[0-9a-fA-F]{6}$/.test(value || "")) {
        root.style.setProperty(cssVariable, value);
      } else {
        root.style.removeProperty(cssVariable);
      }
    }
  }, [settings]);

  return null;
}
