import { useRouter } from "next/router";
import Head from "next/head";
import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import ContactInformation from "@components/forms/contact-information";
import ShippingInformation from "@components/forms/shipping-information";
import CartContent from "@components/cart/cart-content";

import { useAppSelector } from "../../stores/hooks";

import { ICheckoutForm, IShippingForm } from "@interfaces/form";

const Checkout = () => {
  const router = useRouter();
  const cartItemsCount: number = useAppSelector(
    (state) => state.cart.itemCount
  );
  const [paymentMethod, setPaymentMethod] = useState<"sol" | "usd">("usd");
  const [checkoutFormData, setCheckoutFormData] = useState<ICheckoutForm>({
    email: "",
    phone: "",
    offers: false,
  });
  const isCheckoutFormValidated = () => {
    return true;
  };
  const [shippingFormData, setShippingFormData] = useState<IShippingForm>({
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    country: "",
    state: "",
    pincode: "",
    saveInformation: false,
  });
  const isShippingFormValidated = () => {
    return true;
  };

  const canProceed =
    Boolean(cartItemsCount) &&
    Boolean(checkoutFormData.email) &&
    Boolean(checkoutFormData.phone) &&
    Boolean(shippingFormData.firstname) &&
    Boolean(shippingFormData.lastname) &&
    Boolean(shippingFormData.address) &&
    Boolean(shippingFormData.city) &&
    Boolean(shippingFormData.country) &&
    Boolean(shippingFormData.state) &&
    Boolean(shippingFormData.pincode) &&
    isCheckoutFormValidated() &&
    isShippingFormValidated();

  return (
    <Fragment>
      <Head>
        <title>
          Checkout | Beans Coffee Shoppe - Experience the best the world has to
          offer
        </title>
      </Head>
      <main
        className="flex flex-col justify-between gap-8
            lg:flex-row"
      >
        <section className="flex-col order-2 w-full px-6 py-10 lg:p-20 lg:order-none">
          <article className="hidden lg:flex">
            <button
              className="flex items-center text-xl"
              onClick={() => router.back()}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span className="ml-2">Go back</span>
            </button>
          </article>
          <h1 className="my-4 text-2xl sm:text-4xl lg:text-6xl">Checkout</h1>
          <section className="flex flex-col justify-between w-full gap-4 sm:flex-row">
            <div className="order-2 w-full sm:order-none">
              <ContactInformation
                checkoutFormData={checkoutFormData}
                setCheckoutFormData={setCheckoutFormData}
              />
              <ShippingInformation
                shippingFormData={shippingFormData}
                setShippingFormData={setShippingFormData}
              />
              <button
                className="w-full p-4 mt-3 text-xl lg:p-6 lg:text-2xl bg-primary text-default btn disabled:bg-secondary disabled:cursor-not-allowed"
                disabled={!canProceed}
              >
                Proceed to payment
              </button>
            </div>
          </section>
        </section>
        <section className="flex-col w-full px-6 py-10 lg:p-20 bg-slate-100">
          <article className="lg:hidden">
            <button
              className="flex items-center text-xl"
              onClick={() => router.back()}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span className="ml-2">Go back</span>
            </button>
          </article>
          <h2 className="mt-8 mb-4 text-2xl sm:text-3xl lg:text-4xl">
            Change Payment Method
          </h2>
          <section className="flex justify-start items-center gap-8 my-4 border-b border-b-border pt-3 pb-8">
            <button
              className={`btn py-8 px-12 hover:bg-primary hover:text-default disabled:bg-secondary disabled:cursor-not-allowed disabled:text-primary 
              ${paymentMethod === "usd" ? "bg-primary text-default" : ""}`}
              onClick={() => setPaymentMethod("usd")}
              disabled={!canProceed}
            >
              Pay by USDC
            </button>
            <button
              className={`btn py-8 px-12 hover:bg-primary hover:text-default disabled:bg-secondary disabled:cursor-not-allowed 
              disabled:text-primary
              ${paymentMethod === "sol" ? "bg-primary text-default" : ""}`}
              onClick={() => setPaymentMethod("sol")}
              disabled={!canProceed}
            >
              Pay by SOL
            </button>
          </section>
          <h2 className="mt-8 mb-4 text-2xl sm:text-3xl lg:text-4xl">
            Order Summary
          </h2>
          <CartContent paymentMethod={paymentMethod} />
        </section>
      </main>
    </Fragment>
  );
};

export default Checkout;
