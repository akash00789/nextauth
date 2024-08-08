// app/page.js
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <>
          <p>You are not signed in</p>
          <a href="/login">Go to Login Page</a>
          <a href="/register">Go to Register Page</a>
        </>
      ) : (
        <>
          <p>Welcome, {session.user.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
