'use client';

import React, { useState } from 'react';
import { Container, Card, Button, Input, Textarea } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { useResourceCalculationRules, useResourceCalculationRuleMutations } from '@/hooks/queries/useGameRules';
import type { ResourceCalculationRule, CharacterRank } from '@/types/gameRules';

const RANK_ORDER: CharacterRank[] = ['Genin', 'Chunnin', 'Jounin', 'Hokage'];

export default function ResourceRulesPage() {
    const { data: rules = [], isLoading } = useResourceCalculationRules();
    const { updateResourceRule } = useResourceCalculationRuleMutations();

    const [editingRule, setEditingRule] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleEdit = (ruleType: string) => {
        setEditingRule(ruleType);
    };

    const handleCancel = () => {
        setEditingRule(null);
    };

    const handleSave = async (ruleType: string, rankMultipliers: Record<CharacterRank, number>) => {
        try {
            setSubmitting(true);
            const rule = rules.find(r => r.rule_type === ruleType);
            if (!rule) return;

            await updateResourceRule.mutateAsync({
                ruleType: ruleType as any,
                updates: {
                    rank_multipliers: rankMultipliers
                }
            });
            setEditingRule(null);
        } catch (error) {
            console.error('Erro ao salvar regra:', error);
            alert('Erro ao salvar regra. Verifique o console.');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <GMHeader title="Regras de Recursos" backLink="/dashboard/gm/game-rules" />
                <Container className="py-8">
                    <Card>
                        <div className="text-center py-8">Carregando...</div>
                    </Card>
                </Container>
            </div>
        );
    }

    const getRuleData = (ruleType: string) => {
        return rules.find(r => r.rule_type === ruleType);
    };

    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Regras de Recursos"
                description="Configure fórmulas de cálculo de vida, chakra, RM e RF"
                backLink="/dashboard/gm/game-rules"
            />

            <Container className="py-8">
                <div className="space-y-6">
                    {/* Vida */}
                    {getRuleData('health') && (
                        <ResourceRuleCard
                            rule={getRuleData('health')!}
                            title="Vida"
                            description="Cálculo: vigor * multiplier + strength"
                            isEditing={editingRule === 'health'}
                            onEdit={() => handleEdit('health')}
                            onCancel={handleCancel}
                            onSave={handleSave}
                            submitting={submitting}
                        />
                    )}

                    {/* Chakra */}
                    {getRuleData('chakra') && (
                        <ResourceRuleCard
                            rule={getRuleData('chakra')!}
                            title="Chakra"
                            description="Cálculo: essence * multiplier + intelligence"
                            isEditing={editingRule === 'chakra'}
                            onEdit={() => handleEdit('chakra')}
                            onCancel={handleCancel}
                            onSave={handleSave}
                            submitting={submitting}
                        />
                    )}

                    {/* Resistência Mental */}
                    {getRuleData('mental_resistance') && (
                        <ResourceRuleCard
                            rule={getRuleData('mental_resistance')!}
                            title="Resistência Mental (RM)"
                            description="Cálculo: (intelligence + essence + perception) / 3"
                            isEditing={editingRule === 'mental_resistance'}
                            onEdit={() => handleEdit('mental_resistance')}
                            onCancel={handleCancel}
                            onSave={handleSave}
                            submitting={submitting}
                            showMultipliers={false}
                        />
                    )}

                    {/* Resistência Física */}
                    {getRuleData('physical_resistance') && (
                        <ResourceRuleCard
                            rule={getRuleData('physical_resistance')!}
                            title="Resistência Física (RF)"
                            description="Cálculo: (strength + agility + vigor) / 3"
                            isEditing={editingRule === 'physical_resistance'}
                            onEdit={() => handleEdit('physical_resistance')}
                            onCancel={handleCancel}
                            onSave={handleSave}
                            submitting={submitting}
                            showMultipliers={false}
                        />
                    )}
                </div>
            </Container>
        </div>
    );
}

interface ResourceRuleCardProps {
    rule: ResourceCalculationRule;
    title: string;
    description: string;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: (ruleType: string, multipliers: Record<CharacterRank, number>) => void;
    submitting: boolean;
    showMultipliers?: boolean;
}

function ResourceRuleCard({
    rule,
    title,
    description,
    isEditing,
    onEdit,
    onCancel,
    onSave,
    submitting,
    showMultipliers = true
}: ResourceRuleCardProps) {
    const [multipliers, setMultipliers] = useState<Record<CharacterRank, number>>(
        rule.rank_multipliers || { Genin: 5, Chunnin: 6, Jounin: 7, Hokage: 8 }
    );

    const handleMultiplierChange = (rank: CharacterRank, value: number) => {
        setMultipliers(prev => ({ ...prev, [rank]: value }));
    };

    const handleSaveClick = () => {
        onSave(rule.rule_type, multipliers);
    };

    return (
        <Card>
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                    </div>
                    {!isEditing && (
                        <Button variant="secondary" size="sm" onClick={onEdit}>
                            Editar
                        </Button>
                    )}
                </div>

                {showMultipliers && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Multiplicadores por Rank</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {RANK_ORDER.map((rank) => (
                                <div key={rank} className="space-y-2">
                                    <label className="text-xs text-gray-600 block">{rank}</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={multipliers[rank] || 0}
                                            onChange={(e) => handleMultiplierChange(rank, parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                            min="0"
                                        />
                                    ) : (
                                        <div className="px-3 py-2 bg-gray-50 border rounded-md text-lg font-bold text-gray-900">
                                            {multipliers[rank] || 0}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!showMultipliers && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        Esta regra não utiliza multiplicadores por rank. O cálculo é baseado apenas na soma/divisão dos atributos.
                    </div>
                )}

                {isEditing && (
                    <div className="flex items-center justify-end gap-2 pt-3 border-t">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSaveClick}
                            disabled={submitting}
                        >
                            Salvar
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}
