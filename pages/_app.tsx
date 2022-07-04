// Components==============
import { AnimatePresence } from 'framer-motion';
import Auth from 'global_components/Auth/Auth';
import GlobalTodayStreakContextWrapper from 'global_components/GlobalTodayStreakContextWrapper';
import IosInstallPrompt from 'global_components/IosInstallPrompt/IosInstallPrompt';
import Layout from 'global_components/Layout/Layout';
import { useAppHeight } from 'hooks/useAppHeight';
import { useDisableIOSZoom } from 'hooks/useDisableIOSZoom';
import { PwaInstallContext, usePwaInstall } from 'hooks/usePwaInstall';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import 'react-day-picker/dist/style.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'styles/App.scss';
import 'styles/DayPicker.scss';
import { fontawesomeHelper } from 'utils/fontawesomeHelper';
// =========================

fontawesomeHelper();

export const queryClient = new QueryClient({
  // get fresh data after 10 mins of use -> in case someone left their tab open
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000 * 60,
      refetchOnWindowFocus:
        process.env.NODE_ENV === 'production' ? 'always' : true,
      refetchOnReconnect:
        process.env.NODE_ENV === 'production' ? 'always' : true,
    },
  },
});

type NextPageWithExtraProps = NextPage & {
  noAuth?: boolean;
  noLayout?: boolean;
};

type AppPropsWithExtraProps = AppProps & {
  Component: NextPageWithExtraProps;
};

function MyApp({ Component, pageProps }: AppPropsWithExtraProps) {
  useAppHeight();
  useDisableIOSZoom();
  const values = usePwaInstall();

  return (
    <>
      <Head>
        {/* prevent zoom in on input focus */}
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no;user-scalable=0;"
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <Auth noAuth={Component.noAuth}>
            <PwaInstallContext.Provider value={values}>
              <GlobalTodayStreakContextWrapper>
                <Layout noLayout={Component.noLayout}>
                  <Component {...pageProps} />
                </Layout>
                <AnimatePresence>
                  {values.iosInstallModalIsOpen && <IosInstallPrompt />}
                </AnimatePresence>
                <ReactQueryDevtools initialIsOpen={false} />
              </GlobalTodayStreakContextWrapper>
            </PwaInstallContext.Provider>
          </Auth>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
