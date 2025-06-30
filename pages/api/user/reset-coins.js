import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res);
  if (!session) return res.status(401).end();

  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password dibutuhkan.' });

  const config = await prisma.adminConfig.findUnique({
    where: { key: 'coinResetPassword' },
  });

  if (!config) return res.status(500).json({ message: 'Fitur reset tidak dikonfigurasi.' });

  const isPasswordValid = await bcrypt.compare(password, config.value);

  if (isPasswordValid) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { coins: 10 }, // Reset ke 10 koin
    });
    return res.status(200).json({ message: 'Koin berhasil direset!' });
  } else {
    return res.status(403).json({ message: 'Password salah.' });
  }
}