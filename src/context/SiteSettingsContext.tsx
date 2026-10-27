import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { applySiteSettings } from '../config/business';
import { getPublicSettings } from '../services/api';
import { PublicSiteSettings } from '../types';

interface Value {
  settings: PublicSiteSettings | null;
  /** Used by the dashboard after saving, so the owner sees the change straight away. */
  apply: (s: PublicSiteSettings) => void;
}
const Ctx = createContext<Value>({ settings: null, apply: () => undefined });
export const useSiteSettings = () => useContext(Ctx);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null);
  const apply = useCallback((s: PublicSiteSettings) => {
    applySiteSettings(s);
    setSettings(s);
  }, []);
  useEffect(() => {
    // If the API is unreachable the site simply keeps its built-in details.
    getPublicSettings().then(apply).catch(() => undefined);
  }, [apply]);
  return <Ctx.Provider value={{ settings, apply }}>{children}</Ctx.Provider>;
}
