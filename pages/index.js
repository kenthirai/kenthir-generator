import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push('/generator');
    return null;
  }

  return (
    <div className="bg-slate-200">
      <Navbar />
      <main className="flex items-center justify-center min-h-screen -mt-16">
        <div className="text-center p-10 bg-slate-200 rounded-2xl shadow-neumorphic">
          <h1 className="text-4xl font-bold text-slate-700 mb-4">
            Kenthir AI Image Generator
          </h1>
          <p className="text-slate-500 mb-8">
            Platform AI Generatif Terbuka Paling Mudah Diakses.
          </p>
          <button
            onClick={() => signIn()}
            className="px-8 py-3 bg-slate-200 text-slate-800 font-semibold rounded-xl shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-200"
          >
            Login untuk Memulai
          </button>
        </div>
      </main>
    </div>
  );
}