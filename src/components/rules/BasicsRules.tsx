import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { LevelProgressionService, LevelProgression } from '@/lib/api/levelProgression';
import { LevelProgressionTable } from './LevelProgressionTable';
import { AgeRangesDisplay } from './AgeRangesDisplay';

export const BasicsRules: React.FC = () => {
    const [levelProgression, setLevelProgression] = useState<LevelProgression[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadLevelProgression();
    }, []);

    const loadLevelProgression = async () => {
        try {
            setLoading(true);
            const levels = await LevelProgressionService.getAllLevels();
            setLevelProgression(levels);
        } catch (err) {
            console.error('Erro ao carregar progressão de níveis:', err);
            setError('Erro ao carregar dados de progressão');
        } finally {
            setLoading(false);
        }
    };

    const getDiceEvolutionGroups = () => {
        const groups: Record<string, { minLevel: number; maxLevel: number; dice: string }> = {};

        levelProgression.forEach(level => {
            if (!groups[level.dice_evolution]) {
                groups[level.dice_evolution] = {
                    minLevel: level.level,
                    maxLevel: level.level,
                    dice: level.dice_evolution
                };
            } else {
                groups[level.dice_evolution].minLevel = Math.min(groups[level.dice_evolution].minLevel, level.level);
                groups[level.dice_evolution].maxLevel = Math.max(groups[level.dice_evolution].maxLevel, level.level);
            }
        });

        return Object.values(groups).sort((a, b) => a.minLevel - b.minLevel);
    };

    const getRankRequirements = () => {
        const ranks: Record<string, number> = {};

        levelProgression.forEach(level => {
            if (!ranks[level.rank]) {
                ranks[level.rank] = level.level;
            } else {
                ranks[level.rank] = Math.min(ranks[level.rank], level.level);
            }
        });

        return Object.entries(ranks).sort((a, b) => a[1] - b[1]);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Card className="p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <Card className="p-6 bg-red-50 border-red-200">
                    <div className="text-red-700">
                        <h3 className="heading-4 mb-2">Erro ao carregar dados</h3>
                        <p className="text-small">{error}</p>
                        <button
                            onClick={loadLevelProgression}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Tentar novamente
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tabela de Progressão */}
            <LevelProgressionTable />

            {/* Sistema de Faixas Etárias */}
            <AgeRangesDisplay />

            {/* Personagens Sem Clã */}
            <Card className="p-6">
                <h2 className="heading-3 mb-4">Personagens Sem Clã</h2>
                <div className="space-y-4">
                    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                        <h3 className="font-medium text-orange-800 mb-2">Sem Clã</h3>
                        <p className="text-small text-orange-700 mb-2">
                            Personagem sem linhagem ninja conhecida - maior flexibilidade na criação
                        </p>
                        <div className="text-small text-orange-800">
                            <strong>Bônus:</strong> +2 pontos de atributo livres e +2 pontos de perícia extras
                        </div>
                    </div>
                    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                        <h3 className="font-medium text-purple-800 mb-2">Mutação</h3>
                        <p className="text-small text-purple-700 mb-2">
                            Personagem com características únicas, experimentos ou origem misteriosa
                        </p>
                        <div className="text-small text-purple-800">
                            <strong>Bônus:</strong> +3 pontos de atributo livres e +2 pontos de perícia extras
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
