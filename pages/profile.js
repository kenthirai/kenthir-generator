import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('Memproses...');
    const res = await fetch('/api/user/reset-coins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setMessage(data.message);
    if(res.ok) {
        // Refresh sesi untuk update koin
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
    }
  };

  return (
    <div>
      <Navbar />
      <main style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
        <h2>Profil Pengguna</h2>
        {session && (
          <div>
            <p><strong>Nama:</strong> {session.user.name}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>Sisa Koin:</strong> {session.user.coins}</p>
          </div>
        )}
        <hr style={{margin: '2rem 0'}}/>
        <h3>Reset Koin</h3>
        <p>Masukkan kata sandi untuk mereset koin Anda kembali ke 10.</p>
        <form onSubmit={handleReset}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password Rahasia"
            required
          />
          <button type="submit">Reset Koin Saya</button>
        </form>
        {message && <p>{message}</p>}
      </main>
    </div>
  );
}