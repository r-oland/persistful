// Components==============
import type { AppProps } from 'next/app';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'styles/App.scss';
import { SessionProvider } from 'next-auth/react';
import Auth from 'global_components/Auth/Auth';
// =========================

const queryClient = new QueryClient();

const authWhitelist = ['Login'];

function MyApp({ Component, pageProps }: AppProps) {
  const noAuth = authWhitelist.includes(Component.name);

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        {noAuth ? (
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
