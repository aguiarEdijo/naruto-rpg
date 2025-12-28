// Tipos para regras do jogo Naruto RPG

export type JutsuRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export type CharacterRank = 'Genin' | 'Chunnin' | 'Jounin' | 'Hokage';
export type ResourceRuleType = 'health' | 'chakra' | 'physical_resistance' | 'mental_resistance';

export interface RankMultiplier {
    rank: JutsuRank;
    multiplier: number;
    created_at?: string;
    updated_at?: string;
}

export interface ResourceCalculationRule {
    id: string;
    rule_type: ResourceRuleType;
    formula: {
        base_attribute?: string;
        multiplier_attribute?: string;
        additional_attribute?: string;
        attributes?: string[];
        operation: 'multiply_then_add' | 'sum_then_divide';
        divisor?: number;
    };
    rank_multipliers: Record<CharacterRank, number>;
    created_at?: string;
    updated_at?: string;
}

export interface JutsuCategory {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface JutsuCategoryRank {
    id: string;
    category_id: string;
    rank: JutsuRank;
    custo: string | null;
    requisito: number | null;
    mult: string | null;
    efeito: string | null;
    duracao: string | null;
    realidade: number | null;
    created_at?: string;
    updated_at?: string;
}

export interface JutsuEffect {
    id: string;
    name: string;
    custo: number;
    requisito: string | null;
    descricao: string;
    categoria: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ResistanceDifficulty {
    rank: JutsuRank;
    execucao: number;
    rm_rf: number;
    created_at?: string;
    updated_at?: string;
}





