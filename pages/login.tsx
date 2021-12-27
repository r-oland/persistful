// Components==============
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import React from 'react';
import styles from 'components/login/Login.module.scss';
import Image from 'next/image';
import Button from 'global_components/Button/Button';
// =========================

export default function Login() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.red} />
        <Image src="/images/auth-image.svg" layout="fill" alt="auth" />
      </div>
      <div className={styles.right}>
        <h1>Login</h1>
        <Button color="white" onClick={() => signIn('google')}>
          <Image src="/images/google.svg" width="16" height="16" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

Login.noAuth = true;
