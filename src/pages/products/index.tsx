import Head from "next/head";
import { Card } from "@components/card";
import { IProduct } from "@interfaces/product";
import products from "../../data/coffee-data.json";

const Products = ({ products }: { products: IProduct[] }) => {
  return (
    <>
      <Head>
        <title>
          All Products | Beans Coffee Shoppe - Experience the best the world has
          to offer
        </title>
      </Head>
      <main className="content">
        <section className="content__section">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <Card
                key={product.id}
                id={product.id}
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
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {
      products: products,
    },
  };
}

export default Products;
