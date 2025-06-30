import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from 'next/link';
import Navbar from "../components/Navbar";

export default function Generator() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prompt, setPrompt] = useState("A beautiful logo for Kenthir.my.id, neumorphic style");
  const [model, setModel] = useState("flux");
  const [userDalleKey, setUserDalleKey] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setImageUrl("");

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        model,
        userDalleKey,
        width: 1024,
        height: 1024,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setImageUrl(data.imageUrl);
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
    } else {
      setError(data.message || "Terjadi kesalahan.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-200 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="bg-slate-200 p-8 rounded-2xl shadow-neumorphic max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-700 mb-6 text-center">
            AI Image Generator
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-lg font-semibold text-slate-600 mb-2">Prompt</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                rows="3"
                className="w-full bg-slate-200 rounded-xl p-3 shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-lg font-semibold text-slate-600 mb-2">Model</label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-200 rounded-xl p-3 shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
              >
                <option value="flux">Flux (Default)</option>
                <option value="dall-e-3">DALL-E 3 (Butuh API Key)</option>
                <option value="gptimage">GPT Image (Transparan)</option>
                <option value="playground-v2.5">Playground v2.5</option>
              </select>
            </div>

            {model === 'dall-e-3' && (
              <div>
                <label htmlFor="dalleKey" className="block text-lg font-semibold text-slate-600 mb-2">OpenAI API Key</label>
                <input
                  id="dalleKey"
                  type="password"
                  value={userDalleKey}
                  onChange={(e) => setUserDalleKey(e.target.value)}
                  placeholder="Masukkan kunci API OpenAI Anda"
                  className="w-full bg-slate-200 rounded-xl p-3 shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">Kunci Anda tidak akan kami simpan. <Link href="/profile" className="text-sky-600 hover:underline">Atur kunci permanen di profil.</Link></p>
              </div>
            )}

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-10 py-4 bg-slate-200 text-slate-800 font-bold rounded-xl shadow-neumorphic hover:shadow-neumorphic-inset disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Generating...' : `Generate (1 Koin)`}
              </button>
            </div>
          </form>
        </div>

        {error && <p className="text-center text-red-500 font-semibold mt-6">{error}</p>}

        {loading && <p className="text-center text-slate-600 font-semibold mt-6 animate-pulse">Mohon tunggu, AI sedang bekerja...</p>}

        {imageUrl && (
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-slate-700 mb-6">Hasil Gambar:</h3>
            <div className="max-w-xl mx-auto p-4 bg-slate-200 rounded-2xl shadow-neumorphic">
                <img src={imageUrl} alt={prompt} className="rounded-xl w-full" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}