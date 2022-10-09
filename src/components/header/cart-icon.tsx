import { useUser } from '@auth0/nextjs-auth0';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import { useAppSelector } from '../../stores/hooks';

export const CartIcon = () => {
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);
  const { user } = useUser();
  const router = useRouter();

  const handleCheckoutClick = () => {
    if (!user) {
      toast.info('You must log in to see your cart! Redirecting...', { toastId: 'guest-redirect', autoClose: 2000 });
      setTimeout(() => {
        router.push('/api/auth/login');
      }, 3000);
      return;
    }
    return router.push('/checkout');
  };

  return (
    <span className="flex cursor-pointer" onClick={handleCheckoutClick}>
      <FontAwesomeIcon icon={faCartShopping} className="w-12 h-12 text-primary" />
      <span className="absolute top-[-0.2rem] text-md left-[1.4rem] w-9 h-9 bg-default text-primary shadow-lg rounded-2xl flex justify-center items-center font-bold font-heading">
        <span>{cartItemCount}</span>
      </span>
    </span>
  );
};
