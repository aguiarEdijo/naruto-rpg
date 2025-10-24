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
    };

    // Pontos distribuídos pelo jogador nos atributos
    distributedAttributes: {
        strength: number;
        agility: number;
        vigor: number;
        intelligence: number;
        essence: number;
        perception: number;
    };

    // Bônus de atributos (por habilidades, itens, etc.)
    attributeBonuses: {
        strength: number;
        agility: number;
        vigor: number;
        intelligence: number;
        essence: number;
        perception: number;
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
        crafts: number;         // OFÍCIOS = FOR + INT
        combatTechnique: number; // TÉCNICA DE COMBATE = FOR + VIG
    };

    // Bônus de perícias (por habilidades, itens, etc.)
    skillBonuses: {
        athletics: number;
        stealth: number;
        nature: number;
        sealing: number;
        society: number;
        chakraControl: number;
        occultism: number;
        performance: number;
        crafts: number;
        combatTechnique: number;
    };

    // Técnicas conhecidas
    techniques: Technique[];

    // Aprimoramentos adquiridos
    enhancements: Enhancement[];

    // Defeitos adquiridos
    defects: Defect[];

    // Controle de edição
    isEditable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Technique {
    id: string;
    name: string;
    type: 'Taijutsu' | 'Ninjutsu' | 'Genjutsu';
    level: number;           // 1-5
    chakraCost: number;
    damage: number;
    requirements: {
        strength?: number;
        agility?: number;
        vigor?: number;
        intelligence?: number;
        essence?: number;
        perception?: number;
    };
    description: string;
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
    crafts: number;
    combatTechnique: number;
}

export interface Clan {
    id: string;
    name: string;
    description: string;
    modifiers: {
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
