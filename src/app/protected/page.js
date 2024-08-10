// app/protected/page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import LogoutButton from '@/app/components/LogoutButton';

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div>
        <h1>You are not authorized to view this page</h1>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>You are logged in as {session.user.email}</p>
      <LogoutButton />
    </div>
  );
}
