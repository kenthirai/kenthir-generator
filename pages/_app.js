import { SessionProvider } from "next-auth/react";
import '../styles/globals.css'; // Sesuaikan jika path berbeda

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;