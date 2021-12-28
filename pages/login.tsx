// Components==============
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import React, { useState } from 'react';
import styles from 'components/login/Login.module.scss';
import Image from 'next/image';
import Button from 'global_components/Button/Button';
import Input from 'global_components/Input/Input';
// =========================

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');

  return (
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
              signIn('email', { email });
            }}
          >
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doesitgood@mail.com"
              type="email"
            />
            <div className={styles.buttons}>
              <Button stretch submit>
                {mode === 'login' ? 'Sign in' : 'Continue'}
              </Button>
              <Button color="white" onClick={() => signIn('google')} stretch>
                <Image src="/images/google.svg" width="16" height="16" />
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
Login.noLayout = true;
