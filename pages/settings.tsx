import Content from 'components/settings/Content/Content';
import styles from 'components/settings/settings.module.scss';
import TopBar from 'components/settings/TopBar/TopBar';
import Head from 'next/head';
import React, { createContext, useMemo, useState } from 'react';

export type SettingSelectedType = 'rules' | 'account';

type settingsContextType = {
  selected: SettingSelectedType;
  setSelected: React.Dispatch<React.SetStateAction<SettingSelectedType>>;
};

export const settingsContext = createContext({} as settingsContextType);

export default function Settings() {
  const [selected, setSelected] = useState<SettingSelectedType>('rules');

  const value = useMemo(() => ({ selected, setSelected }), [selected]);

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <settingsContext.Provider value={value}>
        <div className={styles.wrapper}>
          <TopBar />
          <Content />
        </div>
      </settingsContext.Provider>
    </>
  );
}
