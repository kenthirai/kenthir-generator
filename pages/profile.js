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
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="bg-slate-200 p-8 rounded-2xl shadow-neumorphic max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-700 mb-6 text-center">Profil Pengguna</h2>
          {session && (
            <div className="space-y-4 text-lg text-slate-600 mb-8">
              <p><strong>Nama:</strong> {session.user.name}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Sisa Koin:</strong> {session.user.coins}</p>
            </div>
          )}

          <hr className="border-slate-300 my-8"/>

          <div>
            <h3 className="text-2xl font-bold text-slate-700 mb-4 text-center">Reset Koin</h3>
            <p className="text-slate-500 mb-4 text-center">Masukkan kata sandi untuk mereset koin Anda kembali ke 10.</p>
            <form onSubmit={handleReset} className="flex flex-col items-center gap-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password Rahasia"
                required
                className="w-full max-w-sm bg-slate-200 rounded-xl p-3 shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
              />
              <button
                type="submit"
                className="w-full max-w-sm px-8 py-3 bg-slate-200 text-slate-800 font-bold rounded-xl shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-200"
              >
                Reset Koin Saya
              </button>
            </form>
            {message && <p className="text-center mt-4 font-semibold">{message}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}