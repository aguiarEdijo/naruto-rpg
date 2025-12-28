'use client';

import React, { useState } from 'react';
import { Container, Card, Button, Input } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { 
    useRankMultipliers, 
    useRankMultiplierMutations,
    useResistanceDifficulties,
    useResistanceDifficultyMutations
} from '@/hooks/queries/useGameRules';
import type { JutsuRank } from '@/types/gameRules';

const RANK_ORDER: JutsuRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

export default function RanksConfigPage() {
    const { data: rankMultipliers = [], isLoading: loadingMultipliers } = useRankMultipliers();
    const { data: difficulties = [], isLoading: loadingDifficulties } = useResistanceDifficulties();
    const { updateRankMultiplier } = useRankMultiplierMutations();
    const { updateResistanceDifficulty } = useResistanceDifficultyMutations();

    const [editingMultiplier, setEditingMultiplier] = useState<Record<string, number>>({});
    const [editingDifficulty, setEditingDifficulty] = useState<Record<string, { execucao: number; rm_rf: number }>>({});
    const [submitting, setSubmitting] = useState(false);

    const isLoading = loadingMultipliers || loadingDifficulties;

    const handleEditMultiplier = (rank: JutsuRank, multiplier: number) => {
        setEditingMultiplier(prev => ({ ...prev, [rank]: multiplier }));
    };

    const handleEditDifficulty = (rank: JutsuRank, execucao: number, rmRf: number) => {
        setEditingDifficulty(prev => ({ ...prev, [rank]: { execucao, rm_rf: rmRf } }));
    };

    const handleSaveMultiplier = async (rank: JutsuRank) => {
        const multiplier = editingMultiplier[rank];
        if (multiplier === undefined) return;

        try {
            setSubmitting(true);
            await updateRankMultiplier.mutateAsync({ rank, multiplier });
            setEditingMultiplier(prev => {
                const newEditing = { ...prev };
                delete newEditing[rank];
                return newEditing;
            });
        } catch (error) {
            console.error('Erro ao salvar multiplicador:', error);
            alert('Erro ao salvar multiplicador. Verifique o console.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveDifficulty = async (rank: JutsuRank) => {
        const values = editingDifficulty[rank];
        if (!values) return;

        try {
            setSubmitting(true);
            await updateResistanceDifficulty.mutateAsync({
                rank,
                execucao: values.execucao,
                rmRf: values.rm_rf
            });
            setEditingDifficulty(prev => {
                const newEditing = { ...prev };
                delete newEditing[rank];
                return newEditing;
            });
        } catch (error) {
            console.error('Erro ao salvar dificuldade:', error);
            alert('Erro ao salvar dificuldade. Verifique o console.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelMultiplier = (rank: JutsuRank) => {
        setEditingMultiplier(prev => {
            const newEditing = { ...prev };
            delete newEditing[rank];
            return newEditing;
        });
    };

    const handleCancelDifficulty = (rank: JutsuRank) => {
        setEditingDifficulty(prev => {
            const newEditing = { ...prev };
            delete newEditing[rank];
            return newEditing;
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <GMHeader title="Configuração de Ranks" backLink="/dashboard/gm/game-rules" />
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
                title="Configuração de Ranks"
                description="Configure multiplicadores e dificuldades por rank de jutsu"
                backLink="/dashboard/gm/game-rules"
            />

            <Container className="py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Multiplicadores de Rank */}
                    <Card>
                        <div className="space-y-4">
                            <div className="border-b pb-3 mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Multiplicadores por Rank</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Multiplicadores utilizados para cada rank de jutsu
                                </p>
                            </div>

                            <div className="space-y-2">
                                {RANK_ORDER.map((rank) => {
                                    const rankData = rankMultipliers.find(rm => rm.rank === rank);
                                    const isEditing = editingMultiplier[rank] !== undefined;
                                    const currentValue = isEditing ? editingMultiplier[rank] : (rankData?.multiplier ?? 0);

                                    return (
                                        <div
                                            key={rank}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg flex-shrink-0">
                                                    <span className="text-lg font-bold text-primary">{rank}</span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">Rank {rank}</div>
                                                    <div className="text-xs text-gray-500">Multiplicador</div>
                                                </div>
                                            </div>

                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={currentValue}
                                                        onChange={(e) => handleEditMultiplier(rank, parseInt(e.target.value) || 0)}
                                                        className="w-20 px-2 py-1.5 text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                        min="0"
                                                    />
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleSaveMultiplier(rank)}
                                                        disabled={submitting}
                                                    >
                                                        Salvar
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleCancelMultiplier(rank)}
                                                        disabled={submitting}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="text-xl font-bold text-gray-900 w-12 text-center">{currentValue}</div>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleEditMultiplier(rank, currentValue)}
                                                    >
                                                        Editar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>

                    {/* Dificuldades de Resistência */}
                    <Card>
                        <div className="space-y-4">
                            <div className="border-b pb-3 mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Dificuldades de Resistência</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Dificuldades de Execução e RM/RF por rank
                                </p>
                            </div>

                            <div className="space-y-2">
                                {RANK_ORDER.map((rank) => {
                                    const difficulty = difficulties.find(d => d.rank === rank);
                                    const isEditing = editingDifficulty[rank] !== undefined;
                                    const currentExecucao = isEditing ? editingDifficulty[rank].execucao : (difficulty?.execucao ?? 0);
                                    const currentRmRf = isEditing ? editingDifficulty[rank].rm_rf : (difficulty?.rm_rf ?? 0);

                                    return (
                                        <div
                                            key={rank}
                                            className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg flex-shrink-0">
                                                        <span className="text-lg font-bold text-primary">{rank}</span>
                                                    </div>
                                                    <div className="font-semibold text-gray-900 text-sm">Rank {rank}</div>
                                                </div>
                                                {!isEditing && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleEditDifficulty(rank, currentExecucao, currentRmRf)}
                                                    >
                                                        Editar
                                                    </Button>
                                                )}
                                            </div>

                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="text-xs text-gray-600 mb-1 block">Execução</label>
                                                            <input
                                                                type="number"
                                                                value={currentExecucao}
                                                                onChange={(e) => handleEditDifficulty(rank, parseInt(e.target.value) || 0, currentRmRf)}
                                                                className="w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                                min="0"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-600 mb-1 block">RM/RF</label>
                                                            <input
                                                                type="number"
                                                                value={currentRmRf}
                                                                onChange={(e) => handleEditDifficulty(rank, currentExecucao, parseInt(e.target.value) || 0)}
                                                                className="w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                                min="0"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleSaveDifficulty(rank)}
                                                            disabled={submitting}
                                                            className="flex-1"
                                                        >
                                                            Salvar
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => handleCancelDifficulty(rank)}
                                                            disabled={submitting}
                                                            className="flex-1"
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1">Execução</div>
                                                        <div className="text-lg font-bold text-gray-900">{currentExecucao}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1">RM/RF</div>
                                                        <div className="text-lg font-bold text-gray-900">{currentRmRf}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Visão Consolidada em Tabela */}
                <Card className="mt-6">
                    <div className="space-y-4">
                        <div className="border-b pb-3 mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Visão Consolidada</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Tabela completa com todas as informações por rank
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left p-3 font-semibold text-sm">Rank</th>
                                        <th className="text-center p-3 font-semibold text-sm">Multiplicador</th>
                                        <th className="text-center p-3 font-semibold text-sm">Execução</th>
                                        <th className="text-center p-3 font-semibold text-sm">RM/RF</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RANK_ORDER.map((rank) => {
                                        const rankData = rankMultipliers.find(rm => rm.rank === rank);
                                        const difficulty = difficulties.find(d => d.rank === rank);
                                        
                                        return (
                                            <tr key={rank} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg">
                                                            <span className="text-lg font-bold text-primary">{rank}</span>
                                                        </div>
                                                        <span className="font-semibold text-gray-900">Rank {rank}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {rankData?.multiplier ?? 0}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {difficulty?.execucao ?? 0}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {difficulty?.rm_rf ?? 0}
                                                    </span>
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

