import Head from "next/head";
import { Card } from "@components/card";
import { IProduct } from "@interfaces/product";
import { prisma } from 'src/utils/prisma';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Header from '@components/header';
import Footer from '@components/footer';

const Products = ({ jsonProducts }: { jsonProducts: string; }) => {
  const products: IProduct[] = JSON.parse(jsonProducts);
  return (
    <>
      <Head>
        <title>
          All Products | Beans Coffee Shoppe - Experience the best the world has
          to offer
        </title>
      </Head>
      <Header />
      <main className="content">
        <section className="content__section">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <Card
                key={product.id}
                id={product.id}
                slug={product.slug}
                title={product.title}
                description={product.description}
                priceUSD={product.priceUSD}
                priceSOL={product.priceSOL}
                imageURL={product.imageURL}
                rating={product.rating}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export async function getStaticProps() {
  const products = await prisma?.product.findMany();
  return {
    props: {
      jsonProducts: JSON.stringify(products),
    },
  };
}


export default withPageAuthRequired(Products, {
  onError: () => <div>You are not authenticated to visit this page directly</div>,
  onRedirecting: () => <main className="content">
    <section className="justify-center content__section">
      <div className="relative px-12 py-8 text-xl text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
        <strong className="font-bold">Wait! You are not authorized user! </strong>
        <span className="block sm:inline">Redirecting to Login.</span>
      </div>
    </section>
  </main>
});
