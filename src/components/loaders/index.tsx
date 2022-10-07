import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

export const Loading = () => {
    return <div className='flex flex-col items-center justify-center min-h-screen'>
        <span className='w-24 h-auto'>
            <FontAwesomeIcon icon={faCircleNotch} spin={true} />
        </span>
    </div>;
};

export const ButtonLoading = () => {
    return <div className='w-4'>
        <FontAwesomeIcon icon={faCircleNotch} spin={true} />
    </div>;
};