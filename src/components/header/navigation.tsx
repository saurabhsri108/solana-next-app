import Link from "next/link";

const Navigation = () => {
  return (
    <ul className="flex items-center justify-between gap-4 ml-20 text-xl leading-relaxed select-none">
      <Link href="/" passHref>
        <a className="hover:underline">Home</a>
      </Link>
      <Link href="/products" passHref>
        <a className="hover:underline">All Products</a>
      </Link>
    </ul>
  );
};

export default Navigation;
