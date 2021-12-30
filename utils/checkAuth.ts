import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export const checkAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).send('Unauthorized');
  if (session) return session;
};
