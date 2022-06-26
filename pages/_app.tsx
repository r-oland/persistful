// Components==============
import Auth from 'global_components/Auth/Auth';
import GlobalTodayStreakContextWrapper from 'global_components/GlobalTodayStreakContextWrapper';
import Layout from 'global_components/Layout/Layout';
import { useAppHeight } from 'hooks/useAppHeight';
import { useDisableIOSZoom } from 'hooks/useDisableIOSZoom';
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
            <GlobalTodayStreakContextWrapper>
              <Layout noLayout={Component.noLayout}>
                <Component {...pageProps} />
              </Layout>
              <ReactQueryDevtools initialIsOpen={false} />
            </GlobalTodayStreakContextWrapper>
          </Auth>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
