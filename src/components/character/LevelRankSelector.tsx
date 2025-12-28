import React from 'react';
import { Select } from '@/components/ui';
import { LevelProgression } from '@/lib/api/levelProgression';

interface LevelRankSelectorProps {
    level: number;
    rank: string;
    onLevelChange: (level: number) => void;
    onRankChange: (rank: string) => void;
    levelProgression: LevelProgression[];
    className?: string;
}

export const LevelRankSelector: React.FC<LevelRankSelectorProps> = ({
    level,
    rank,
    onLevelChange,
    onRankChange,
    levelProgression,
    className = ''
}) => {
    // Opções de nível
    const levelOptions = levelProgression.map(levelInfo => ({
        value: levelInfo.level.toString(),
        label: `Nível ${levelInfo.level} - ${levelInfo.rank}`
    }));

    // Opções de patente (baseadas no nível selecionado)
    const currentLevelInfo = levelProgression.find(l => l.level === level);
    const rankOptions = levelProgression
        .filter(l => l.level === level)
        .map(levelInfo => ({
            value: levelInfo.rank,
            label: levelInfo.rank
        }));

    // Se não há opções de patente para o nível atual, usar todas as patentes disponíveis
    const allRankOptions = [...new Set(levelProgression.map(l => l.rank))]
        .map(rank => ({
            value: rank,
            label: rank
        }));

    const finalRankOptions = rankOptions.length > 0 ? rankOptions : allRankOptions;

    const handleLevelChange = (value: string) => {
        const newLevel = parseInt(value);
        onLevelChange(newLevel);

        // Atualizar patente automaticamente baseada no nível
        const levelInfo = levelProgression.find(l => l.level === newLevel);
        if (levelInfo) {
            onRankChange(levelInfo.rank);
        }
    };

    const handleRankChange = (value: string) => {
        onRankChange(value);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div>
                <Select
                    label="Nível"
                    value={level.toString()}
                    onChange={(e) => handleLevelChange(e.target.value)}
                    options={levelOptions}
                />
            </div>

            <div>
                <Select
                    label="Patente"
                    value={rank}
                    onChange={(e) => handleRankChange(e.target.value)}
                    options={finalRankOptions}
                />
            </div>

            {/* Informações do nível selecionado */}
            {currentLevelInfo && (
                <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-small font-semibold mb-2">Informações do Nível {level}:</h4>
                    <div className="grid grid-cols-2 gap-2 text-small">
                        <div>
                            <span className="text-muted">Dados:</span>
                            <span className="ml-1 font-mono">{currentLevelInfo.dice_evolution}</span>
                        </div>
                        <div>
                            <span className="text-muted">Atributos:</span>
                            <span className="ml-1">{currentLevelInfo.attribute_points}</span>
                        </div>
                        <div>
                            <span className="text-muted">Perícias:</span>
                            <span className="ml-1">{currentLevelInfo.skill_points}</span>
                        </div>
                        <div>
                            <span className="text-muted">Total:</span>
                            <span className="ml-1 font-semibold">{currentLevelInfo.total_skill_gain}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


