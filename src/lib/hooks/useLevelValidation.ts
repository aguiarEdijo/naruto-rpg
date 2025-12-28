import { useState, useEffect } from 'react';
import { LevelProgressionService, LevelProgression } from '@/lib/api/levelProgression';
import { Character } from '@/types/game';

export interface LevelValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    levelInfo: LevelProgression | null;
    expectedRank: string;
    actualRank: string;
    rankMatches: boolean;
}

export const useLevelValidation = (character: Character | null) => {
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

    const validateCharacterLevel = (char: Character): LevelValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Buscar informações do nível atual
        const levelInfo = levelProgression.find(level => level.level === char.level);

        if (!levelInfo) {
            errors.push(`Nível ${char.level} não encontrado na tabela de progressão`);
            return {
                isValid: false,
                errors,
                warnings,
                levelInfo: null,
                expectedRank: '',
                actualRank: char.rank,
                rankMatches: false
            };
        }

        // Verificar se a patente corresponde ao nível
        const rankMatches = char.rank === levelInfo.rank;
        if (!rankMatches) {
            errors.push(`Patente "${char.rank}" não corresponde ao nível ${char.level}. Esperado: "${levelInfo.rank}"`);
        }

        // Calcular pontos esperados baseado na progressão
        const expectedAttributePoints = calculateExpectedAttributePoints(char.level);
        const expectedSkillPoints = calculateExpectedSkillPoints(char.level);

        // Verificar pontos de atributo
        const totalAttributePoints = Object.values(char.distributedAttributes).reduce((sum, points) => sum + points, 0);
        if (totalAttributePoints > expectedAttributePoints) {
            errors.push(`Pontos de atributo distribuídos (${totalAttributePoints}) excedem o máximo permitido para o nível ${char.level} (${expectedAttributePoints})`);
        } else if (totalAttributePoints < expectedAttributePoints) {
            warnings.push(`Você tem ${expectedAttributePoints - totalAttributePoints} pontos de atributo não distribuídos`);
        }

        // Verificar pontos de perícia
        const totalSkillPoints = Object.values(char.skills).reduce((sum, points) => sum + points, 0);
        if (totalSkillPoints > expectedSkillPoints) {
            errors.push(`Pontos de perícia distribuídos (${totalSkillPoints}) excedem o máximo permitido para o nível ${char.level} (${expectedSkillPoints})`);
        } else if (totalSkillPoints < expectedSkillPoints) {
            warnings.push(`Você tem ${expectedSkillPoints - totalSkillPoints} pontos de perícia não distribuídos`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            levelInfo,
            expectedRank: levelInfo.rank,
            actualRank: char.rank,
            rankMatches
        };
    };

    const calculateExpectedAttributePoints = (level: number): number => {
        // Pontos de atributo são ganhos a cada 2 níveis (1, 3, 5, 7, etc.)
        return Math.floor((level + 1) / 2);
    };

    const calculateExpectedSkillPoints = (level: number): number => {
        // Pontos de perícia são ganhos a cada nível + bônus especiais nos patamares
        let basePoints = level;

        // Bônus especiais nos patamares (níveis 5, 10, 15)
        if (level >= 5) basePoints += 2; // Chunnin
        if (level >= 10) basePoints += 2; // Jounin  
        if (level >= 15) basePoints += 2; // Hokage

        return basePoints;
    };

    const getLevelInfo = (level: number): LevelProgression | null => {
        return levelProgression.find(l => l.level === level) || null;
    };

    const getRankForLevel = (level: number): string => {
        const levelInfo = getLevelInfo(level);
        return levelInfo?.rank || 'Desconhecido';
    };

    const getAvailableLevels = (): number[] => {
        return levelProgression.map(level => level.level).sort((a, b) => a - b);
    };

    const getAvailableRanks = (): string[] => {
        return [...new Set(levelProgression.map(level => level.rank))];
    };

    return {
        levelProgression,
        loading,
        error,
        validateCharacterLevel,
        getLevelInfo,
        getRankForLevel,
        getAvailableLevels,
        getAvailableRanks,
        calculateExpectedAttributePoints,
        calculateExpectedSkillPoints
    };
};


