import { useUser } from '@auth0/nextjs-auth0';
import Link from "next/link";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Navigation = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleAllProductsClick = () => {
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
    <ul className="flex items-center justify-between gap-4 ml-20 text-xl leading-relaxed select-none">
      <Link href="/" passHref>
        <a className="hover:underline">Home</a>
      </Link>
      <a className="cursor-pointer hover:underline" onClick={handleAllProductsClick}>All Products</a>
    </ul>
  );
};

export default Navigation;
