// Components==============
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import React from 'react';
// =========================

export default function Login() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signIn('google');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Sign in</button>
    </form>
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
