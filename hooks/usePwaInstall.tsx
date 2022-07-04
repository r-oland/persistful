// Components==============
import React, { createContext, useEffect, useMemo, useState } from 'react';
// =========================

type PwaInstallContextType = {
  deferredPrompt: BeforeInstallPromptEvent | null;
  setDeferredPrompt: React.Dispatch<
    React.SetStateAction<BeforeInstallPromptEvent | null>
  >;
};

export const handlePwaInstall = async ({
  deferredPrompt,
  setDeferredPrompt,
}: PwaInstallContextType) => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') setDeferredPrompt(null);

  return undefined;
};

export const PwaInstallContext = createContext({} as PwaInstallContextType);

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', async (e: any) => {
      // for old browsers to disable pop up
      e.preventDefault();

      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
    });
  }, []);

  const values = useMemo(
    () => ({ deferredPrompt, setDeferredPrompt }),
    [deferredPrompt]
  );

  return values;
}
