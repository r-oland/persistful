// Components==============
import Head from 'next/head';
import React from 'react';
import { useMediaQ } from 'hooks/useMediaQ';
import MobileOverview from 'components/overview/MobileOverview/MobileOverview';
import DesktopOverview from 'components/overview/DesktopOverview/DesktopOverview';
// =========================

export default function Overview() {
  // @ts-ignore
  const query = useMediaQ('min', 1175);

  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      {query ? <DesktopOverview /> : <MobileOverview />}
    </>
  );
}
