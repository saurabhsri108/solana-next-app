import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { UserProvider } from "@auth0/nextjs-auth0";

import Header from "../components/header";
import Footer from "../components/footer";
import { store } from "../stores/store";

import "@fontsource/bellefair";
import "@fontsource/roboto-condensed";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <UserProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </UserProvider>
    </Provider>
  );
}

export default MyApp;
