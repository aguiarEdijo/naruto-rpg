'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RankMultipliersPage() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/dashboard/gm/game-rules/ranks-config');
    }, [router]);

    return null;
}

