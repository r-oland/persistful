// Components==============
import Auth from 'global_components/Auth/Auth';
import Layout from 'global_components/Layout/Layout';
import { useAppHeight } from 'hooks/useAppHeight';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'styles/App.scss';
import { fontawesomeHelper } from 'utils/fontawesomeHelper';
// =========================

fontawesomeHelper();

export const queryClient = new QueryClient({
  // get fresh data after 15 mins of use -> in case someone left their tab open
  defaultOptions: { queries: { staleTime: 15 * 1000 * 60 } },
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

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Auth noAuth={Component.noAuth}>
          <>
            <Layout noLayout={Component.noLayout}>
              <Component {...pageProps} />
            </Layout>
            <ReactQueryDevtools initialIsOpen={false} />
          </>
        </Auth>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
