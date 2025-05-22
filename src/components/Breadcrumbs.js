import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs() {
    const router = useRouter();
    const pathParts = router.pathname.split('/').filter(Boolean);

    const crumbs = pathParts.map((part, idx) => {
        const href = '/' + pathParts.slice(0, idx + 1).join('/');
        const label = decodeURIComponent(part).replace(/-/g, ' ');
        return { href, label };
    });

    return (
        <nav className={styles.breadcrumbs}>
            <Link href="/">Головна</Link>
            {crumbs.map((crumb, i) => (
                <span key={i}>
          {' / '}
                    <Link href={crumb.href}>{crumb.label}</Link>
        </span>
            ))}
        </nav>
    );
}
