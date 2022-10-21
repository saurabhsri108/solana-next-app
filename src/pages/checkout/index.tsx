import Head from "next/head";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { IMakeTransactionInputData, IMakeTransactionOutputData } from 'src/schema/solana.schema';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { trpc } from 'src/utils/trpc';
import { UseQueryResult } from 'react-query';
import { useRouter } from 'next/router';
import {
    createQR,
    encodeURL,
    findReference,
    FindReferenceError,
    TransferRequestURLFields,
    validateTransfer,
    ValidateTransferError
} from '@solana/pay';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import ContactInformation from "@components/forms/contact-information";
import ShippingInformation from "@components/forms/shipping-information";
import CartContent from "@components/cart/cart-content";

import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { addSignatureToOrder } from 'src/stores/slices/cart-slice';

import type { ICheckoutForm, IShippingForm } from "@interfaces/form";
import type { IPaymentMethod } from '@interfaces/payment-method';
import { shopAddress, usdcAddress } from 'src/lib/addresses';
import BigNumber from 'bignumber.js';

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
    const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod>("usd");
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [transactionSent, setTransactionSent] = useState<boolean>(false);
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
    const { data: orderData }: UseQueryResult<{ id: string, products: string; }> = trpc.useQuery(['orders.get-order', {
        userId: userId!,
        status: "IN_CART"
    }], { enabled: !!userId });

    const reference = useMemo(() => Keypair.generate().publicKey, []);
    // QR code modifications
    const qrRef = useRef<HTMLDivElement | null>(null);
    const [urlParams, setUrlParams] = useState<TransferRequestURLFields>();
    const [productIds, setProductIds] = useState<string>("");

    const { data: priceData } = trpc.useQuery(['products.get-total-price', { paymentMethod, productIds: productIds }], {
        enabled: (paymentMethod === 'qr-sol' || paymentMethod === 'qr-usd') && (!!productIds)
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setProductIds(localStorage.getItem('productIds') || "");
        }
    }, []);

    useEffect(() => {
        if (!priceData) return;
        if (paymentMethod === 'sol' || paymentMethod === 'qr-sol') {
            setUrlParams({
                recipient: shopAddress,
                amount: new BigNumber(priceData.totalPrice),
                reference,
                label: "Beans Coffee Shoppe",
                message: "Thanks for your order!"
            });
        } else if (paymentMethod === 'qr-usd' || paymentMethod === 'usd') {
            setUrlParams({
                recipient: shopAddress,
                splToken: usdcAddress,
                amount: new BigNumber(priceData.totalPrice),
                reference,
                label: "Beans Coffee Shoppe",
                message: "Thanks for your order!"
            });
        }
    }, [paymentMethod, priceData, reference]);

    // console.log({ transaction, message, orderData, urlParams, paymentMethod });

    useEffect(() => {
        if (urlParams) {
            const url = encodeURL(urlParams);
            // console.log({ url: url.toString() });
            if (url) {
                const qr = createQR(url, 256, 'transparent');
                if (qrRef.current && priceData && new BigNumber(priceData.totalPrice).isGreaterThan(0)) {
                    qrRef.current!.innerHTML = '';
                    qr.append(qrRef.current!);
                }
            }
        }
    }, [urlParams, priceData]);

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
            toast.info(`${message} Please approve the transaction using your wallet`, {
                toastId: "creating-transaction",
                autoClose: 5000,
                position: "top-center"
            });
            trySendTransaction();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction, message]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const signatureInfo = await findReference(connection, reference, { finality: "finalized" });
                dispatch(
                    addSignatureToOrder({
                        blockTime: signatureInfo.blockTime,
                        signatureInfo: signatureInfo.signature,
                        slot: signatureInfo.slot
                    })
                );
                if (priceData) {
                    if (paymentMethod === 'qr-usd') {
                        await validateTransfer(
                            connection,
                            signatureInfo.signature,
                            {
                                recipient: shopAddress,
                                amount: new BigNumber(priceData.totalPrice),
                                splToken: usdcAddress,
                                reference,
                            },
                            { commitment: 'finalized' }
                        );
                    } else if (paymentMethod === 'qr-sol') {
                        await validateTransfer(
                            connection,
                            signatureInfo.signature,
                            {
                                recipient: shopAddress,
                                amount: new BigNumber(priceData.totalPrice),
                                reference,
                            },
                            { commitment: 'finalized' }
                        );
                    }
                }
                toast.success("Congratulations! Payment successful...", {
                    toastId: 'payment-success',
                    position: "top-center"
                });
                router.push('/checkout/confirmed');
            } catch (e) {
                if (e instanceof FindReferenceError) {
                    return;
                }
                if (e instanceof ValidateTransferError) {
                    // Transaction is invalid
                    console.error('Transaction is invalid', e);
                    return;
                }
                console.error("Unknown error", e);
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
            // console.log({ transaction, connection });
        } catch (error: any) {
            console.error(error);
            toast.error(error.message, { toastId: 'send-transaction-error', autoClose: 4000 });
        }
    }

    const handlePayment = async () => {
        if (!publicKey) {
            toast.info("You must connect your wallet for this transaction to proceed", {
                toastId: "wallet-connect",
                autoClose: 2000
            });
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
        // console.log({ transaction });
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
                    <section className="flex flex-col items-start gap-4 pt-3 pb-8 my-4 border-b border-b-border">
                        <div className='flex w-full gap-4'>
                            <button
                                className={`btn w-full py-4 px-8 hover:bg-primary hover:text-default disabled:bg-secondary disabled:cursor-not-allowed disabled:text-primary
              ${paymentMethod === "qr-usd" ? "bg-primary text-default" : ""}`}
                                onClick={() => setPaymentMethod("qr-usd")}
                                disabled={!canProceed}
                            >
                                Scan USDC QR Code
                            </button>
                            <button
                                className={`btn w-full py-4 px-8 hover:bg-primary hover:text-default disabled:bg-secondary disabled:cursor-not-allowed disabled:text-primary
              ${paymentMethod === "qr-sol" ? "bg-primary text-default" : ""}`}
                                onClick={() => setPaymentMethod("qr-sol")}
                                disabled={!canProceed}
                            >
                                Scan SOL QR Code
                            </button>
                        </div>
                        <div className='flex w-full gap-4'>
                            <button
                                className={`btn w-full py-4 px-8 hover:bg-primary hover:text-default disabled:bg-secondary disabled:cursor-not-allowed disabled:text-primary
              ${paymentMethod === "usd" ? "bg-primary text-default" : ""}`}
                                onClick={() => {
                                    setPaymentMethod("usd");
                                    if (qrRef.current) {
                                        qrRef!.current!.innerHTML = '';
                                    }
                                }}
                                disabled={!canProceed}
                            >
                                Pay by USDC
                            </button>
                            <button
                                className={`btn w-full py-4 px-8 hover:bg-primary hover:text-default disabled:bg-secondary disabled:cursor-not-allowed
              disabled:text-primary
              ${paymentMethod === "sol" ? "bg-primary text-default" : ""}`}
                                onClick={() => {
                                    setPaymentMethod("sol");
                                    if (qrRef.current) {
                                        qrRef!.current!.innerHTML = '';
                                    }
                                }}
                                disabled={!canProceed}
                            >
                                Pay by SOL
                            </button>
                        </div>
                    </section>
                    {(paymentMethod === 'qr-sol' || paymentMethod === 'qr-usd') &&
                        <section className='py-6 border-4 rounded-sm border-primary'>
                            <div className='flex items-center justify-center' ref={qrRef} />
                            <h2 className="text-5xl font-bold tracking-widest text-center font-heading text-primary">Scan
                                this and pay</h2>
                        </section>
                    }
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
