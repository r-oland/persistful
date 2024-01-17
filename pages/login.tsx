// Components==============
import { faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from 'components/login/Login.module.scss';
import Button from 'global_components/Button/Button';
import Input from 'global_components/Input/Input';
import { useStorage } from 'hooks/useStorage';
import { GetServerSideProps } from 'next';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/legacy/image';
import React, { useState } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
// =========================

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useStorage('sign-in-email', '');
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.red} />
          <Image src="/images/auth-image.svg" layout="fill" alt="auth" />
        </div>
        <div className={styles.right}>
          <div className={styles.content}>
            <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
                if (submitting) return;
                signIn('email', { email }).then(() => {
                  // timeout to keep spinning before jumping to validate-mail screen
                  setTimeout(() => {
                    setSubmitting(false);
                  }, 1000);
                });
              }}
            >
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doesitgood@mail.com"
                type="email"
                readOnly={submitting}
              />
              <div className={styles.buttons}>
                <Button stretch submit inactive={submitting}>
                  {mode === 'login' ? 'Sign in' : 'Continue'}
                  {submitting && <FontAwesomeIcon icon={faSpinnerThird} spin />}
                </Button>
                <Button color="white" onClick={() => signIn('google')} stretch>
                  <Image
                    src="/images/google.svg"
                    width="16"
                    height="16"
                    alt="Google logo"
                  />
                  {mode === 'login'
                    ? 'Sign in with Google'
                    : 'Continue with Google'}
                </Button>
              </div>
            </form>
            <div
              className={styles['switch-form']}
              onClick={() =>
                setMode((prev) => (prev === 'login' ? 'register' : 'login'))
              }
            >
              {mode === 'login' ? (
                <>
                  First time? <strong>Get started for free!</strong>
                </>
              ) : (
                <>
                  Already a user? <strong>Sign in</strong>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

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
Login.noLayout = true;
