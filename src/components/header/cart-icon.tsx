import Link from 'next/link';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import { Fragment } from "react";

import { useAppSelector } from '../../stores/hooks';

export const CartIcon = () => {
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);

  return (
    <Link href="/checkout" passHref>
      <a className="flex cursor-pointer">
        <FontAwesomeIcon icon={faCartShopping} className="w-12 h-12 text-primary" />
        <span className="absolute top-[-0.2rem] text-md left-[1.4rem] w-9 h-9 bg-default text-primary shadow-lg rounded-2xl flex justify-center items-center font-bold font-heading">
          <span>{cartItemCount}</span>
        </span>
      </a>
    </Link>
  );
};
