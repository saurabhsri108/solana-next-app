import { Fragment, useEffect } from "react";
import Image from "next/future/image";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { toast } from "react-toastify";
import { useUser } from '@auth0/nextjs-auth0';
import { trpc } from 'src/utils/trpc';
import { useWallet } from '@solana/wallet-adapter-react';

import { CartIcon } from "./cart-icon";
import { ButtonLoading } from '@components/loaders';

import blankProfileImage from "public/assets/images/blank-profile.png";

export const ActionNavigations = () => {
  const { user, isLoading } = useUser();
  const { publicKey } = useWallet();
  const { mutate: updateWalletAddress, error: updateWalletAddressError } = trpc.useMutation(['users.update-wallet-address']);


  useEffect(() => {
    if (publicKey && user && user.email) {
      updateWalletAddress({ email: user.email, walletAddress: publicKey.toString() }, {
        onError: () => {
          console.error(updateWalletAddressError);
          toast.error(updateWalletAddressError?.message);
        }
      });
    }
  }, [publicKey, user, updateWalletAddress, updateWalletAddressError]);

  if (isLoading) {
    return <nav className="relative flex items-end justify-between gap-8">
      <CartIcon />
      <button className="flex items-center gap-2 btn bg-primary text-default border-primary">
        <span>Login</span> <ButtonLoading />
      </button>
    </nav>;
  }

  if (user && !user.email_verified) {
    return <nav className="relative flex items-end justify-between gap-8">
      <CartIcon />
      <Link href={"/api/auth/login"} passHref={true}>
        <button className="btn bg-primary text-default border-primary">
          Login
        </button>
      </Link>
    </nav>;
  }

  if (!user) {
    return <nav className="relative flex items-end justify-between gap-8">
      <CartIcon />
      <Link href={"/api/auth/login"} passHref={true}>
        <button className="btn bg-primary text-default border-primary">
          Login
        </button>
      </Link>
    </nav>;
  }

  return (
    <nav className="relative flex items-end justify-between gap-8">
      <CartIcon />
      <Fragment>
        <Image
          src={user.picture! || blankProfileImage}
          alt="Account Login"
          className="inline-block rounded-full cursor-pointer ring-2 ring-white"
          width={58}
          height={58}
        />
        <WalletMultiButton className="transition-all bg-primary text-default hover:scale-105 btn" style={{ height: "auto", lineHeight: "inherit" }} />
        <Link href={"/api/auth/logout"} passHref={true}>
          <a className="btn">Logout</a>
        </Link>
      </Fragment>
    </nav>
  );
};
