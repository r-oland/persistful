// Components==============
import { AnimatePresence } from 'framer-motion';
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import { useMediaQ } from 'hooks/useMediaQ';
import { settingsContext } from 'pages/settings';
import React, { useContext, useState } from 'react';
import Account from './Account/Account';
import styles from './Content.module.scss';
import DeleteConfirmModal from './DeleteConfirmModal/DeleteConfirmModal';
import Rules from './Rules/Rules';
// =========================

function Items({
  setDeleteModalIsOpen,
}: {
  setDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { selected } = useContext(settingsContext);

  return selected === 'account' ? (
    <Account setDeleteModalIsOpen={setDeleteModalIsOpen} />
  ) : (
    <Rules />
  );
}

export default function Content() {
  const query = useMediaQ('min', 1024);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  return (
    <>
      {query ? (
        <div className={styles.wrapper}>
          <ElementContainer color="green">
            <Items setDeleteModalIsOpen={setDeleteModalIsOpen} />
          </ElementContainer>
        </div>
      ) : (
        <div className={styles.mobile}>
          <Items setDeleteModalIsOpen={setDeleteModalIsOpen} />
        </div>
      )}

      <AnimatePresence>
        {deleteModalIsOpen && (
          <DeleteConfirmModal setModalIsOpen={setDeleteModalIsOpen} />
        )}
      </AnimatePresence>
    </>
  );
}
