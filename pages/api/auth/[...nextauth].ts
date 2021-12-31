import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { ObjectId } from 'mongodb';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise, { getCollection } from 'utils/getMongo';

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/login',
    newUser: '/',
    verifyRequest: '/verify-mail',
  },
  secret: process.env.SECRET,
  callbacks: {
    session: async ({ session, user }) => ({
      ...session,
      user: { ...session.user, uid: user.id },
    }),
  },
  events: {
    createUser: async ({ user }) => {
      try {
        // Check if user is linked correctly to the DB
        if (!user.id.length) return;

        // Get user id
        const _id = new ObjectId(user.id);

        // get user
        const users = await getCollection<UserEntity>('users');
        const result = await users.findOne({ _id });

        // if user doesn't match session abort
        if (!result) return;

        // @ts-ignore
        const firstName = result?.name?.split(' ')?.[0] || undefined;

        await users.updateOne(
          { _id },
          // Set default values
          {
            $set: {
              firstName,
              streak: 0,
              rules: {
                dailyGoal: 90,
                secondChange: false,
                prm: false,
              },
              createdAt: new Date(),
            },
            // If Google API returns name value, remove it
            $unset: { name: '' },
          }
        );
      } catch (e) {
        return console.error(e);
      }
    },
  },
});
