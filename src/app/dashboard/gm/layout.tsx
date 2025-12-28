'use client';

import React from 'react';
import { GMProtectedRoute } from '@/components/auth/GMProtectedRoute';

interface GMLayoutProps {
    children: React.ReactNode;
}

export default function GMLayout({ children }: GMLayoutProps) {
    return (
        <GMProtectedRoute>
            {children}
        </GMProtectedRoute>
    );
}

