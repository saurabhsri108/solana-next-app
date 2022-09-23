import Head from 'next/head';
import Link from 'next/link';

const Login = () => {
    return (
        <>
            <Head>
                <title>Beans Coffee Shopee - Experience the best the world has to offer</title>
            </Head>
            <main className="flex-1">
                <section className='container flex flex-col gap-4 p-4 pt-2 sm:flex-row'>
                    <Link href={"/api/auth/login"} passHref={true}>
                        Login
                    </Link>
                </section>
            </main>
        </>

    );
};

export default Login;