import Image from 'next/future/image';
import Logo from '../logo';
import userGuestImage from 'public/assets/images/julian-wan.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isGuest, setIsGuest] = useState(true);
  return (
    <header className="container p-4 pt-6">
      <nav className="flex flex-row items-center justify-between">
        <Logo />
        {isGuest && (
          <Link href={'/login'} passHref={true}>
            <FontAwesomeIcon
              icon={faUser}
              className="inline-block w-10 h-10 p-1 rounded-full cursor-pointer ring-2 ring-secondary text-secondary"
              width={24}
              height={24}
            />
          </Link>
        )}
        {!isGuest && (
          <Image
            src={userGuestImage}
            alt="Account Login"
            className="inline-block w-10 h-10 rounded-full cursor-pointer ring-2 ring-white"
            width={96}
            height={96}
            placeholder="blur"
            priority
            onClick={() => setIsGuest(!isGuest)}
          />
        )}
      </nav>
    </header>
  );
};

export default Header;
