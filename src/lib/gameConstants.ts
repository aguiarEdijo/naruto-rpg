// Constantes do jogo com sistema de níveis

import { Attributes, Resources, Skills, Clan, Rank, Character, Enhancement } from '@/types/game';
import { LEVEL_SYSTEM, calculateLevelUpPoints } from './levelSystem';

// Re-exportar tipos necessários
export type { Character, Attributes, Resources, Skills, Clan, Rank, Enhancement };

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

export const calculateResources = (attributes: Attributes): Resources => {
    return {
        health: attributes.vigor * 3 + attributes.strength,
        chakra: attributes.essence * 4 + attributes.intelligence,
        fatigue: attributes.vigor * 2 + attributes.strength,
        stress: attributes.intelligence * 2 + attributes.perception,
    };
};

export const calculateSkills = (attributes: Attributes, bonuses: any = {}): Skills => {
    const baseSkills = {
        athletics: attributes.strength + attributes.agility,
        stealth: attributes.agility + attributes.perception,
        nature: attributes.vigor + attributes.perception,
        sealing: attributes.intelligence + attributes.essence,
        society: attributes.intelligence + attributes.perception,
        chakraControl: attributes.essence + attributes.intelligence,
        occultism: attributes.essence + attributes.perception,
        performance: attributes.intelligence + attributes.agility,
        crafts: attributes.strength + attributes.intelligence,
        combatTechnique: attributes.strength + attributes.vigor,
    };

    // Aplicar bônus se fornecidos
    Object.keys(baseSkills).forEach(skill => {
        if (bonuses[skill]) {
            baseSkills[skill as keyof Skills] += bonuses[skill];
        }
    });

    return baseSkills;
};

export const calculateChakraControl = (attributes: Attributes): number => {
    return attributes.essence + attributes.intelligence;
};

// Funções para calcular perícias totais
export const calculateTotalSkills = (attributes: Attributes, distributedSkills: any, bonuses: any = {}) => {
    const baseSkills = calculateSkills(attributes);
    return {
        athletics: baseSkills.athletics + (distributedSkills.athletics || 0) + (bonuses.athletics || 0),
        stealth: baseSkills.stealth + (distributedSkills.stealth || 0) + (bonuses.stealth || 0),
        nature: baseSkills.nature + (distributedSkills.nature || 0) + (bonuses.nature || 0),
        sealing: baseSkills.sealing + (distributedSkills.sealing || 0) + (bonuses.sealing || 0),
        society: baseSkills.society + (distributedSkills.society || 0) + (bonuses.society || 0),
        chakraControl: baseSkills.chakraControl + (distributedSkills.chakraControl || 0) + (bonuses.chakraControl || 0),
        occultism: baseSkills.occultism + (distributedSkills.occultism || 0) + (bonuses.occultism || 0),
        performance: baseSkills.performance + (distributedSkills.performance || 0) + (bonuses.performance || 0),
        crafts: baseSkills.crafts + (distributedSkills.crafts || 0) + (bonuses.crafts || 0),
        combatTechnique: baseSkills.combatTechnique + (distributedSkills.combatTechnique || 0) + (bonuses.combatTechnique || 0),
    };
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

    const resources = calculateResources(baseAttributes);

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
        crafts: 0,
        combatTechnique: 0,
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
        },
        attributeBonuses: {
            strength: 0,
            agility: 0,
            vigor: 0,
            intelligence: 0,
            essence: 0,
            perception: 0,
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
            crafts: 0,
            combatTechnique: 0,
        },
        techniques: [],
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

    return {
        ...character,
        level: newLevel,
        availableAttributePoints: character.availableAttributePoints + levelUpPoints.attributePoints,
        availableSkillPoints: character.availableSkillPoints + levelUpPoints.skillPoints,
        updatedAt: new Date(),
    };
}

export function spendAttributePoint(character: Character, attribute: keyof Attributes): Character {
    if (character.availableAttributePoints <= 0) return character;

    const newAttributes = {
        ...character.attributes,
        [attribute]: character.attributes[attribute] + 1,
    };

    const newResources = calculateResources(newAttributes);
    const newSkills = calculateSkills(newAttributes);

    return {
        ...character,
        attributes: newAttributes,
        resources: newResources,
        naturalSkills: newSkills,
        trainedSkills: newSkills,
        availableAttributePoints: character.availableAttributePoints - 1,
        updatedAt: new Date(),
    };
}

export function spendSkillPoint(character: Character, skillType: 'natural' | 'trained', skill: string): Character {
    if (character.availableSkillPoints <= 0) return character;

    const newCharacter = { ...character };

    if (skillType === 'natural') {
        newCharacter.naturalSkills = {
            ...character.naturalSkills,
            [skill]: character.naturalSkills[skill as keyof typeof character.naturalSkills] + 1,
        };
    } else {
        newCharacter.trainedSkills = {
            ...character.trainedSkills,
            [skill]: character.trainedSkills[skill as keyof typeof character.trainedSkills] + 1,
        };
    }

    newCharacter.availableSkillPoints = character.availableSkillPoints - 1;
    newCharacter.updatedAt = new Date();

    return newCharacter;
}