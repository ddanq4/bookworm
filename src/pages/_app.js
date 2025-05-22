import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Header />
            <Breadcrumbs />
            <Component {...pageProps} />
        </>
    );
}
