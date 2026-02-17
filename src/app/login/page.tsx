'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    useEffect(() => {
        router.push('/trade/login');
    }, [router]);
    return null;
}
