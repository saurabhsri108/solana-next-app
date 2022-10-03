import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/future/image";

// @ts-ignore
import homeCoffeeImage from "public/assets/images/ante-samarzija-coffee.jpeg";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          Beans Coffee Shoppe - Experience the best the world has to offer
        </title>
      </Head>
      <main className="content">
        <section className="content__section">
          <div className="relative sm:flex-1 sm:order-2 w-[100%] h-[18rem] lg:w-[100%] lg:h-[40rem] overflow-hidden mx-auto">
            <Image
              src={homeCoffeeImage}
              alt="Ante Samaria Coffee"
              sizes="100vw"
              fill
              priority
              placeholder="blur"
              className="rounded-sm"
              style={{ objectFit: "cover", objectPosition: "center" }}
              quality={100}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 pb-4 sm:items-start sm:gap-6 sm:flex-1">
            <h1 className="text-3xl font-bold leading-5 tracking-wider text-primary font-heading sm:text-7xl sm:max-w-sm">
              Beans Coffee Shoppe
            </h1>
            <p className="text-xl leading-6 text-center text-primary sm:text-left racking-wide sm:text-3xl">
              Experience the genuine taste from the best of beans
            </p>
            <div className="flex flex-row items-center justify-between sm:justify-start sm:gap-4 w-[100%]">
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
