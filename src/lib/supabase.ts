// Configuração do Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
                    skills: any;
                    skill_bonuses: any;
                    techniques: any;
                    enhancements: any;
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
                    skills: any;
                    skill_bonuses: any;
                    techniques: any;
                    enhancements: any;
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
                    skills?: any;
                    skill_bonuses?: any;
                    techniques?: any;
                    enhancements?: any;
                    is_editable?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            clans: {
                Row: {
                    id: string;
                    name: string;
                    description: string;
                    modifiers: any;
                    special_ability: string;
                };
                Insert: {
                    id: string;
                    name: string;
                    description: string;
                    modifiers: any;
                    special_ability: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string;
                    modifiers?: any;
                    special_ability?: string;
                };
            };
        };
    };
}
