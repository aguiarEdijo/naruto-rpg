'use client';

import React, { useState } from 'react';
import { Container, Card, Button, Input } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { useResistanceDifficulties, useResistanceDifficultyMutations } from '@/hooks/queries/useGameRules';
import type { JutsuRank } from '@/types/gameRules';

const RANK_ORDER: JutsuRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

export default function ResistanceDifficultiesPage() {
    const { data: difficulties = [], isLoading } = useResistanceDifficulties();
    const { updateResistanceDifficulty } = useResistanceDifficultyMutations();

    const [editing, setEditing] = useState<Record<string, { execucao: number; rm_rf: number }>>({});
    const [submitting, setSubmitting] = useState(false);

    const handleEdit = (rank: JutsuRank, execucao: number, rmRf: number) => {
        setEditing(prev => ({ ...prev, [rank]: { execucao, rm_rf: rmRf } }));
    };

    const handleSave = async (rank: JutsuRank) => {
        const values = editing[rank];
        if (!values) return;

        try {
            setSubmitting(true);
            await updateResistanceDifficulty.mutateAsync({
                rank,
                execucao: values.execucao,
                rmRf: values.rm_rf
            });
            setEditing(prev => {
                const newEditing = { ...prev };
                delete newEditing[rank];
                return newEditing;
            });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar dificuldades. Verifique o console.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = (rank: JutsuRank) => {
        setEditing(prev => {
            const newEditing = { ...prev };
            delete newEditing[rank];
            return newEditing;
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <GMHeader title="Dificuldades de Resistência" backLink="/dashboard/gm/game-rules" />
                <Container className="py-8">
                    <Card>
                        <div className="text-center py-8">Carregando...</div>
                    </Card>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Dificuldades de Resistência"
                description="Configure as dificuldades de Execução e RM/RF por rank"
                backLink="/dashboard/gm/game-rules"
            />

            <Container className="py-8">
                <Card>
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Dificuldades por Rank</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Configure as dificuldades de Execução e RM/RF para cada rank de jutsu
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left p-3 font-semibold text-sm">Rank</th>
                                        <th className="text-left p-3 font-semibold text-sm">Execução</th>
                                        <th className="text-left p-3 font-semibold text-sm">RM/RF</th>
                                        <th className="text-right p-3 font-semibold text-sm">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RANK_ORDER.map((rank) => {
                                        const difficulty = difficulties.find(d => d.rank === rank);
                                        const isEditing = editing[rank] !== undefined;
                                        const currentExecucao = isEditing ? editing[rank].execucao : (difficulty?.execucao ?? 0);
                                        const currentRmRf = isEditing ? editing[rank].rm_rf : (difficulty?.rm_rf ?? 0);

                                        return (
                                            <tr key={rank} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg">
                                                        <span className="text-xl font-bold text-primary">{rank}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentExecucao}
                                                            onChange={(e) => handleEdit(rank, parseInt(e.target.value) || 0, currentRmRf)}
                                                            className="w-24 px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-semibold">{currentExecucao}</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentRmRf}
                                                            onChange={(e) => handleEdit(rank, currentExecucao, parseInt(e.target.value) || 0)}
                                                            className="w-24 px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-semibold">{currentRmRf}</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-right">
                                                    {isEditing ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() => handleSave(rank)}
                                                                disabled={submitting}
                                                            >
                                                                Salvar
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => handleCancel(rank)}
                                                                disabled={submitting}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => handleEdit(rank, currentExecucao, currentRmRf)}
                                                        >
                                                            Editar
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </Container>
        </div>
    );
}
