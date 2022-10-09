import Image from "next/future/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';

import { Rating } from "./rating";

import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { addToCart, deleteFromCart } from "../../stores/slices/cart-slice";

import type { IProduct } from "@interfaces/product";
import { trpc } from 'src/utils/trpc';
import { useUser } from '@auth0/nextjs-auth0';
import { useEffect, useState } from 'react';

export const Card = ({
  id,
  imageURL,
  title,
  slug,
  description,
  priceSOL,
  priceUSD,
  rating,
}: IProduct) => {
  const userId = useAppSelector(state => state.user.userId);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { mutate: orderMutate, error: orderError } = trpc.useMutation(['orders.add-order']);

  const [itemState, setItemState] = useState<'add' | 'remove'>('add');

  useEffect(() => {
    const productIds = localStorage.getItem('productIds');
    if (productIds && productIds !== '') {
      const isIdPresent = productIds.split(',').includes(id);
      if (isIdPresent) {
        setItemState('remove');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (orderError) {
    console.error(orderError);
    toast.error(orderError.message, {
      toastId: 'add-order-error'
    });
  }

  const addItemToCart = (type: "cart" | "buy") => {
    let productIds = localStorage.getItem('productIds');
    if (productIds && productIds !== "") {
      productIds += "," + id;
      localStorage.setItem("productIds", productIds);
    } else {
      productIds = id;
      localStorage.setItem("productIds", id);
    }
    console.log({ userId });
    orderMutate({
      userId: userId!,
      products: productIds,
      status: "IN_CART"
    });

    dispatch(
      addToCart({
        id,
        slug,
        title,
        imageURL,
        description,
        priceSOL,
        priceUSD,
        rating,
      })
    );
    setItemState('remove');
    if (type === "buy") {
      return router.push("/checkout");
    }
    return;
  };

  const removeItemFromCart = (id: string) => {
    let productIds = localStorage.getItem('productIds');
    if (productIds && productIds !== "") {
      const ids = productIds.split(",");
      const newIds = ids.filter(pid => pid != id);
      productIds = newIds.toString();
      localStorage.setItem('productIds', productIds);
    } else {
      productIds = null;
    }

    orderMutate({
      userId: userId!,
      products: productIds || undefined,
      status: "IN_CART"
    });

    dispatch(
      deleteFromCart({
        id
      })
    );
    setItemState('add');
    return;
  };

  return (
    <div className="rounded-b-sm shadow-lg">
      <div className="w-full overflow-hidden bg-gray-200 rounded-t-sm aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8">
        <Image
          src={imageURL}
          alt={title}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          className="group-hover:opacity-75"
        />
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl leading-2">{title}</h2>
        <span className="mt-2">
          <Rating rating={rating} />
        </span>
        <p className="mt-4 text-center text-md leading-2 line-clamp-3">
          {description}
        </p>
        <div className="flex items-center w-full mt-2 text-2xl justify-evenly font-heading">
          <span>${priceUSD}</span>
          <span>or</span>
          <span>{priceSOL} SOL</span>
        </div>
        <div className="flex flex-col w-full gap-2 mt-4">
          <Link href="/checkout" passHref>
            <button
              className="w-full btn bg-primary text-default"
              onClick={() => addItemToCart("buy")}
            >
              Buy now
            </button>
          </Link>
          <button className="w-full btn" onClick={() => {
            if (itemState === 'add') {
              addItemToCart("cart");
            } else if (itemState === 'remove') {
              removeItemFromCart(id);
            }
          }}>
            {itemState === 'add' && "Add to cart"}
            {itemState === 'remove' && "Remove from cart"}
          </button>
        </div>
      </div>
    </div>
  );
};
