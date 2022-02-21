// Components==============
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import { useMediaQ } from 'hooks/useMediaQ';
import { settingsContext } from 'pages/settings';
import React, { useContext } from 'react';
import Account from './Account/Account';
import styles from './Content.module.scss';
import Rules from './Rules/Rules';
// =========================

function Items() {
  const { selected } = useContext(settingsContext);

  return selected === 'account' ? <Account /> : <Rules />;
}

export default function Content() {
  const query = useMediaQ('min', 1024);

  return (
    <>
      {query ? (
        <div className={styles.wrapper}>
          <ElementContainer color="green">
            <Items />
          </ElementContainer>
        </div>
      ) : (
        <div className={styles.mobile}>
          <Items />
        </div>
      )}
    </>
  );
}
