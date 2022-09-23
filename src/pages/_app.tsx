import { UserProvider } from '@auth0/nextjs-auth0';
import '@fontsource/bellefair';
import '@fontsource/roboto-condensed';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '../components/header';
import Footer from '../components/footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </UserProvider>
  );
}

export default MyApp;
