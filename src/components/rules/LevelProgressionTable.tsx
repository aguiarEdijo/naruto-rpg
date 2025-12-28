import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { LevelProgressionService, LevelProgression } from '@/lib/api/levelProgression';

interface LevelProgressionTableProps {
    className?: string;
}

export const LevelProgressionTable: React.FC<LevelProgressionTableProps> = ({ className = '' }) => {
    const [levelProgression, setLevelProgression] = useState<LevelProgression[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRank, setSelectedRank] = useState<string | null>(null);

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

    const getRankColor = (rank: string) => {
        switch (rank) {
            case 'Genin':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'Chunnin':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'Jounin':
                return 'bg-purple-50 border-purple-200 text-purple-800';
            case 'Hokage':
                return 'bg-orange-50 border-orange-200 text-orange-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getRankBorderColor = (rank: string) => {
        switch (rank) {
            case 'Genin':
                return 'border-l-green-500';
            case 'Chunnin':
                return 'border-l-blue-500';
            case 'Jounin':
                return 'border-l-purple-500';
            case 'Hokage':
                return 'border-l-orange-500';
            default:
                return 'border-l-gray-500';
        }
    };

    const filteredLevels = selectedRank
        ? levelProgression.filter(level => level.rank === selectedRank)
        : levelProgression;

    const uniqueRanks = [...new Set(levelProgression.map(level => level.rank))];

    if (loading) {
        return (
            <Card className={`p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={`p-6 bg-red-50 border-red-200 ${className}`}>
                <div className="text-red-700">
                    <h3 className="heading-4 mb-2">Erro ao carregar dados</h3>
                    <p className="text-small mb-3">{error}</p>
                    <button
                        onClick={loadLevelProgression}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-small"
                    >
                        Tentar novamente
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <Card className={`p-6 ${className}`}>
            <div className="mb-6">
                <h2 className="heading-3 mb-4">Tabela de Progressão por Nível</h2>

                {/* Filtros por Patente */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={() => setSelectedRank(null)}
                        className={`px-3 py-1 rounded-full text-small font-medium transition-colors ${selectedRank === null
                            ? 'bg-primary text-white !text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Todas as Patentes
                    </button>
                    {uniqueRanks.map(rank => (
                        <button
                            key={rank}
                            onClick={() => setSelectedRank(rank)}
                            className={`px-3 py-1 rounded-full text-small font-medium transition-colors ${selectedRank === rank
                                ? getRankColor(rank)
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {rank}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabela Responsiva */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-default">
                            <th className="text-left py-3 px-2 text-small font-semibold text-muted">Nível</th>
                            <th className="text-left py-3 px-2 text-small font-semibold text-muted">Patente</th>
                            <th className="text-left py-3 px-2 text-small font-semibold text-muted">Dados</th>
                            <th className="text-left py-3 px-2 text-small font-semibold text-muted">Atributos</th>
                            <th className="text-left py-3 px-2 text-small font-semibold text-muted">Perícias</th>
                            <th className="text-left py-3 px-2 text-small font-semibold text-muted">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLevels.map((level) => (
                            <tr
                                key={level.level}
                                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${getRankBorderColor(level.rank)} border-l-4`}
                            >
                                <td className="py-3 px-2">
                                    <div className="flex items-center">
                                        <span className="text-body font-medium">{level.level}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRankColor(level.rank)}`}>
                                        {level.rank}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className="text-body font-mono text-small">{level.dice_evolution}</span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className={`text-small font-medium ${level.attribute_points === '—'
                                        ? 'text-gray-500'
                                        : 'text-green-700'
                                        }`}>
                                        {level.attribute_points}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className="text-small font-medium text-blue-700">
                                        {level.skill_points}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className="text-small font-semibold text-primary">
                                        {level.total_skill_gain}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Resumo Estatístico */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="heading-4 mb-3">Resumo por Patente</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uniqueRanks.map(rank => {
                        const rankLevels = levelProgression.filter(level => level.rank === rank);
                        const minLevel = Math.min(...rankLevels.map(l => l.level));
                        const maxLevel = Math.max(...rankLevels.map(l => l.level));
                        const totalSkillPoints = rankLevels.reduce((sum, level) => sum + level.total_skill_gain, 0);

                        return (
                            <div key={rank} className={`p-3 rounded-lg border ${getRankColor(rank)}`}>
                                <div className="text-small font-semibold mb-1">{rank}</div>
                                <div className="text-xs text-muted">
                                    Níveis {minLevel}-{maxLevel}
                                </div>
                                <div className="text-xs text-muted">
                                    {rankLevels.length} níveis
                                </div>
                                <div className="text-xs font-medium mt-1">
                                    {totalSkillPoints} pts perícia
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};
