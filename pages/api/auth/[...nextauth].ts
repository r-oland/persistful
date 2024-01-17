import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { ObjectId } from 'mongodb';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import nodemailer from 'nodemailer';
import clientPromise, { getCollection } from 'utils/getMongo';
import { defaultActivities } from 'utils/onboardingValues';
import { html, text } from 'utils/email';

let code: string;

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
        // @ts-ignore
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async generateVerificationToken() {
        const generateToken = () =>
          (
            Math.random().toString(36).substring(2, 5) +
            Math.random().toString(36).substring(2, 5)
          ).toUpperCase();
        code = generateToken();

        return code;
      },
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        const transport = nodemailer.createTransport(server);
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: text({ code, host }),
          html: html({ code, host, email }),
        });
      },
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
        const _id = new ObjectId(user.id) as any;

        // get user
        const users = await getCollection<UserEntity>('users');
        const result = await users.findOne({ _id });

        // get activities
        const activities = await getCollection<ActivityEntity>('activities');

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
                balance: false,
                bonusTime: 30,
              },
              createdAt: new Date(),
              lastValidation: new Date(),
              finishedOnboarding: false,
            },
            // If Google API returns name value, remove it
            $unset: { name: '' },
          }
        );

        // format bulk write array
        const bulkArray = defaultActivities(user.id).map((activity) => ({
          insertOne: {
            document: activity,
          },
        }));

        // set default activities for new user
        // @ts-ignore
        activities.bulkWrite(bulkArray);
      } catch (e) {
        return console.error(e);
      }
    },
  },
});
