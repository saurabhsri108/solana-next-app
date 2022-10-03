import Image from "next/future/image";

import type { IProduct } from "@interfaces/product";

export const CartItems = ({
  cartItem,
  paymentMethod,
}: {
  cartItem: IProduct;
  paymentMethod: "sol" | "usd";
}) => {
  return (
    <div className="flex items-start justify-between py-3 border-b border-b-border">
      <div className="flex items-start justify-between gap-4 w-9/12">
        <Image
          src={cartItem.imageURL}
          alt={cartItem.title}
          width={96}
          height={96}
          style={{ objectFit: "cover" }}
          quality={100}
          className="w-16 h-auto lg:w-24"
        />
        <div className="flex flex-col">
          <h3 className="text-2xl sm:text-4xl">{cartItem.title}</h3>
          <p className="text-lg sm:text-2xl">{cartItem.description}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 text-xl font-bold lg:text-3xl font-heading w-3/12">
        {paymentMethod === "usd" && (
          <span>${cartItem.priceUSD.toFixed(2)}</span>
        )}
        {paymentMethod === "sol" && (
          <span>◎{cartItem.priceSOL.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
};
