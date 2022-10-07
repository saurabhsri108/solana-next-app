import type { NextPage } from "next";

import { useEffect, useState } from 'react';
import Head from "next/head";
import Image from "next/future/image";
import Link from "next/link";
import { trpc } from 'src/utils/trpc';
import { useUser } from "@auth0/nextjs-auth0";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';

// @ts-ignore
import homeCoffeeImage from "public/assets/images/ante-samarzija-coffee.jpeg";

const Home: NextPage = () => {
  const { mutate: register, error: registerError } = trpc.useMutation(['users.register-user']);
  const { user, error } = useUser();
  const router = useRouter();
  console.log(user);

  useEffect(() => {
    if (user) {
      console.log('user-register');
      const provider = user?.sub?.split('|')[0];
      register({
        email: user?.email!,
        email_verified: user?.email_verified!,
        provider: provider!,
        sub: user?.sub!,
        sid: user?.sid!,
        name: user?.name!,
        nickname: user?.nickname!,
        picture: user?.picture!
      }, {
        onError: () => {
          console.error(registerError);
          toast.error(registerError?.message);
        }
      });
    }
  }, [register, user, registerError]);

  if (error) {
    toast.error("Error in Auth0: " + error.message, {
      toastId: "auth-user-error",
    });
  }

  if (user && !user.email_verified) {
    toast.info("Please verify your account from the link sent to your email!", {
      toastId: 'sent-user-verification-mail',
      position: "top-center",

    });
    fetch('/api/auth/logout').catch(error => console.error(error.message));
  }

  return (
    <>
      <Head>
        <title>
          Beans Coffee Shoppe - Experience the best the world has to offer
        </title>
      </Head>
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
              <Link href={"/products"} passHref={true}>
                <button className="btn bg-primary text-default border-primary">
                  Browse All
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
