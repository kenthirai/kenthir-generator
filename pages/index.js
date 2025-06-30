import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Jika sudah login, langsung arahkan ke generator
  if (status === "authenticated") {
    router.push('/generator');
    return null; // Tampilkan halaman kosong selama redirect
  }

  return (
    <div>
      <Navbar />
      <main style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>Selamat Datang di Kenthir AI Image Generator</h1>
        <p>Platform AI Generatif Terbuka Paling Mudah Diakses.</p>
        <p>Silakan login untuk mulai membuat karya seni digital Anda.</p>
        <button onClick={() => signIn()} style={{ padding: '10px 20px', fontSize: '1.2rem', marginTop: '20px' }}>
          Login untuk Memulai
        </button>
      </main>
    </div>
  );
}