// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return { email: user.email };
        }

        throw new Error('Invalid credentials');
      },
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        await connectToDatabase();

        let user = await User.findOne({ email: profile.email });
        if (!user) {
          user = await User.create({
            email: profile.email,
            googleId: profile.sub,
            name: profile.name,
          });
        }
        return { email: user.email };
      },
    }),
  ],
  database: process.env.MONGODB_URI,
});
