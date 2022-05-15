// Components==============
import { faSignOutAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetUser from 'actions/user/useGetUser';
import useUpdateUser from 'actions/user/useUpdateUser';
import Button from 'global_components/Button/Button';
import Input from 'global_components/Input/Input';
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';
import styles from './Account.module.scss';
// =========================

export default function Account() {
  const [saveObject, setSaveObject] = useState<Partial<UserEntity>>({});
  const { data: user } = useGetUser();
  const { mutate } = useUpdateUser();

  const name =
    saveObject?.firstName !== undefined
      ? saveObject.firstName
      : user?.firstName || '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    return mutate({ firstName: saveObject.firstName });
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
      <div className={styles.buttons}>
        <Button color="red" onClick={() => signOut()}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </Button>
      </div>
    </div>
  );
}
