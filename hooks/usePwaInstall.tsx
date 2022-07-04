// Components==============
import React, { createContext, useEffect, useMemo, useState } from 'react';
// =========================

type PwaInstallContextType = {
  deferredPrompt: BeforeInstallPromptEvent | null;
  setDeferredPrompt: React.Dispatch<
    React.SetStateAction<BeforeInstallPromptEvent | null>
  >;
  canShowIosInstall: boolean;
  setCanShowIosInstall: React.Dispatch<React.SetStateAction<boolean>>;
  iosInstallModalIsOpen: boolean;
  setIosInstallModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const handlePwaInstall = async ({
  deferredPrompt,
  setDeferredPrompt,
  canShowIosInstall,
  setIosInstallModalIsOpen,
}: PwaInstallContextType) => {
  if (canShowIosInstall) return setIosInstallModalIsOpen(true);

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

  const [canShowIosInstall, setCanShowIosInstall] = useState(false);
  const [iosInstallModalIsOpen, setIosInstallModalIsOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', async (e: any) => {
      // for old browsers to disable pop up
      e.preventDefault();

      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
    });

    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    // Detects if device is in standalone mode
    const isInstalled = () =>
      // @ts-ignore
      'standalone' in window.navigator && window.navigator.standalone;
    // Checks if should display install popup notification:
    if (isIos() && !isInstalled()) setCanShowIosInstall(true);
  }, []);

  const values = useMemo(
    () => ({
      deferredPrompt,
      setDeferredPrompt,
      canShowIosInstall,
      setCanShowIosInstall,
      iosInstallModalIsOpen,
      setIosInstallModalIsOpen,
    }),
    [deferredPrompt, canShowIosInstall, iosInstallModalIsOpen]
  );

  return values;
}
