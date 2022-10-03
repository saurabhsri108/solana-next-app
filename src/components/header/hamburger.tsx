export const HamburgerBar = () => {
    return <section className='flex flex-col items-center justify-center gap-1 sm:hidden'>
        <span className='block w-1 h-[0.15rem] bg-primary rounded'></span>
        <span className='block w-3 h-[0.15rem] bg-primary rounded'></span>
        <span className='block w-5 h-[0.15rem] bg-primary rounded'></span>
        <span className='block h-[0.15rem] bg-primary w-7 rounded'></span>
    </section>;
};