'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Card, Grid, Flex } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';

const managementSections = [
    {
        id: 'clans',
        title: 'Clãs',
        description: 'Gerenciar clãs disponíveis, modificadores e habilidades especiais',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        )
    },
    {
        id: 'items',
        title: 'Itens',
        description: 'Gerenciar itens utilitários, armas e equipamentos',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        )
    },
    {
        id: 'enhancements',
        title: 'Aprimoramentos',
        description: 'Gerenciar aprimoramentos e qualidades disponíveis',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        )
    },
    {
        id: 'defects',
        title: 'Defeitos',
        description: 'Gerenciar defeitos e penalidades disponíveis',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    },
    {
        id: 'skills',
        title: 'Perícias',
        description: 'Gerenciar perícias disponíveis e seus atributos base',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )
    },
    {
        id: 'level-progression',
        title: 'Progressão de Níveis',
        description: 'Gerenciar tabela de progressão de níveis e pontos',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        )
    },
    {
        id: 'jutsus',
        title: 'Jutsus',
        description: 'Gerenciar técnicas ninja disponíveis no sistema',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        )
    },
    {
        id: 'game-rules',
        title: 'Regras do Sistema',
        description: 'Gerenciar regras de cálculo e criação de jutsus',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        )
    }
];

export default function GMPage() {
    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Painel de Game Master"
                backLink="/dashboard/characters"
            />

            <Container className="py-8">
                <Grid cols={3} gap="lg">
                    {managementSections.map((section) => (
                        <Link key={section.id} href={`/dashboard/gm/${section.id}`}>
                            <Card
                                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 hover:scale-105 group h-full"
                                padding="lg"
                            >
                                <Flex direction="col" gap="md" align="start" className="h-full">
                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <div className="text-primary">
                                            {section.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                            {section.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {section.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-primary mt-auto pt-4">
                                        <span>Gerenciar</span>
                                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Flex>
                            </Card>
                        </Link>
                    ))}
                </Grid>
            </Container>
        </div>
    );
}

