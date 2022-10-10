import Image from "next/future/image";

import type { IProduct } from "@interfaces/product";
import type { IPaymentMethod } from '@interfaces/payment-method';

export const CartItems = ({
  cartItem,
  paymentMethod,
}: {
  cartItem: IProduct;
  paymentMethod: IPaymentMethod;
}) => {
  return (
    <div className="flex items-start justify-between py-3 border-b border-b-border">
      <div className="flex items-start justify-between w-9/12 gap-4">
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
      <div className="flex flex-col items-end w-3/12 gap-2 text-xl font-bold lg:text-3xl font-heading">
        {(paymentMethod === "usd" || paymentMethod === 'qr-usd') && (
          <span>${cartItem.priceUSD.toFixed(2)}</span>
        )}
        {(paymentMethod === "sol" || paymentMethod === 'qr-sol') && (
          <span>◎{cartItem.priceSOL.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
};
