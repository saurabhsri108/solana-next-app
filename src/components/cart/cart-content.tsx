import { Fragment, memo } from "react";
import { useRouter } from "next/router";

import { CartItems } from "./cart-items";
import { useAppSelector } from "../../stores/hooks";

import type { IProduct } from "@interfaces/product";

const CartContent = ({ paymentMethod }: { paymentMethod: "usd" | "sol" }) => {
  const cartItems: IProduct[] = useAppSelector((state) => state.cart.items);
  const cartItemsCount: number = useAppSelector(
    (state) => state.cart.itemCount
  );
  const router = useRouter();
  const addProductsToCart = () => {
    return router.push("/products");
  };

  let cartContent = <p>Loading cart items...</p>;
  if (Array.isArray(cartItems) && cartItems.length === 0) {
    cartContent = (
      <section>
        <p className="p-4 my-6 text-2xl shadow-lg bg-default">
          No items in the cart!
        </p>
        <button
          className="btn bg-primary text-white"
          onClick={addProductsToCart}
        >
          Add products to cart
        </button>
      </section>
    );
  } else if (Array.isArray(cartItems) && cartItems.length > 0) {
    let totalChargesSOL: number = 0;
    let totalChargesUSD: number = 0;
    cartContent = (
      <Fragment>
        {cartItems.map((item) => {
          totalChargesSOL = Number(
            (totalChargesSOL + item.priceSOL).toFixed(2)
          );
          totalChargesUSD = Number(
            (totalChargesUSD + item.priceUSD).toFixed(2)
          );
          return (
            <CartItems
              key={item.id}
              cartItem={item}
              paymentMethod={paymentMethod}
            />
          );
        })}
        <section className="flex flex-col gap-2 py-4 my-4 text-lg font-bold leading-relaxed tracking-wide lg:text-2xl font-heading">
          <div className="flex items-center justify-between">
            <span>Total Items</span>
            <span>{cartItemsCount}</span>
          </div>
          {paymentMethod === "usd" && (
            <Fragment>
              <div className="flex items-center justify-between">
                <span>Total Charges</span>
                <span>${totalChargesUSD.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping Charges</span>
                <span>${(totalChargesUSD * 0.2).toFixed(2)}</span>
              </div>
            </Fragment>
          )}
          {paymentMethod === "sol" && (
            <Fragment>
              <div className="flex items-center justify-between">
                <span>Total Charges</span>
                <span>◎{totalChargesSOL.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping Charges</span>
                <span>◎{(totalChargesSOL * 0.1).toFixed(2)}</span>
              </div>
            </Fragment>
          )}
        </section>
        <section className="flex items-center justify-between py-4 my-4 text-3xl font-bold leading-relaxed tracking-wide border-t font-heading border-t-secondary">
          <h2>Total</h2>
          {paymentMethod === "usd" && (
            <h2>${(totalChargesUSD + totalChargesUSD * 0.2).toFixed(2)}</h2>
          )}
          {paymentMethod === "sol" && (
            <h2>◎{(totalChargesSOL + totalChargesSOL * 0.1).toFixed(2)}</h2>
          )}
        </section>
      </Fragment>
    );
  }

  return cartContent;
};

export default memo(CartContent);
