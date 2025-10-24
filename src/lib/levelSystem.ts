// Sistema de Níveis e Evolução

export const LEVEL_SYSTEM = {
    maxLevel: 20,

    // Sistema de patamares
    attributeTierLevels: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], // Níveis que ganham pontos de atributo
    skillPointsPerLevel: 1,     // +1 ponto de perícia por nível
    skillTierBonus: 2,          // +2 pontos extras nos patamares de patente

    // Níveis mínimos para patentes
    rankRequirements: {
        Genin: 1,      // Sempre disponível
        Chunnin: 5,    // Requer nível 5
        Jounin: 10,    // Requer nível 10
        Hokage: 15,    // Requer nível 15
    },

    // Evolução de dados por nível
    diceEvolution: {
        1: { dice: [6, 6], description: '2d6' },           // Nível 1-4
        2: { dice: [6, 6], description: '2d6' },
        3: { dice: [6, 6], description: '2d6' },
        4: { dice: [6, 6], description: '2d6' },
        5: { dice: [8, 6], description: '1d8+1d6' },      // Nível 5-8
        6: { dice: [8, 6], description: '1d8+1d6' },
        7: { dice: [8, 6], description: '1d8+1d6' },
        8: { dice: [8, 6], description: '1d8+1d6' },
        9: { dice: [8, 8], description: '2d8' },          // Nível 9-12
        10: { dice: [8, 8], description: '2d8' },
        11: { dice: [8, 8], description: '2d8' },
        12: { dice: [8, 8], description: '2d8' },
        13: { dice: [10, 8], description: '1d10+1d8' },   // Nível 13-16
        14: { dice: [10, 8], description: '1d10+1d8' },
        15: { dice: [10, 8], description: '1d10+1d8' },
        16: { dice: [10, 8], description: '1d10+1d8' },
        17: { dice: [10, 10], description: '2d10' }, // Nível 17-20
        18: { dice: [10, 10], description: '2d10' },
        19: { dice: [10, 10], description: '2d10' },
        20: { dice: [10, 10], description: '2d10' },
    },

    // Dificuldades por nível
    difficultyByLevel: {
        1: { easy: 6, medium: 8, hard: 10, extreme: 12 },    // Nível 1-4
        2: { easy: 6, medium: 8, hard: 10, extreme: 12 },
        3: { easy: 6, medium: 8, hard: 10, extreme: 12 },
        4: { easy: 6, medium: 8, hard: 10, extreme: 12 },
        5: { easy: 7, medium: 9, hard: 11, extreme: 13 },    // Nível 5-8
        6: { easy: 7, medium: 9, hard: 11, extreme: 13 },
        7: { easy: 7, medium: 9, hard: 11, extreme: 13 },
        8: { easy: 7, medium: 9, hard: 11, extreme: 13 },
        9: { easy: 8, medium: 10, hard: 12, extreme: 14 },   // Nível 9-12
        10: { easy: 8, medium: 10, hard: 12, extreme: 14 },
        11: { easy: 8, medium: 10, hard: 12, extreme: 14 },
        12: { easy: 8, medium: 10, hard: 12, extreme: 14 },
        13: { easy: 9, medium: 11, hard: 13, extreme: 15 }, // Nível 13-16
        14: { easy: 9, medium: 11, hard: 13, extreme: 15 },
        15: { easy: 9, medium: 11, hard: 13, extreme: 15 },
        16: { easy: 9, medium: 11, hard: 13, extreme: 15 },
        17: { easy: 10, medium: 12, hard: 14, extreme: 16 }, // Nível 17-20
        18: { easy: 10, medium: 12, hard: 14, extreme: 16 },
        19: { easy: 10, medium: 12, hard: 14, extreme: 16 },
        20: { easy: 10, medium: 12, hard: 14, extreme: 16 },
    },
};

// Funções utilitárias para o sistema de níveis
export function getDiceForLevel(level: number) {
    return LEVEL_SYSTEM.diceEvolution[level as keyof typeof LEVEL_SYSTEM.diceEvolution] || LEVEL_SYSTEM.diceEvolution[1];
}

export function getDifficultyForLevel(level: number) {
    return LEVEL_SYSTEM.difficultyByLevel[level as keyof typeof LEVEL_SYSTEM.difficultyByLevel] || LEVEL_SYSTEM.difficultyByLevel[1];
}

export function canAchieveRank(level: number, rank: string): boolean {
    const requirement = LEVEL_SYSTEM.rankRequirements[rank as keyof typeof LEVEL_SYSTEM.rankRequirements];
    return level >= requirement;
}

export function getAvailableRanks(level: number): string[] {
    return Object.entries(LEVEL_SYSTEM.rankRequirements)
        .filter(([_, requirement]) => level >= requirement)
        .map(([rank, _]) => rank);
}

export function calculateLevelUpPoints(currentLevel: number): { attributePoints: number, skillPoints: number } {
    const nextLevel = currentLevel + 1;
    const isAttributeTier = LEVEL_SYSTEM.attributeTierLevels.includes(nextLevel);
    const isRankTier = nextLevel === LEVEL_SYSTEM.rankRequirements.Chunnin ||
        nextLevel === LEVEL_SYSTEM.rankRequirements.Jounin ||
        nextLevel === LEVEL_SYSTEM.rankRequirements.Hokage;

    return {
        attributePoints: isAttributeTier ? 1 : 0,
        skillPoints: LEVEL_SYSTEM.skillPointsPerLevel + (isRankTier ? LEVEL_SYSTEM.skillTierBonus : 0),
    };
}

export function getAttributeTierForLevel(level: number): number {
    return LEVEL_SYSTEM.attributeTierLevels.filter(tier => tier <= level).length;
}

export function getSkillTierForLevel(level: number): number {
    const rankTiers = Object.values(LEVEL_SYSTEM.rankRequirements).filter(req => req <= level).length;
    return level + (rankTiers * LEVEL_SYSTEM.skillTierBonus);
}

// Sistema de balanceamento para combate em grupo
export const GROUP_COMBAT_BALANCE = {
    // Multiplicadores de dificuldade baseados no número de oponentes
    groupSizeMultipliers: {
        1: 1.0,    // 1 vs 1 = normal
        2: 1.2,    // 2 vs 1 = +20% dificuldade
        3: 1.4,    // 3 vs 1 = +40% dificuldade
        4: 1.6,    // 4 vs 1 = +60% dificuldade
        5: 1.8,    // 5 vs 1 = +80% dificuldade
        6: 2.0,    // 6+ vs 1 = +100% dificuldade
    },

    // Diferença de nível que ainda permite vitória em grupo
    levelDifferenceThreshold: 3, // Grupo pode vencer até 3 níveis acima

    // Exemplo: 3 Genins (nível 1) podem vencer 1 Chunnin (nível 5) com dificuldade aumentada
    calculateGroupDifficulty(baseDifficulty: number, groupSize: number, levelDifference: number): number {
        const sizeMultiplier = GROUP_COMBAT_BALANCE.groupSizeMultipliers[Math.min(groupSize, 6) as keyof typeof GROUP_COMBAT_BALANCE.groupSizeMultipliers];
        const levelPenalty = Math.max(0, levelDifference - GROUP_COMBAT_BALANCE.levelDifferenceThreshold) * 2;

        return Math.round(baseDifficulty * sizeMultiplier + levelPenalty);
    },
};
