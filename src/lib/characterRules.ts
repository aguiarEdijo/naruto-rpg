// Regras do Sistema de Personagem

import { Character, Defect, Enhancement } from '@/types/game';

// Constantes do sistema
export const CHARACTER_RULES = {
    MAX_DEFECTS: 2,
    INITIAL_EMOTIONS: 8,
    MIN_EMOTIONS: 0,
    MAX_EMOTIONS: 10,
    ENHANCEMENTS_PER_DEFECT: 1
} as const;

// Função para validar regras de criação de personagem
export const validateCharacterRules = (character: Character): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
} => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar número máximo de defeitos
    if (character.defects && character.defects.length > CHARACTER_RULES.MAX_DEFECTS) {
        errors.push(`Personagem pode ter no máximo ${CHARACTER_RULES.MAX_DEFECTS} defeitos`);
    }

    // Validar range de emoções
    if (character.emotions < CHARACTER_RULES.MIN_EMOTIONS || character.emotions > CHARACTER_RULES.MAX_EMOTIONS) {
        errors.push(`Emoções devem estar entre ${CHARACTER_RULES.MIN_EMOTIONS} e ${CHARACTER_RULES.MAX_EMOTIONS}`);
    }

    // Validar aprimoramentos baseados em defeitos
    const expectedEnhancements = calculateExpectedEnhancements(character);
    if (character.enhancements && character.enhancements.length > expectedEnhancements) {
        errors.push(`Personagem tem mais aprimoramentos do que permitido (${expectedEnhancements} máximo)`);
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

// Função para calcular aprimoramentos esperados baseado em defeitos
export const calculateExpectedEnhancements = (character: Character): number => {
    const defectCount = character.defects ? character.defects.length : 0;
    return defectCount * CHARACTER_RULES.ENHANCEMENTS_PER_DEFECT;
};

// Função para calcular emoções iniciais baseado em defeitos
export const calculateInitialEmotions = (defects: Defect[]): number => {
    let emotionReduction = 0;

    defects.forEach(defect => {
        // Aplicar reduções específicas de emoções baseadas no defeito
        switch (defect.id) {
            case 'cegueira':
            case 'surdez':
            case 'habitos_detestaveis':
            case 'medroso':
            case 'furia':
            case 'orgulho_exacerbado':
            case 'paranoia':
            case 'restricao_ninjutsu':
            case 'restricao_genjutsu':
                emotionReduction += 1;
                break;
            case 'emocoes_incompletas':
                emotionReduction += 3;
                break;
            default:
                // Outros defeitos não reduzem emoções diretamente
                break;
        }
    });

    return Math.max(CHARACTER_RULES.MIN_EMOTIONS, CHARACTER_RULES.INITIAL_EMOTIONS - emotionReduction);
};

// Função para aplicar trauma (reduzir emoções)
export const applyTrauma = (character: Character, traumaAmount: number = 1): Character => {
    const newEmotions = Math.max(CHARACTER_RULES.MIN_EMOTIONS, character.emotions - traumaAmount);

    return {
        ...character,
        emotions: newEmotions
    };
};

// Função para recuperar emoções (marcos pessoais)
export const recoverEmotions = (character: Character, recoveryAmount: number = 1): Character => {
    const newEmotions = Math.min(CHARACTER_RULES.MAX_EMOTIONS, character.emotions + recoveryAmount);

    return {
        ...character,
        emotions: newEmotions
    };
};

// Função para verificar se personagem pode adquirir mais defeitos
export const canAcquireMoreDefects = (character: Character): boolean => {
    const currentDefects = character.defects ? character.defects.length : 0;
    return currentDefects < CHARACTER_RULES.MAX_DEFECTS;
};

// Função para verificar se personagem pode adquirir mais aprimoramentos
export const canAcquireMoreEnhancements = (character: Character): boolean => {
    const currentEnhancements = character.enhancements ? character.enhancements.length : 0;
    const expectedEnhancements = calculateExpectedEnhancements(character);
    return currentEnhancements < expectedEnhancements;
};
