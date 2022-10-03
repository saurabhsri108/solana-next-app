import Link from 'next/link';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import { Fragment } from "react";

import { useAppSelector } from '../../stores/hooks';

export const CartIcon = () => {
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);

  return (
    <Link href="/checkout" passHref>
      <a className="cursor-pointer">
        <FontAwesomeIcon icon={faCartShopping} className="w-8 h-8 text-primary" />
        <span className="absolute top-3 text-md left-[0.8rem] w-7 h-7 bg-default text-primary shadow-lg rounded-2xl flex justify-center items-center font-bold font-heading">
          <span>{cartItemCount}</span>
        </span>
      </a>
    </Link>
  );
};
