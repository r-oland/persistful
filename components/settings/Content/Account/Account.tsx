// Components==============
import { faRadiation, faSignOutAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetUser from 'actions/user/useGetUser';
import useUpdateUser from 'actions/user/useUpdateUser';
import axios from 'axios';
import Button from 'global_components/Button/Button';
import Checkbox from 'global_components/Checkbox/Checkbox';
import Input from 'global_components/Input/Input';
import { signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import {
  checkNotificationBrowserSupport,
  fetchServiceWorker,
  getNotificationPermission,
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
  const [hasBrowserSupport, setHasBrowserSupport] = useState(false);
  const [hasNotificationsEnabled, setHasNotificationsEnabled] = useState(false);
  const { data: user } = useGetUser();
  const { mutate: updateUser } = useUpdateUser();

  const name =
    saveObject?.firstName !== undefined
      ? saveObject.firstName
      : user?.firstName || '';

  async function handleNotificationChange() {
    // Check if user has notifications enabled
    if (hasNotificationsEnabled) {
      const registration = await fetchServiceWorker();
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) return;

      // Remove subscription from browser
      await subscription.unsubscribe();

      // Remove subscription from database
      await axios.delete('/api/notification', { data: { subscription } });

      return setHasNotificationsEnabled(false);
    }

    // User has no notifications enabled, create new subscription
    await getNotificationPermission();
    const registration = await fetchServiceWorker();
    const subscription = await subscribeUserToPush(registration);

    if (!subscription) return;

    // Save subscription to database
    await axios.post('/api/notification', { subscription });

    setHasNotificationsEnabled(true);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    return updateUser({ firstName: saveObject.firstName });
  };

  async function checkExistingSubscription() {
    const registration = await fetchServiceWorker();

    // Check for existing subscription
    const existingSubscription =
      await registration.pushManager.getSubscription();

    if (existingSubscription) setHasNotificationsEnabled(true);
  }

  useEffect(() => {
    checkExistingSubscription();
  }, []);

  useEffect(() => setHasBrowserSupport(checkNotificationBrowserSupport()), []);

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
      {hasBrowserSupport && (
        <div>
          <strong>Enable notifications</strong>
          <Checkbox
            externalValue={hasNotificationsEnabled}
            externalOnClick={() => handleNotificationChange()}
          >
            <p>
              You will be reminded to fill in your activities at the end of the
              day.
            </p>
          </Checkbox>
        </div>
      )}
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
