// Components==============
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetUser from 'actions/user/useGetUser';
import styles from 'components/verify-mail/VerifyMail.module.scss';
import Input from 'global_components/Input/Input';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
// =========================

export default function VerifyMail() {
  const { data: user } = useGetUser({ retry: false });
  const history = useRouter();

  const [value, setValue] = useState('');

  useEffect(() => {
    if (user) history.push('/');
  }, [!!user]);

  return (
    <>
      <Head>
        <title>Verify mail</title>
      </Head>
      <div className={styles.page}>
        <form
          className={styles.wrapper}
          onSubmit={(e) => {
            e.preventDefault();

            history.push(
              `/api/auth/callback/email?callbackUrl=3DSessionRequired&token=${value}&email=roland.branten%40gmail.com`
            );
          }}
        >
          <div className={styles.text}>
            <div>
              <h1>Check your mail!</h1>
            </div>
            <p>
              We've sent a verification code to your email adres. This code
              expires shortly, so quit reading and start clicking!
            </p>
          </div>
          <div>
            <div className={styles['input-wrapper']}>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Code"
                autoComplete="one-time-code"
              />
              <button type="submit">
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

VerifyMail.noAuth = true;
VerifyMail.noLayout = true;
