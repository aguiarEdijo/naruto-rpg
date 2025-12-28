// Tipos principais do jogo

export interface Character {
    id: string;
    userId: string;
    name: string;
    clan: string;
    age: number;
    rank: 'Genin' | 'Chunnin' | 'Jounin' | 'Hokage';
    level: number; // 1-20

    // Pontos disponíveis para distribuição
    availableAttributePoints: number;
    availableSkillPoints: number;

    // Atributos principais (valores base)
    baseAttributes: {
        strength: number;      // Força
        agility: number;       // Agilidade
        vigor: number;         // Vigor
        intelligence: number;   // Inteligência
        essence: number;       // Essência
        perception: number;     // Percepção
        influence: number;      // Influência
    };

    // Pontos distribuídos pelo jogador nos atributos
    distributedAttributes: {
        strength: number;
        agility: number;
        vigor: number;
        intelligence: number;
        essence: number;
        perception: number;
        influence: number;
    };

    // Bônus de atributos (por habilidades, itens, etc.)
    attributeBonuses: {
        strength: number;
        agility: number;
        vigor: number;
        intelligence: number;
        essence: number;
        perception: number;
        influence: number;
    };

    // Recursos
    resources: {
        health: number;         // Vida
        chakra: number;         // Chakra
        fatigue: number;        // Fadiga (desgaste físico)
        stress: number;         // Stress (desgaste mental)
    };

    // Recursos auxiliares
    auxiliary: {
        mentalResistance: number;  // Resistência Mental (RM)
        physicalResistance: number; // Resistência Física (RF)
    };

    // Componente Emoções (0-10)
    emotions: number;

    // Perícias (pontos distribuídos pelo jogador)
    skills: {
        athletics: number;      // ATLÉTICAS = FOR + AGI
        stealth: number;       // FURTIVIDADE = AGI + PER
        nature: number;        // NATUREZA = VIG + PER
        sealing: number;       // SELAMENTOS = INT + ESS
        society: number;       // SOCIEDADE = INT + PER
        chakraControl: number; // CONTROLE DE CHAKRA = ESS + INT
        occultism: number;      // OCULTISMO = ESS + PER
        performance: number;    // PERFORMANCE = INT + AGI
    };

    // Bônus de perícias (por habilidades, itens, etc.) - dinâmico para suportar perícias do banco
    skillBonuses?: Record<string, number>;

    // Valores das perícias - dinâmico para suportar perícias do banco
    skillValues?: Record<string, number>;

    // Perícias customizadas
    customSkills: CustomSkill[];

    // Jutsus conhecidos
    jutsus: Jutsu[];

    // Itens possuídos
    items: Item[];

    // Aprimoramentos adquiridos
    enhancements: Enhancement[];

    // Defeitos adquiridos
    defects: Defect[];

    // Controle de edição
    isEditable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomSkill {
    id: string;
    name: string;
    category: 'combat' | 'craft';
    attribute1: keyof Attributes;
    attribute2: keyof Attributes;
    distributed: number;
    bonus: number;
}

export interface Jutsu {
    id: string;
    name: string;
    type: 'Ninjutsu' | 'Taijutsu' | 'Genjutsu';
    description: string;
    rank: number;           // 1-5
    chakraCost: number;
    damage: number;
    effects: string;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    quantity: number;
    weight: number;
    effects: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Enhancement {
    id: string;
    name: string;
    description: string;
    effects: string[];
    requirements?: {
        level?: number;
        attributes?: Partial<Attributes>;
        skills?: Partial<Skills>;
    };
    clan?: string; // Clã específico para aprimoramentos de clã
    restricted?: string; // Restrições especiais (ex: "Origem", "Níveis de Patamar")
}

export interface Defect {
    id: string;
    name: string;
    description: string;
    penalties: string[];
    restrictions?: {
        level?: number;
        attributes?: Partial<Attributes>;
        skills?: Partial<Skills>;
    };
    clan?: string; // Clã específico para defeitos de clã
    restricted?: string; // Restrições especiais (ex: "Origem", "Níveis de Patamar")
    points?: number; // Pontos de defeito (para sistemas que usam pontos)
}

export interface Attributes {
    strength: number;
    agility: number;
    vigor: number;
    intelligence: number;
    essence: number;
    perception: number;
    influence: number;
}

export interface Skills {
    athletics: number;
    stealth: number;
    nature: number;
    sealing: number;
    society: number;
    chakraControl: number;
    occultism: number;
    performance: number;
}

export interface Clan {
    id: string;
    name: string;
    description: string;
    attributeModifiers: {
        strength?: number;
        agility?: number;
        vigor?: number;
        intelligence?: number;
        essence?: number;
        perception?: number;
    };
    specialAbility: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    isGM: boolean;
    createdAt: Date;
}

export interface GameSession {
    id: string;
    gmId: string;
    name: string;
    isActive: boolean;
    characters: string[]; // IDs dos personagens
    createdAt: Date;
}
