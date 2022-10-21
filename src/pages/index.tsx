import type { NextPage } from "next";
import type { UseQueryResult } from 'react-query';

import { useEffect, useState } from 'react';
import Head from "next/head";
import Image from "next/future/image";
import { trpc } from 'src/utils/trpc';
import { useUser } from "@auth0/nextjs-auth0";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';

import { addUser } from 'src/stores/slices/user-slice';
import { useAppDispatch } from 'src/stores/hooks';
import { addToCart, clearCart } from 'src/stores/slices/cart-slice';

// @ts-ignore
import homeCoffeeImage from "public/assets/images/ante-samarzija-coffee.jpeg";
import Footer from '@components/footer';
import Header from '@components/header';

const Home: NextPage = () => {
  const { mutate: register, data: userMutatedData, error: registerError } = trpc.useMutation(['users.register-user']);
  const { data: orderData }: UseQueryResult<{ products: string; }> = trpc.useQuery(['orders.get-order', { userId: userMutatedData?.id!, status: "IN_CART" }], {
    enabled: !!userMutatedData?.id && !!userMutatedData?.email_verified
  });
  const { data: productData } = trpc.useQuery(['products.get-products-by-ids', { ids: (orderData?.products! as string) }], {
    enabled: !!orderData?.products
  });

  const { user, error } = useUser();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const provider = user.sub?.split('|')[0];
      register({
        email: user.email!,
        email_verified: user.email_verified!,
        provider: provider!,
        sub: user.sub!,
        sid: (user.sid! as string),
        name: user.name!,
        nickname: user.nickname!,
        picture: user.picture!
      }, {
        onError: () => {
          console.error(registerError);
          toast.error(registerError?.message, { toastId: 'user-register-error' });
        }
      });
    }
  }, [register, user, registerError]);

  useEffect(() => {
    if (userMutatedData) {
      dispatch(
        addUser({
          id: userMutatedData.id,
          email: userMutatedData.email,
          email_verified: userMutatedData.email_verified,
          name: userMutatedData.name!,
          nickname: userMutatedData.nickname!,
          picture: userMutatedData.picture!,
          sid: userMutatedData.sid!,
          sub: userMutatedData.sub!,
          walletAddress: userMutatedData.walletAddress!
        })
      );
    }
  }, [userMutatedData, dispatch]);

  useEffect(() => {
    if (productData) {
      // console.log({ productData });
      const productIds = productData.map(data => data.id);
      localStorage.setItem('productIds', productIds.toString());
      for (const product of productData) {
        dispatch(
          addToCart({
            id: product.id,
            slug: product.slug,
            title: product.title,
            imageURL: product.imageURL,
            description: product.description,
            priceSOL: product.priceSOL,
            priceUSD: product.priceUSD,
            rating: product.rating,
          })
        );
      }
    }
  }, [productData, dispatch]);

  if (error) {
    toast.error("Error in Auth0: " + error.message, {
      toastId: "auth-user-error",
    });
  }

  if (user && !user.email_verified) {
    toast.info("Please verify your account from the link sent to your email!", {
      toastId: 'sent-user-verification-mail'
    });
    clearCart();
    fetch('/api/auth/logout').catch(error => console.error(error.message));
  }

  const handleBrowseAll = () => {
    if (!user) {
      toast.info('You must log in to browse our products! Redirecting...', { toastId: 'guest-redirect', autoClose: 2000 });
      setTimeout(() => {
        router.push('/api/auth/login');
      }, 3000);
      return;
    }
    return router.push('/products');
  };

  return (
    <>
      <Head>
        <title>
          Beans Coffee Shoppe - Experience the best the world has to offer
        </title>
      </Head>
      <Header />
      <main className="content">
        <section className="content__section">
          <div className="relative mx-auto overflow-hidden sm:flex-1 sm:order-2 w-[100%] h-[500px] lg:h-[640px]">
            <Image
              src={homeCoffeeImage}
              alt="Ante Samaria Coffee"
              sizes={"100%"}
              fill
              className="rounded-sm"
              style={{ objectFit: "cover", objectPosition: "center" }}
              quality={100}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 pb-4 sm:items-start sm:gap-6 sm:flex-1">
            <h1 className="text-3xl font-bold leading-8 tracking-wider text-center text-primary font-heading sm:text-7xl sm:max-w-sm sm:text-left">
              Beans Coffee Shoppe
            </h1>
            <p className="text-xl leading-6 text-center text-primary sm:text-left racking-wide sm:text-3xl">
              Experience the genuine taste from the best of beans
            </p>
            <div className="flex flex-row items-center justify-center sm:justify-start sm:gap-4 w-[100%]">
              <button className="btn bg-primary text-default border-primary" onClick={handleBrowseAll}>
                Browse All
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};


export default Home;
