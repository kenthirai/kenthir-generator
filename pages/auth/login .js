import { getProviders, signIn } from "next-auth/react";

function LoginPage({ providers }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-200">
      <div className="p-10 bg-slate-200 rounded-2xl shadow-neumorphic text-center">
        <h1 className="text-3xl font-bold text-slate-700 mb-2">Login</h1>
        <p className="text-slate-500 mb-8">Pilih salah satu cara untuk masuk</p>
        <div className="space-y-4">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                onClick={() => signIn(provider.id, { callbackUrl: '/generator' })}
                className="w-full px-8 py-3 bg-slate-200 text-slate-800 font-semibold rounded-xl shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-200"
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}