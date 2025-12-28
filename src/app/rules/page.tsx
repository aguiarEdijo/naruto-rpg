'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Tabs, TabPanel, TabContainer } from '@/components/ui';
import {
    BasicsRules,
    AttributesRules,
    SkillsRules,
    CombatRules,
    EnhancementsRules,
    ClansRules,
    ItemsDisplay,
    DefectsDisplay
} from '@/components/rules';

export default function RulesPage() {
    const [activeTab, setActiveTab] = useState('basics');
    const [refreshKey, setRefreshKey] = useState(0);

    // Recarregar dados ao trocar de aba
    useEffect(() => {
        // Forçar re-render dos componentes filhos ao trocar de aba
        // Isso força os hooks dentro deles a recarregarem se necessário
        setRefreshKey(prev => prev + 1);
    }, [activeTab]);

    const tabs = [
        { id: 'basics', label: 'Básico', icon: '📚' },
        { id: 'attributes', label: 'Atributos', icon: '💪' },
        { id: 'skills', label: 'Perícias', icon: '🎯' },
        { id: 'combat', label: 'Combate', icon: '⚔️' },
        { id: 'enhancements', label: 'Aprimoramentos', icon: '✨' },
        { id: 'defects', label: 'Defeitos', icon: '⚠️' },
        { id: 'items', label: 'Itens', icon: '🎒' },
        { id: 'clans', label: 'Clãs', icon: '🏛️' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basics':
                return <BasicsRules />;
            case 'attributes':
                return <AttributesRules />;
            case 'skills':
                return <SkillsRules />;
            case 'combat':
                return <CombatRules />;
            case 'enhancements':
                return <EnhancementsRules />;
            case 'defects':
                return (
                    <div className="space-y-4">
                        <DefectsDisplay showDescriptions={true} />
                    </div>
                );
            case 'items':
                return (
                    <div className="space-y-4">
                        <h2 className="heading-3">Itens Utilitários</h2>
                        <ItemsDisplay />
                    </div>
                );
            case 'clans':
                return <ClansRules />;
            default:
                return <BasicsRules />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary shadow-lg border-b-4 border-primary/20">
                <Container>
                    <div className="flex items-center space-x-4 py-4">
                        <Link href="/" className="text-white hover:text-white/80 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <h1 className="heading-2 text-white">Regras do Sistema Naruto RPG</h1>
                    </div>
                </Container>
            </div>

            <Container className="py-6">
                <p className="text-body text-muted mb-8 text-center max-w-3xl mx-auto">
                    Sistema de RPG baseado no universo de Naruto, focado em simplicidade e narrativa
                </p>

                {/* Sistema de Abas */}
                <TabContainer className="mb-6">
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        variant="underline"
                    />
                    <TabPanel key={refreshKey}>
                        {renderTabContent()}
                    </TabPanel>
                </TabContainer>
            </Container>
        </div>
    );
}