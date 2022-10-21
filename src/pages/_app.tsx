import type { AppProps } from "next/app";
import type { NextPageContext } from "next";
import type { AppRouter } from 'src/server/router/app.router';

import { useMemo } from 'react';
import { Provider } from "react-redux";
import { UserProvider } from "@auth0/nextjs-auth0";
import { Flip, ToastContainer } from "react-toastify";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { withTRPC } from "@trpc/next";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";

import superjson from 'superjson';
import { store } from "../stores/store";

import "@fontsource/bellefair";
import "@fontsource/roboto-condensed";
import 'react-toastify/dist/ReactToastify.css';
import "../styles/solana-wallet-react-ui.css";
import "../styles/globals.css";
import Header from '@components/header';
import Footer from '@components/footer';

function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet; // can be set to 'devnet',
  // 'testnet', or 'mainnet-beta'
  const endpoint = clusterApiUrl(network); // custom RPC endpoint can be
  // provided here as well
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })], [network]); // @solana/wallet-adapter-wallets supports multiple wallets of SOLANA and comes with treeshaking feature. Only mentioned wallet is included.
  return (
    <Provider store={store}>
      <UserProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets}>
            <WalletModalProvider>
              <Header />
              <Component {...pageProps} />
              <Footer />
              <ToastContainer transition={Flip} theme="colored" />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </UserProvider>
    </Provider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }: { ctx: NextPageContext | undefined; }) {
    const url: string = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    const links = [
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10,
        url,
      }),
    ];

    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60
          }
        }
      },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            //'x-ssr': '1' // request is done on the server with this line
          };
        }
      },
      links,
      transformer: superjson
    };
  }
})(MyApp);
