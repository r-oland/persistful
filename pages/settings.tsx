import styles from 'components/settings/settings.module.scss';
import Head from 'next/head';
import React from 'react';

export default function Settings() {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <div className={styles.wrapper} />
    </>
  );
}
