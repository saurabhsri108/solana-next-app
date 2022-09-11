import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugSaucer } from '@fortawesome/free-solid-svg-icons';

const Logo = ({ isHidden }: { isHidden: boolean; }) => {
    return <Link href="/" passHref>
        <div className={`flex flex-col items-center justify-center cursor-pointer ${isHidden === true ? 'hidden md:visible' : ''}`}>
            <FontAwesomeIcon icon={faMugSaucer} width={24} />
            <p className="text-xl font-bold leading-3 tracking-wide sm:text-3xl font-heading sm:leading-[1rem]">Beans</p>
        </div>
    </Link>;
};

export default Logo;