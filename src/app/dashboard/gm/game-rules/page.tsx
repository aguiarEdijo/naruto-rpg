'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Card, Grid, Flex } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';

const gameRulesSections = [
    {
        id: 'ranks-config',
        title: 'Configuração de Ranks',
        description: 'Multiplicadores e dificuldades por rank (E, D, C, B, A, S)',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )
    },
    {
        id: 'resource-rules',
        title: 'Regras de Recursos',
        description: 'Configurar fórmulas de cálculo de vida, chakra, RM e RF',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        )
    },
    {
        id: 'jutsu-categories',
        title: 'Categorias de Jutsus',
        description: 'Gerenciar categorias de jutsus e seus ranks',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        )
    },
    {
        id: 'jutsu-effects',
        title: 'Efeitos de Jutsus',
        description: 'Gerenciar efeitos disponíveis para criação de jutsus',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        )
    }
];

export default function GameRulesPage() {
    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Regras do Sistema"
                description="Gerenciar regras de cálculo e criação de jutsus"
                backLink="/dashboard/gm"
            />

            <Container className="py-8">
                <Grid cols={3} gap="lg">
                    {gameRulesSections.map((section) => (
                        <Link key={section.id} href={`/dashboard/gm/game-rules/${section.id}`}>
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

