import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Generator() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prompt, setPrompt] = useState("A beautiful sunset over the ocean");
  const [model, setModel] = useState("flux");
  const [userDalleKey, setUserDalleKey] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lindungi halaman
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
        // Anda bisa menambahkan parameter lain dari API Pollinations di sini
        width: 1024,
        height: 1024,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setImageUrl(data.imageUrl);
      // Refresh sesi untuk update jumlah koin di Navbar
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
    } else {
      setError(data.message || "Terjadi kesalahan.");
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
        <h2>AI Image Generator</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Prompt:</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              style={{ width: '100%', minHeight: '80px' }}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label>Model:</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} style={{ width: '100%' }}>
              <option value="flux">Flux (Default)</option>
              <option value="dall-e-3">DALL-E 3 (Butuh API Key)</option>
              {/* Tambahkan model lain dari Pollinations jika perlu */}
              <option value="gptimage">GPT Image (Transparan)</option>
              <option value="playground-v2.5">Playground v2.5</option>
            </select>
          </div>

          {model === 'dall-e-3' && (
            <div style={{ marginTop: '1rem' }}>
              <label>OpenAI API Key:</label>
              <input
                type="password"
                value={userDalleKey}
                onChange={(e) => setUserDalleKey(e.target.value)}
                placeholder="Masukkan kunci API OpenAI Anda"
                style={{ width: '100%' }}
              />
              <small>Kunci Anda tidak akan kami simpan. <Link href="/profile"><a>Atur kunci permanen di profil.</a></Link></small>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Generating...' : `Generate (1 Koin)`}
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {loading && <p>Mohon tunggu, gambar sedang dibuat...</p>}

        {imageUrl && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Hasil Gambar:</h3>
            <img src={imageUrl} alt={prompt} style={{ maxWidth: '100%' }} />
          </div>
        )}
      </main>
    </div>
  );
}