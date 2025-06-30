import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link href="/">
        <a style={{ fontWeight: 'bold' }}>Kenthir AI</a>
      </Link>
      <div>
        {status === 'authenticated' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Koin: {session.user.coins}</span>
            <Link href="/profile">
              <a>
                <img src={session.user.image} alt={session.user.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
              </a>
            </Link>
            <button onClick={() => signOut()}>Logout</button>
          </div>
        ) : (
          <button onClick={() => signIn()}>Login</button>
        )}
      </div>
    </nav>
  );
}