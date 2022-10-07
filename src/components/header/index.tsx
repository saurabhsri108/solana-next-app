import { useRouter } from 'next/router';

import Logo from './logo';
import Navigation from './navigation';
import { ActionNavigations } from './action-navigations';
import { HamburgerBar } from './hamburger';

const Header = () => {
  const router = useRouter();
  if (router.pathname === '/checkout') {
    return null;
  }
  return (
    <header className="p-6">
      <section className="container flex items-center justify-between ">
        <Logo isHidden={false} />
        <nav className="hidden lg:flex lg:items-end lg:justify-between lg:flex-1">
          <Navigation />
          <ActionNavigations />
        </nav>
        <HamburgerBar />
      </section>
    </header>
  );
};

export default Header;
