// Configuração do Supabase

import { createClient } from '@supabase/supabase-js';

// Debug das variáveis de ambiente
console.log('🔍 Debug Supabase:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Presente' : 'Ausente');
console.log('🔍 Verificando se as variáveis estão sendo carregadas...');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kvbbdcegsdohnhyzsflk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Tipos para o banco de dados
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    name: string;
                    is_gm: boolean;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    name: string;
                    is_gm?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    name?: string;
                    is_gm?: boolean;
                    created_at?: string;
                };
            };
            characters: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    clan: string;
                    age: number;
                    rank: string;
                    level: number;
                    available_attribute_points: number;
                    available_skill_points: number;
                    base_attributes: any;
                    distributed_attributes: any;
                    attribute_bonuses: any;
                    resources: any;
                    auxiliary: any;
                    emotions: number;
                    skills: any;
                    skill_bonuses: any;
                    is_editable: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    clan: string;
                    age: number;
                    rank: string;
                    level?: number;
                    available_attribute_points?: number;
                    available_skill_points?: number;
                    base_attributes: any;
                    distributed_attributes: any;
                    attribute_bonuses: any;
                    resources: any;
                    auxiliary: any;
                    emotions?: number;
                    skills: any;
                    skill_bonuses: any;
                    is_editable?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    clan?: string;
                    age?: number;
                    rank?: string;
                    level?: number;
                    available_attribute_points?: number;
                    available_skill_points?: number;
                    base_attributes?: any;
                    distributed_attributes?: any;
                    attribute_bonuses?: any;
                    resources?: any;
                    auxiliary?: any;
                    emotions?: number;
                    skills?: any;
                    skill_bonuses?: any;
                    is_editable?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            custom_skills: {
                Row: {
                    id: string;
                    character_id: string;
                    name: string;
                    category: string;
                    attribute1: string;
                    attribute2: string;
                    distributed: number;
                    bonus: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    character_id: string;
                    name: string;
                    category: string;
                    attribute1: string;
                    attribute2: string;
                    distributed?: number;
                    bonus?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    character_id?: string;
                    name?: string;
                    category?: string;
                    attribute1?: string;
                    attribute2?: string;
                    distributed?: number;
                    bonus?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            jutsus: {
                Row: {
                    id: string;
                    character_id: string;
                    name: string;
                    type: string;
                    description: string;
                    rank: number;
                    chakra_cost: number;
                    damage: number;
                    effects: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    character_id: string;
                    name: string;
                    type: string;
                    description?: string;
                    rank: number;
                    chakra_cost?: number;
                    damage?: number;
                    effects?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    character_id?: string;
                    name?: string;
                    type?: string;
                    description?: string;
                    rank?: number;
                    chakra_cost?: number;
                    damage?: number;
                    effects?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            items: {
                Row: {
                    id: string;
                    character_id: string;
                    name: string;
                    description: string;
                    quantity: number;
                    weight: number;
                    effects: string;
                    rarity: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    character_id: string;
                    name: string;
                    description?: string;
                    quantity?: number;
                    weight?: number;
                    effects?: string;
                    rarity: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    character_id?: string;
                    name?: string;
                    description?: string;
                    quantity?: number;
                    weight?: number;
                    effects?: string;
                    rarity?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            clans: {
                Row: {
                    id: string;
                    name: string;
                    description: string;
                    attribute_modifiers: any;
                    special_ability: string;
                };
                Insert: {
                    id: string;
                    name: string;
                    description: string;
                    attribute_modifiers: any;
                    special_ability: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string;
                    attribute_modifiers?: any;
                    special_ability?: string;
                };
            };
            level_progression: {
                Row: {
                    id: number;
                    level: number;
                    rank: string;
                    dice_evolution: string;
                    attribute_points: string;
                    skill_points: string;
                    total_skill_gain: number;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    level: number;
                    rank: string;
                    dice_evolution: string;
                    attribute_points: string;
                    skill_points: string;
                    total_skill_gain: number;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    level?: number;
                    rank?: string;
                    dice_evolution?: string;
                    attribute_points?: string;
                    skill_points?: string;
                    total_skill_gain?: number;
                    created_at?: string;
                };
            };
            attributes: {
                Row: {
                    id: number;
                    nome: string;
                    abreviacao: string;
                    categoria: string;
                    descricao: string;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    nome: string;
                    abreviacao: string;
                    categoria: string;
                    descricao: string;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    nome?: string;
                    abreviacao?: string;
                    categoria?: string;
                    descricao?: string;
                    created_at?: string;
                };
            };
            defects: {
                Row: {
                    id: number;
                    nome: string;
                    tipo: string;
                    descricao: string;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    nome: string;
                    tipo: string;
                    descricao: string;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    nome?: string;
                    tipo?: string;
                    descricao?: string;
                    created_at?: string;
                };
            };
            enhancements: {
                Row: {
                    id: number;
                    nome: string;
                    tipo: string;
                    clan_restricao: string | null;
                    rank_restricao: string | null;
                    requisitos: any; // JSONB
                    custo: string | null;
                    acoes: string | null;
                    duracao: string | null;
                    descricao: string;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    nome: string;
                    tipo: string;
                    clan_restricao?: string | null;
                    rank_restricao?: string | null;
                    requisitos?: any;
                    custo?: string | null;
                    acoes?: string | null;
                    duracao?: string | null;
                    descricao: string;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    nome?: string;
                    tipo?: string;
                    clan_restricao?: string | null;
                    rank_restricao?: string | null;
                    requisitos?: any;
                    custo?: string | null;
                    acoes?: string | null;
                    duracao?: string | null;
                    descricao?: string;
                    created_at?: string;
                };
            };
            skills: {
                Row: {
                    id: number;
                    nome: string;
                    atributo_base: string;
                    descricao: string;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    nome: string;
                    atributo_base: string;
                    descricao: string;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    nome?: string;
                    atributo_base?: string;
                    descricao?: string;
                    created_at?: string;
                };
            };
            rank_multipliers: {
                Row: {
                    rank: string;
                    multiplier: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    rank: string;
                    multiplier: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    rank?: string;
                    multiplier?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            resource_calculation_rules: {
                Row: {
                    id: string;
                    rule_type: 'health' | 'chakra' | 'physical_resistance' | 'mental_resistance';
                    formula: any; // JSONB
                    rank_multipliers: any; // JSONB
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    rule_type: 'health' | 'chakra' | 'physical_resistance' | 'mental_resistance';
                    formula: any;
                    rank_multipliers?: any;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    rule_type?: 'health' | 'chakra' | 'physical_resistance' | 'mental_resistance';
                    formula?: any;
                    rank_multipliers?: any;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            jutsu_categories: {
                Row: {
                    id: string;
                    name: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    name: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            jutsu_category_ranks: {
                Row: {
                    id: string;
                    category_id: string;
                    rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
                    custo: string | null;
                    requisito: number | null;
                    mult: string | null;
                    efeito: string | null;
                    duracao: string | null;
                    realidade: number | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    category_id: string;
                    rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
                    custo?: string | null;
                    requisito?: number | null;
                    mult?: string | null;
                    efeito?: string | null;
                    duracao?: string | null;
                    realidade?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    category_id?: string;
                    rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
                    custo?: string | null;
                    requisito?: number | null;
                    mult?: string | null;
                    efeito?: string | null;
                    duracao?: string | null;
                    realidade?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            jutsu_effects: {
                Row: {
                    id: string;
                    name: string;
                    custo: number;
                    requisito: string | null;
                    descricao: string;
                    categoria: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    custo: number;
                    requisito?: string | null;
                    descricao: string;
                    categoria?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    custo?: number;
                    requisito?: string | null;
                    descricao?: string;
                    categoria?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            resistance_difficulties: {
                Row: {
                    rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
                    execucao: number;
                    rm_rf: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
                    execucao: number;
                    rm_rf: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
                    execucao?: number;
                    rm_rf?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}
