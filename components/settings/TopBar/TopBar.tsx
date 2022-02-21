// Components==============
import TopNavWrapper from 'global_components/LayoutWrappers/TopNavWrapper/TopNavWrapper';
import { useMediaQ } from 'hooks/useMediaQ';
import { settingsContext, SettingSelectedType } from 'pages/settings';
import React, { useContext } from 'react';
import styles from './TopBar.module.scss';
// =========================

const subMenus = [
  { id: 'rules', name: 'Rules' },
  { id: 'account', name: 'Account' },
] as { id: SettingSelectedType; name: string }[];

function SubMenu({ name, id }: { name: string; id: SettingSelectedType }) {
  const { setSelected, selected } = useContext(settingsContext);

  return (
    <button
      type="button"
      onClick={() => setSelected(id)}
      className={`${styles['sub-menu']} ${
        id === selected ? styles.active : ''
      }`}
    >
      {name}
    </button>
  );
}

export default function TopBar() {
  const query = useMediaQ('min', 1024);

  if (!query)
    return (
      <TopNavWrapper>
        <div className={styles.mobile}>
          {subMenus.map((s) => (
            <SubMenu key={s.id} name={s.name} id={s.id} />
          ))}
        </div>
      </TopNavWrapper>
    );

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {subMenus.map((s) => (
          <SubMenu key={s.id} name={s.name} id={s.id} />
        ))}
      </div>
    </div>
  );
}
