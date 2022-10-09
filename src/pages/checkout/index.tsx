import Head from "next/head";
import { Fragment, useEffect, useMemo, useState } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { IMakeTransactionInputData, IMakeTransactionOutputData } from 'src/schema/solana.schema';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { trpc } from 'src/utils/trpc';
import { UseQueryResult } from 'react-query';
import { useRouter } from 'next/router';
import { findReference, FindReferenceError } from '@solana/pay';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import ContactInformation from "@components/forms/contact-information";
import ShippingInformation from "@components/forms/shipping-information";
import CartContent from "@components/cart/cart-content";
import { ICheckoutForm, IShippingForm } from "@interfaces/form";

import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { Toast } from 'react-toastify/dist/types';
import { addSignatureToOrder } from 'src/stores/slices/cart-slice';


const Checkout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet(); // sendTransaction is used to let the buyer approve the transaction
  const cartItemsCount: number = useAppSelector(
    (state) => state.cart.itemCount
  );
  const userId = useAppSelector(state => state.user.userId);
  const cartItems = useAppSelector(state => state.cart.items);
  const [paymentMethod, setPaymentMethod] = useState<"sol" | "usd">("usd");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [transactionSent, setTransactionSent] = useState<boolean>(false);
  const reference = useMemo(() => Keypair.generate().publicKey, []);
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
  const { data: orderData }: UseQueryResult<{ id: string, products: string; }> = trpc.useQuery(['orders.get-order', { userId: userId!, status: "IN_CART" }], { enabled: !!userId });


  console.log({ transaction, message, orderData });

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

  useEffect(() => {
    if (transaction && message) {
      toast.info(`${message} Please approve the transaction using your wallet`, { toastId: "creating-transaction", autoClose: 5000, position: "top-center" });
      trySendTransaction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction, message]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const signatureInfo = await findReference(connection, reference);
        dispatch(
          addSignatureToOrder({
            blockTime: signatureInfo.blockTime,
            signatureInfo: signatureInfo.signature,
            slot: signatureInfo.slot
          })
        );

        toast.success("Congratulations! Payment successful...", { toastId: 'payment-success', position: "top-center" });
        router.push('/checkout/confirmed');
      } catch (e) {
        if (e instanceof FindReferenceError) {
          return;
        }
        console.log("Unknown error", e);
        toast.error("Unknown Error");
      }
    }, 500);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionSent]);

  async function trySendTransaction() {
    if (!transaction) {
      return;
    }
    try {
      await sendTransaction(transaction, connection);
      setTransactionSent(true);
    } catch (error: any) {
      toast.error(error.message, { toastId: 'send-transaction-error', autoClose: 4000 });
      console.log(error);
    }
  }

  const handlePayment = async () => {
    if (!publicKey) {
      toast.info("You must connect your wallet for this transaction to proceed", { toastId: "wallet-connect", autoClose: 2000 });
      return;
    }
    const searchParams = new URLSearchParams();
    const productIds = cartItems.map(item => item.id).toString();
    searchParams.append('products', productIds);
    searchParams.append('reference', reference.toString());
    searchParams.append('paymentMethod', paymentMethod);

    const body: IMakeTransactionInputData = {
      walletAddress: (publicKey as PublicKey).toString(),
      userId: userId!,
      orderId: orderData?.id!
    };

    const response = await fetch(`/api/solana/make-transaction?${searchParams.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const json = await response.json() as IMakeTransactionOutputData;

    if (response.status !== 200) {
      console.error(json);
      return;
    }

    const transaction = Transaction.from(Buffer.from(json.transaction, 'base64'));
    setTransaction(transaction);
    setMessage(json.message);
    console.log({ transaction });
  };

  return (
    <Fragment>
      <Head>
        <title>
          Checkout | Beans Coffee Shoppe - Experience the best the world has to
          offer
        </title>
      </Head>
      <main
        className="flex flex-col justify-between gap-8 lg:flex-row"
      >
        <section className="flex-col order-2 w-full px-6 py-10 lg:p-20 lg:order-none">
          <article className="hidden lg:flex">
            <Link href="/products" passHref>
              <a className='flex items-center text-xl'>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="ml-2">Go back to products</span>
              </a>
            </Link>
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
                onClick={handlePayment}
                disabled={!canProceed}
              >
                Complete Payment
              </button>
            </div>
          </section>
        </section>
        <section className="flex-col w-full px-6 py-10 lg:p-20 bg-slate-100">
          <article className="lg:hidden">
            <Link href="/products" passHref>
              <a className='flex items-center text-xl'>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="ml-2">Go back to products</span>
              </a>
            </Link>
          </article>
          <h2 className="mt-8 mb-4 text-2xl sm:text-3xl lg:text-4xl">
            Change Payment Method
          </h2>
          <section className="flex items-center justify-start gap-8 pt-3 pb-8 my-4 border-b border-b-border">
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

export default withPageAuthRequired(Checkout);
