// Components==============
import Auth from 'global_components/Auth/Auth';
import Layout from 'global_components/Layout/Layout';
import { useAppHeight } from 'hooks/useAppHeight';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'styles/App.scss';
// =========================

const queryClient = new QueryClient();

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
          <Layout noLayout={Component.noLayout}>
            <Component {...pageProps} />
          </Layout>
        </Auth>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
