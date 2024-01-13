// Components==============
import {
  faRadiation,
  faSend,
  faSignOutAlt,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetUser from 'actions/user/useGetUser';
import useUpdateUser from 'actions/user/useUpdateUser';
import axios from 'axios';
import Button from 'global_components/Button/Button';
import Checkbox from 'global_components/Checkbox/Checkbox';
import Input from 'global_components/Input/Input';
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';
import {
  checkNotificationBrowserSupport,
  getNotificationPermission,
  registerServiceWorker,
  subscribeUserToPush,
} from 'utils/notificationUtils';
import styles from './Account.module.scss';
// =========================

export default function Account({
  setDeleteModalIsOpen,
}: {
  setDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [saveObject, setSaveObject] = useState<Partial<UserEntity>>({});
  const { data: user } = useGetUser();
  const { mutate: updateUser } = useUpdateUser();

  const name =
    saveObject?.firstName !== undefined
      ? saveObject.firstName
      : user?.firstName || '';

  async function notificationTest() {
    checkNotificationBrowserSupport();
    await getNotificationPermission();
    const registration = await registerServiceWorker();
    const subscription = await subscribeUserToPush(registration);
    updateUser({ subscription });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    return updateUser({ firstName: saveObject.firstName });
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <strong>First name</strong>
        <Input
          value={name}
          onChange={(e) =>
            setSaveObject((prev) => ({ ...prev, firstName: e.target.value }))
          }
          placeholder="Don Joe"
          onClickOutside={handleSubmit}
        />
      </div>
      <div>
        <strong>Enable notifications</strong>
        <Checkbox initialValue={false} onClick={() => notificationTest()}>
          <p>
            You will be reminded to fill in your activities at the end of the
            day.
          </p>
        </Checkbox>
      </div>
      <div>
        <Button color="green" onClick={() => axios.post('/api/notification')}>
          <FontAwesomeIcon icon={faSend} /> fire notification
        </Button>
      </div>
      <div>
        <strong>Delete account</strong>
        <p className={styles.description}>
          Permanently remove your account and all data that is connected to it.
          This action is irreversible and will be put into action immediately.
        </p>
        <Button color="red" onClick={() => setDeleteModalIsOpen(true)}>
          <FontAwesomeIcon icon={faRadiation} /> Delete
        </Button>
      </div>
      <div className={styles.buttons}>
        <Button color="white" onClick={() => signOut()}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </Button>
      </div>
    </div>
  );
}
