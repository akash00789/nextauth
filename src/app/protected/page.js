// app/protected/page.js
"use client";

import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';

export default function ProtectedPage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session) {
      const fetchUser = async () => {
        await connectToDatabase();
        const user = await User.findById(session.user.id).lean();
        setUser(user);
      };

      fetchUser();
    }
  }, [session]);

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Protected Page</h1>
      {user && <p>Welcome, {user.name}</p>}
    </div>
  );
}
