// Components==============
import Auth from 'global_components/Auth/Auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'styles/App.scss';
// =========================

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        {/* @ts-ignore */}
        {Component.noAuth ? (
          <Component {...pageProps} />
        ) : (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
