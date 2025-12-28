// Constantes do jogo com sistema de níveis

import { Attributes, Skills, Clan, Character, Enhancement } from '@/types/game';
import { LEVEL_SYSTEM, calculateLevelUpPoints } from './levelSystem';

// Re-exportar tipos necessários
export type { Character, Attributes, Skills, Clan, Enhancement };

// Sistema de Aprimoramentos por Nível
export const ENHANCEMENT_SYSTEM = {
    1: { enhancementPoints: 4 },   // Origem
    2: { enhancementPoints: 1 },   // +1
    3: { enhancementPoints: 1 },   // +1
    4: { enhancementPoints: 1 },   // +1
    5: { enhancementPoints: 3 },   // +3
    6: { enhancementPoints: 1 },   // +1
    7: { enhancementPoints: 1 },   // +1
    8: { enhancementPoints: 1 },   // +1
    9: { enhancementPoints: 2 },   // +2
    10: { enhancementPoints: 1 },  // +1
    11: { enhancementPoints: 1 },  // +1
    12: { enhancementPoints: 1 },  // +1
    13: { enhancementPoints: 2 },  // +2
    14: { enhancementPoints: 1 },  // +1
    15: { enhancementPoints: 1 },  // +1
    16: { enhancementPoints: 1 },  // +1
    17: { enhancementPoints: 2 },  // +2
    18: { enhancementPoints: 1 },  // +1
    19: { enhancementPoints: 1 },  // +1
    20: { enhancementPoints: 1 },  // +1
};

export const HUMAN_BASE_ATTRIBUTES: Attributes = {
    strength: 2,
    agility: 2,
    vigor: 2,
    intelligence: 2,
    essence: 2,
    perception: 2,
    influence: 2,
};

// Sistema de modificadores por idade
export const AGE_MODIFIERS = {
    // Crianças (6-11 anos)
    child: {
        minAge: 6,
        maxAge: 11,
        modifiers: {
            strength: -1,
            agility: 0,
            vigor: -1,
            intelligence: 0,
            essence: 0,
            perception: 0,
            influence: 0,
        },
        description: 'Criança - Força e Vigor reduzidos'
    },
    // Jovens (12-17 anos)
    young: {
        minAge: 12,
        maxAge: 17,
        modifiers: {
            strength: 0,
            agility: 0,
            vigor: 0,
            intelligence: 0,
            essence: 0,
            perception: 0,
            influence: 0,
        },
        description: 'Jovem - Sem modificadores'
    },
    // Adultos (18-35 anos)
    adult: {
        minAge: 18,
        maxAge: 35,
        modifiers: {
            strength: 1,
            agility: 0,
            vigor: 1,
            intelligence: 0,
            essence: 0,
            perception: 0,
            influence: 0,
        },
        description: 'Adulto - Força e Vigor aumentados'
    },
    // Maduros (36-50 anos)
    mature: {
        minAge: 36,
        maxAge: 50,
        modifiers: {
            strength: 0,
            agility: -1,
            vigor: 0,
            intelligence: 1,
            essence: 0,
            perception: 1,
            influence: 0,
        },
        description: 'Maduro - Inteligência e Percepção aumentados, Agilidade reduzida'
    },
    // Idosos (51+ anos)
    elderly: {
        minAge: 51,
        maxAge: 999,
        modifiers: {
            strength: -1,
            agility: -2,
            vigor: -1,
            intelligence: 2,
            essence: 0,
            perception: 2,
            influence: 0,
        },
        description: 'Idoso - Inteligência e Percepção muito aumentados, Força e Agilidade reduzidos'
    }
};

// Função para obter modificadores de idade
export function getAgeModifiers(age: number): Partial<Attributes> {
    for (const [key, ageGroup] of Object.entries(AGE_MODIFIERS)) {
        if (age >= ageGroup.minAge && age <= ageGroup.maxAge) {
            return ageGroup.modifiers;
        }
    }
    return {}; // Fallback para sem modificadores
}

// Função para obter descrição da faixa etária
export function getAgeDescription(age: number): string {
    for (const [key, ageGroup] of Object.entries(AGE_MODIFIERS)) {
        if (age >= ageGroup.minAge && age <= ageGroup.maxAge) {
            return ageGroup.description;
        }
    }
    return 'Faixa etária não definida';
}

export const KONOHA_CLANS: Clan[] = [
    {
        id: 'uchiha',
        name: 'Uchiha',
        description: 'Clã conhecido por seu Sharingan e habilidades de fogo.',
        specialAbility: 'Sharingan (ainda a ser detalhado)',
        attributeModifiers: { intelligence: 1, essence: 1 },
    },
    {
        id: 'hyuga',
        name: 'Hyuga',
        description: 'Clã com o Byakugan, especialista em Taijutsu e visão de 360 graus.',
        specialAbility: 'Byakugan (ainda a ser detalhado)',
        attributeModifiers: { perception: 1, agility: 1 },
    },
    {
        id: 'nara',
        name: 'Nara',
        description: 'Clã de estrategistas, mestres em técnicas de manipulação de sombras.',
        specialAbility: 'Manipulação de Sombras (ainda a ser detalhado)',
        attributeModifiers: { intelligence: 1, perception: 1 },
    },
    {
        id: 'akimichi',
        name: 'Akimichi',
        description: 'Clã com técnicas de expansão corporal e grande força física.',
        specialAbility: 'Expansão Corporal (ainda a ser detalhado)',
        attributeModifiers: { strength: 1, vigor: 1 },
    },
    {
        id: 'uzumaki',
        name: 'Uzumaki',
        description: 'Clã conhecido por sua vitalidade, grandes reservas de chakra e técnicas de selamento.',
        specialAbility: 'Chakra Abundante (ainda a ser detalhado)',
        attributeModifiers: { essence: 1, vigor: 1 },
    },
    {
        id: 'yamanaka',
        name: 'Yamanaka',
        description: 'Clã especialista em técnicas de controle mental e comunicação telepática.',
        specialAbility: 'Controle Mental (ainda a ser detalhado)',
        attributeModifiers: { intelligence: 1, perception: 1 },
    },
    {
        id: 'aburame',
        name: 'Aburame',
        description: 'Clã que usa insetos como parte de suas técnicas de combate e espionagem.',
        specialAbility: 'Kikaichu (ainda a ser detalhado)',
        attributeModifiers: { vigor: 1, perception: 1 },
    },
    {
        id: 'inuzuka',
        name: 'Inuzuka',
        description: 'Clã que luta em parceria com cães ninjas, com sentidos aguçados e ataques combinados.',
        specialAbility: 'Parceria Canina (ainda a ser detalhado)',
        attributeModifiers: { agility: 1, strength: 1 },
    },
    // Opções para personagens sem clã
    {
        id: 'no_clan',
        name: 'Sem Clã',
        description: 'Personagem sem linhagem ninja conhecida - maior flexibilidade na criação',
        specialAbility: 'Flexibilidade - +2 pontos de atributo livres e +2 pontos de perícia extras',
        attributeModifiers: {},
    },
    {
        id: 'mutation',
        name: 'Mutação',
        description: 'Personagem com características únicas, experimentos ou origem misteriosa',
        specialAbility: 'Adaptação - +2 pontos de atributo livres e +2 pontos de perícia extras',
        attributeModifiers: {},
    },
];

/**
 * Calcula recursos do personagem (vida e chakra)
 * Aceita regras do banco de dados, mas usa valores padrão como fallback
 */
export const calculateResources = (
    attributes: Attributes,
    rank: Character['rank'],
    resourceRules?: {
        health?: { formula: any; rank_multipliers: Record<Character['rank'], number> };
        chakra?: { formula: any; rank_multipliers: Record<Character['rank'], number> };
    }
) => {
    // Fallback: Base multiplier is 5 for Genin and increases by 1 per rank step
    const defaultRankMultiplierMap: Record<Character['rank'], number> = {
        Genin: 5,
        Chunnin: 6,
        Jounin: 7,
        Hokage: 8,
    };

    // Usar regras do banco ou fallback
    const healthMultiplier = resourceRules?.health?.rank_multipliers?.[rank] ?? defaultRankMultiplierMap[rank] ?? 5;
    const chakraMultiplier = resourceRules?.chakra?.rank_multipliers?.[rank] ?? defaultRankMultiplierMap[rank] ?? 5;

    return {
        health: attributes.vigor * healthMultiplier + attributes.strength,
        chakra: attributes.essence * chakraMultiplier + attributes.intelligence,
    };
};

/**
 * Calcula Resistência Mental (RM)
 * Aceita regras do banco de dados, mas usa fórmula padrão como fallback
 */
export const calculateMentalResistance = (
    attributes: Attributes,
    resourceRules?: {
        mental_resistance?: { formula: any };
    }
): number => {
    // Fallback: soma dos atributos mentais dividido por 3
    const mentalAttributes = attributes.intelligence + attributes.essence + attributes.perception;
    return Math.floor(mentalAttributes / 3);
};

/**
 * Calcula Resistência Física (RF)
 * Aceita regras do banco de dados, mas usa fórmula padrão como fallback
 */
export const calculatePhysicalResistance = (
    attributes: Attributes,
    resourceRules?: {
        physical_resistance?: { formula: any };
    }
): number => {
    // Fallback: soma dos atributos físicos dividido por 3
    const physicalAttributes = attributes.strength + attributes.agility + attributes.vigor;
    return Math.floor(physicalAttributes / 3);
};

/**
 * Calcula os valores base das perícias usando apenas o atributo base definido para cada uma.
 * @param character - O personagem completo
 * @param skillsMapping - Mapeamento de habilidades com seus atributos base
 */
export const calculateSkills = (character: Character, skillsMapping: Record<string, string>): Skills => {
    // Função auxiliar para obter o valor de um atributo pelo nome/abreviação
    const getAttributeValue = (attributeAbbr: string): number => {
        const attributeMap: Record<string, keyof Character['baseAttributes']> = {
            'FOR': 'strength',
            'VIG': 'vigor',
            'AGI': 'agility',
            'INT': 'intelligence',
            'PER': 'perception',
            'ESS': 'essence',
            'INF': 'influence'
        };

        const attributeKey = attributeMap[attributeAbbr] || 'strength';
        const baseValue = character.baseAttributes[attributeKey] || 2;
        const distributedValue = character.distributedAttributes[attributeKey] || 0;
        const bonusValue = character.attributeBonuses[attributeKey] || 0;

        return baseValue + distributedValue + bonusValue;
    };

    const baseSkills: Skills = {
        athletics: 0,
        stealth: 0,
        nature: 0,
        sealing: 0,
        society: 0,
        chakraControl: 0,
        occultism: 0,
        performance: 0,
    };

    // Calcular cada perícia usando apenas seu atributo base
    Object.keys(skillsMapping).forEach((skillName) => {
        const attributeAbbr = skillsMapping[skillName];
        const attributeValue = getAttributeValue(attributeAbbr);

        // Mapear nome da perícia para chave do sistema
        const skillKey = skillName.toLowerCase().replace(/\s+/g, '');
        const mappedKey = mapSkillNameToKey(skillKey);

        if (mappedKey in baseSkills) {
            (baseSkills as any)[mappedKey] = attributeValue;
        }
    });

    return baseSkills;
};

/**
 * Mapeia o nome da perícia para a chave do sistema
 */
const mapSkillNameToKey = (skillName: string): keyof Skills => {
    const mapping: Record<string, keyof Skills> = {
        'athletics': 'athletics',
        'stealth': 'stealth',
        'nature': 'nature',
        'sealing': 'sealing',
        'society': 'society',
        'chakracontrol': 'chakraControl',
        'occultism': 'occultism',
        'performance': 'performance'
    };

    return mapping[skillName] || 'athletics';
};

export const calculateChakraControl = (attributes: Attributes): number => {
    return attributes.essence + attributes.intelligence;
};

// Funções para calcular perícias totais
export const calculateTotalSkills = (character: Character, skillsMapping: Record<string, string>, distributedSkills: any, bonuses: any = {}) => {
    const baseSkills = calculateSkills(character, skillsMapping);
    return {
        athletics: baseSkills.athletics + (distributedSkills.athletics || 0) + (bonuses.athletics || 0),
        stealth: baseSkills.stealth + (distributedSkills.stealth || 0) + (bonuses.stealth || 0),
        nature: baseSkills.nature + (distributedSkills.nature || 0) + (bonuses.nature || 0),
        sealing: baseSkills.sealing + (distributedSkills.sealing || 0) + (bonuses.sealing || 0),
        society: baseSkills.society + (distributedSkills.society || 0) + (bonuses.society || 0),
        chakraControl: baseSkills.chakraControl + (distributedSkills.chakraControl || 0) + (bonuses.chakraControl || 0),
        occultism: baseSkills.occultism + (distributedSkills.occultism || 0) + (bonuses.occultism || 0),
        performance: baseSkills.performance + (distributedSkills.performance || 0) + (bonuses.performance || 0),
    };
};

// Função para calcular base de perícia customizada
export const calculateCustomSkillBase = (attributes: Attributes, attr1: keyof Attributes, attr2: keyof Attributes): number => {
    return attributes[attr1] + attributes[attr2];
};

// Funções para sistema de aprimoramentos
export const calculateAvailableEnhancementPoints = (level: number): number => {
    let totalPoints = 0;
    for (let i = 1; i <= level; i++) {
        totalPoints += ENHANCEMENT_SYSTEM[i as keyof typeof ENHANCEMENT_SYSTEM]?.enhancementPoints || 0;
    }
    return totalPoints;
};

export const calculateRemainingEnhancementPoints = (level: number, enhancements: Enhancement[]): number => {
    // Usar a tabela original do sistema de aprimoramentos
    const available = calculateAvailableEnhancementPoints(level);
    // Cada aprimoramento conta como 1 ponto
    const used = enhancements.length;
    return Math.max(0, available - used);
};

// Funções para criação de personagem
export function createEmptyCharacter(userId: string, name: string, clan: string, age: number = 12): Character {
    const selectedClan = KONOHA_CLANS.find(c => c.id === clan);
    const baseAttributes = { ...HUMAN_BASE_ATTRIBUTES };

    // Aplicar modificadores do clã
    if (selectedClan?.attributeModifiers) {
        Object.entries(selectedClan.attributeModifiers).forEach(([attr, modifier]) => {
            baseAttributes[attr as keyof Attributes] += modifier;
        });
    }

    // Aplicar modificadores de idade
    const ageModifiers = getAgeModifiers(age);
    Object.entries(ageModifiers).forEach(([attr, modifier]) => {
        baseAttributes[attr as keyof Attributes] += modifier;
    });

    const resources = calculateResources(baseAttributes, 'Genin');

    // Perícias distribuídas pelo jogador (inicialmente 0)
    const skills = {
        athletics: 0,
        stealth: 0,
        nature: 0,
        sealing: 0,
        society: 0,
        chakraControl: 0,
        occultism: 0,
        performance: 0,
    };

    // Calcular pontos extras baseados no tipo de personagem
    let extraAttributePoints = 0;
    let extraSkillPoints = 0;

    if (clan === 'no_clan') {
        extraAttributePoints = 2;
        extraSkillPoints = 2;
    } else if (clan === 'mutation') {
        extraAttributePoints = 2;
        extraSkillPoints = 2;
    }

    return {
        id: '',
        userId,
        name,
        clan,
        age,
        rank: 'Genin',
        level: 1,
        availableAttributePoints: 1 + extraAttributePoints, // Nível 1 + bônus especiais
        availableSkillPoints: 1 + extraSkillPoints, // Nível 1 + bônus especiais
        baseAttributes,
        distributedAttributes: {
            strength: 0,
            agility: 0,
            vigor: 0,
            intelligence: 0,
            essence: 0,
            perception: 0,
            influence: 0,
        },
        attributeBonuses: {
            strength: 0,
            agility: 0,
            vigor: 0,
            intelligence: 0,
            essence: 0,
            perception: 0,
            influence: 0,
        },
        resources,
        auxiliary: {
            mentalResistance: 3,
            physicalResistance: 3,
        },
        emotions: 8,
        skills,
        skillBonuses: {
            athletics: 0,
            stealth: 0,
            nature: 0,
            sealing: 0,
            society: 0,
            chakraControl: 0,
            occultism: 0,
            performance: 0,
        },
        customSkills: [],
        jutsus: [],
        items: [],
        enhancements: [],
        defects: [],
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

// Funções para evolução de personagem
export function levelUpCharacter(character: Character): Character {
    const newLevel = character.level + 1;
    const levelUpPoints = calculateLevelUpPoints(character.level);

    // Atualizar patente baseada no nível
    let newRank = character.rank;
    if (newLevel >= 15) {
        newRank = 'Hokage';
    } else if (newLevel >= 10) {
        newRank = 'Jounin';
    } else if (newLevel >= 5) {
        newRank = 'Chunnin';
    } else {
        newRank = 'Genin';
    }

    // Recalcular recursos usando o novo rank
    const totalAttributes = {
        strength: character.baseAttributes.strength + character.distributedAttributes.strength + character.attributeBonuses.strength,
        agility: character.baseAttributes.agility + character.distributedAttributes.agility + character.attributeBonuses.agility,
        vigor: character.baseAttributes.vigor + character.distributedAttributes.vigor + character.attributeBonuses.vigor,
        intelligence: character.baseAttributes.intelligence + character.distributedAttributes.intelligence + character.attributeBonuses.intelligence,
        essence: character.baseAttributes.essence + character.distributedAttributes.essence + character.attributeBonuses.essence,
        perception: character.baseAttributes.perception + character.distributedAttributes.perception + character.attributeBonuses.perception,
        influence: character.baseAttributes.influence + character.distributedAttributes.influence + character.attributeBonuses.influence,
    };
    const newResources = calculateResources(totalAttributes, newRank);

    return {
        ...character,
        level: newLevel,
        rank: newRank,
        resources: newResources,
        availableAttributePoints: character.availableAttributePoints + levelUpPoints.attributePoints,
        availableSkillPoints: character.availableSkillPoints + levelUpPoints.skillPoints,
        updatedAt: new Date(),
    };
}

export function spendAttributePoint(character: Character, attribute: keyof Attributes): Character {
    if (character.availableAttributePoints <= 0) return character;

    const newDistributedAttributes = {
        ...character.distributedAttributes,
        [attribute]: character.distributedAttributes[attribute] + 1,
    };

    // Recalcular recursos com novos atributos
    const totalAttributes = {
        strength: character.baseAttributes.strength + newDistributedAttributes.strength + character.attributeBonuses.strength,
        agility: character.baseAttributes.agility + newDistributedAttributes.agility + character.attributeBonuses.agility,
        vigor: character.baseAttributes.vigor + newDistributedAttributes.vigor + character.attributeBonuses.vigor,
        intelligence: character.baseAttributes.intelligence + newDistributedAttributes.intelligence + character.attributeBonuses.intelligence,
        essence: character.baseAttributes.essence + newDistributedAttributes.essence + character.attributeBonuses.essence,
        perception: character.baseAttributes.perception + newDistributedAttributes.perception + character.attributeBonuses.perception,
        influence: character.baseAttributes.influence + newDistributedAttributes.influence + character.attributeBonuses.influence,
    };

    const newResources = calculateResources(totalAttributes, character.rank);

    return {
        ...character,
        distributedAttributes: newDistributedAttributes,
        resources: newResources,
        availableAttributePoints: character.availableAttributePoints - 1,
        updatedAt: new Date(),
    };
}

export function spendSkillPoint(character: Character, skill: keyof Character['skills']): Character {
    if (character.availableSkillPoints <= 0) return character;

    const newSkills = {
        ...character.skills,
        [skill]: character.skills[skill] + 1,
    };

    return {
        ...character,
        skills: newSkills,
        availableSkillPoints: character.availableSkillPoints - 1,
        updatedAt: new Date(),
    };
}