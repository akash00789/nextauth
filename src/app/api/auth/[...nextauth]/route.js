// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

const handler = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            return user;
          } else {
            return null;
          }
        }
      })
    ],
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token, user }) {
        session.user.id = user.id;
        return session;
      },
      async signIn({ user, account, profile }) {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
  
        if (!existingUser) {
          const newUser = new User({
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: true,
          });
  
          await newUser.save();
        }
  
        return true;
      },
    },
  });
  
  export { handler as GET, handler as POST };