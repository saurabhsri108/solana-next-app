import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { useAppDispatch, useAppSelector } from 'src/stores/hooks';
import { clearCart } from 'src/stores/slices/cart-slice';
import { trpc } from 'src/utils/trpc';

function Confirmed() {
    const [percentage, setPercentage] = useState(0);
    const [text, setText] = useState('🍪');

    useEffect(() => {
        const t1 = setTimeout(() => setPercentage(100), 100);
        const t2 = setTimeout(() => setText('✅'), 600);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <CircularProgressbar value={percentage} text={text} styles={
            buildStyles({
                pathColor: '#00BA00',
            })
        } />
    );
}

function ConfirmedPage() {
    const { mutate: orderMutate } = trpc.useMutation(['orders.update-transaction-status']);
    const userId = useAppSelector(state => state.user.userId);
    const orderSignature = useAppSelector(state => state.cart.orderSignature);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!userId) {
            return;
        }
        if (!!orderSignature) {
            const { slot, blockTime, signatureInfo } = orderSignature!;
            orderMutate({
                userId: userId,
                slot: slot,
                blockTime: blockTime,
                signatureInfo: signatureInfo
            });
            localStorage.setItem('productIds', '');
            dispatch(
                clearCart()
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!userId) {
        return (
            <Fragment>
                <Head>
                    <title>
                        All Products | Beans Coffee Shoppe - Experience the best the world has
                        to offer
                    </title>
                </Head>
                <main className="content">
                    <section className="flex-col items-center content__section">
                        <h1 className="text-4xl">Direct access makes this page useless</h1>
                        <Link href="/" passHref>
                            <a className="btn bg-primary text-default">Go back to home page</a>
                        </Link>
                    </section>
                </main >
            </Fragment>
        );
    }
    return (
        <Fragment>
            <Head>
                <title>
                    All Products | Beans Coffee Shoppe - Experience the best the world has
                    to offer
                </title>
            </Head>
            <main className="content">
                <section className="flex-col items-center content__section">
                    <h1 className="text-4xl">Thankyou, enjoy your coffee!</h1>
                    <div className='h-80 w-80'><Confirmed /></div>
                </section>
            </main >
        </Fragment>
    );
}

export default withPageAuthRequired(ConfirmedPage);