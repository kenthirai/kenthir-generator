import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import OpenAI from 'openai';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (user.coins < 1) {
    return res.status(402).json({ message: 'Koin tidak cukup!' });
  }

  const { prompt, model, width, height, seed, userDalleKey } = req.body;

  let imageUrl = '';
  let generationSuccess = false;

  try {
    // Jika pengguna memilih DALL-E 3 dan memberikan kunci
    if (model === 'dall-e-3' && userDalleKey) {
      try {
        const openai = new OpenAI({ apiKey: userDalleKey });
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024", // DALL-E 3 punya ukuran spesifik
        });
        imageUrl = response.data[0].url;
        generationSuccess = true;
      } catch (error) {
        console.error("DALL-E 3 API Error:", error.message);
        // Jika DALL-E gagal (misal, kunci tidak valid), jatuh kembali ke model default (Pollinations)
        // Anda bisa memberi notifikasi ke user di sini
      }
    }

    // Jika bukan DALL-E atau DALL-E gagal, gunakan Pollinations.AI
    if (!generationSuccess) {
      const encodedPrompt = encodeURIComponent(prompt);
      const pollutionsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${model || 'flux'}&width=${width || 1024}&height=${height || 1024}&seed=${seed || 42}&nologo=true`; //

      const pollutionsResponse = await fetch(pollutionsUrl);
      if (!pollutionsResponse.ok) {
        throw new Error(`Pollinations API error: ${pollutionsResponse.statusText}`);
      }
      // Karena API ini mengembalikan gambar langsung, kita kembalikan URL yang kita panggil
      imageUrl = pollutionsUrl;
    }

    // Jika berhasil (hanya jika menggunakan Pollinations, karena DALL-E sudah dicek)
    // Untuk tujuan ini, kita anggap panggilan ke Pollinations selalu "berhasil" jika tidak ada error
    generationSuccess = true;

    // Kurangi koin jika gambar berhasil dibuat
    if (generationSuccess) {
      await prisma.user.update({
        where: { id: user.id },
        data: { coins: { decrement: 1 } },
      });
    }

    res.status(200).json({ imageUrl });

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ message: 'Gagal membuat gambar.', error: error.message });
  }
}