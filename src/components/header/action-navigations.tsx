import { Fragment } from "react";
import Link from "next/link";
import Image from "next/future/image";
import { useUser } from "@auth0/nextjs-auth0";

import { CartIcon } from "./cart-icon";

import blankProfileImage from "public/assets/images/blank-profile.png";

export const ActionNavigations = () => {
  const { user, isLoading } = useUser();

  return (
    <nav className="relative flex items-end justify-between gap-8">
      <CartIcon />
      {isLoading ||
        (!user && (
          <Link href={"/api/auth/login"} passHref={true}>
            <button className="btn bg-primary text-default border-primary">
              Login
            </button>
          </Link>
        ))}
      {!isLoading ||
        (user && (
          <Fragment>
            <Image
              src={user.picture || blankProfileImage}
              alt="Account Login"
              className="inline-block w-10 h-10 rounded-full cursor-pointer ring-2 ring-white"
              width={96}
              height={96}
              priority
            />
            <Link href={"/api/auth/login"} passHref={true}>
              Logout
            </Link>
          </Fragment>
        ))}
    </nav>
  );
};
