// components/LogoutButton.js
'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    router.push('/');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
