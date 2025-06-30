import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-slate-200 p-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-2xl font-bold text-slate-700">
        Kenthir AI
      </Link>
      <div className="flex items-center gap-6">
        {status === "authenticated" ? (
          <>
            <span className="font-semibold text-slate-600">
              Koin: {session.user.coins}
            </span>
            <Link href="/profile">
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-10 h-10 rounded-full shadow-neumorphic cursor-pointer"
              />
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-200"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}