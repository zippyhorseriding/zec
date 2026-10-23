"use client";

import { createContext, useContext } from "react";
import {
  defaultSiteSettings,
  type SiteSettings,
} from "@/sanity/lib/siteSettingsDefaults";

const SiteSettingsContext = createContext<SiteSettings>(defaultSiteSettings);

/**
 * Makes the "Site Settings & Contact" document available to client components
 * (Footer, Contact directory) without every page having to thread it through.
 * Populated once in the root layout.
 */
export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
