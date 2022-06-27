// Components==============
import { faStepBackward } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetUser from 'actions/user/useGetUser';
import styles from 'components/verify-mail/VerifyMail.module.scss';
import Button from 'global_components/Button/Button';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
// =========================

export default function VerifyMail() {
  const { data: user } = useGetUser({ retry: false });
  const history = useRouter();

  useEffect(() => {
    if (user) history.push('/');
  }, [!!user]);

  return (
    <>
      <Head>
        <title>Verify mail</title>
      </Head>
      <div className={styles.wrapper}>
        <div className={styles.text}>
          <div>
            <h1>Check your email</h1>
          </div>
          <p>
            We've sent you a verification link to your email adres. This code
            expires shortly, so quit reading and start clicking!
          </p>
        </div>
        <div className={styles.buttons}>
          <Button color="red" to="/login">
            <FontAwesomeIcon icon={faStepBackward} />
            Go back
          </Button>
          <a href="https://mail.google.com/mail/u/0/">
            <Button>
              <Image src="/images/gmail.svg" width="16" height="16" />
              Open Gmail
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}

VerifyMail.noAuth = true;
VerifyMail.noLayout = true;
