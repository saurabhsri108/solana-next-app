import Image from 'next/future/image';
import { HamburgerBar } from '../hamburger';
import Logo from '../logo';
import Navigation from '../navigation';
import userGuestImage from 'public/assets/images/julian-wan.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Header = () => {
  const [isGuest, setIsGuest] = useState(true);
  return (
    <header className="container p-4 pt-8">
      <nav className="flex flex-row items-center justify-between">
        <Logo />
        {isGuest && (
          <FontAwesomeIcon
            icon={faUser}
            className="inline-block w-10 h-10 p-1 rounded-full cursor-pointer ring-2 ring-secondary text-secondary"
            width={24}
            height={24}
            onClick={() => setIsGuest(!isGuest)}
          />
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
