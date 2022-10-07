import Image from "next/future/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Rating } from "./rating";

import { useAppDispatch } from "../../stores/hooks";
import { addToCart } from "../../stores/slices/cart-slice";

import type { IProduct } from "@interfaces/product";

export const Card = ({
  id,
  imageURL,
  title,
  description,
  priceSOL,
  priceUSD,
  rating,
}: IProduct) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const addItemToCart = (type: "cart" | "buy") => {
    dispatch(
      addToCart({
        id,
        title,
        imageURL,
        description,
        priceSOL,
        priceUSD,
        rating,
      })
    );
    if (type === "buy") {
      return router.push("/checkout");
    }
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
          <button className="w-full btn" onClick={() => addItemToCart("cart")}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
