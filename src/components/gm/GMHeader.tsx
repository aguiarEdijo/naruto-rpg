import React from 'react';
import Link from 'next/link';
import { Container, Flex, Button } from '@/components/ui';

interface GMHeaderProps {
    title: string;
    description?: string;
    count?: number;
    countLabel?: string; // e.g., "clã", "item"
    onAction?: () => void;
    actionLabel?: string; // e.g., "+ Novo Clã"
    backLink?: string;
}

export function GMHeader({
    title,
    description,
    count,
    countLabel,
    onAction,
    actionLabel,
    backLink = "/dashboard/gm"
}: GMHeaderProps) {
    return (
        <div className="bg-primary shadow-lg border-b-4 border-primary/20">
            <Container>
                <Flex justify="between" align="center" className="py-4">
                    <Flex align="center" gap="md">
                        <Link href={backLink} className="text-white hover:text-white/80 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white font-heading">{title}</h1>
                            <p className="text-sm text-white/80 mt-1">
                                {description}
                                {count !== undefined && countLabel && (
                                    <>
                                        {!description && <br />}
                                        {count} {countLabel}{count !== 1 ? 's' : ''} cadastrado{count !== 1 ? 's' : ''}
                                    </>
                                )}
                            </p>
                        </div>
                    </Flex>
                    {onAction && actionLabel && (
                        <Button
                            variant="accent"
                            onClick={onAction}
                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                        >
                            {actionLabel}
                        </Button>
                    )}
                    {!onAction && (
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                            <p className="text-sm text-white font-medium">🔐 Modo Administrador</p>
                        </div>
                    )}
                </Flex>
            </Container>
        </div>
    );
}
