import { supabase } from '@/lib/supabase';
import type {
    RankMultiplier,
    ResourceCalculationRule,
    JutsuCategory,
    JutsuCategoryRank,
    JutsuEffect,
    ResistanceDifficulty,
    ResourceRuleType,
    JutsuRank
} from '@/types/gameRules';

// ============================================================
// Rank Multipliers
// ============================================================

export class RankMultipliersService {
    static async getAll(): Promise<RankMultiplier[]> {
        try {
            const { data, error } = await supabase
                .from('rank_multipliers')
                .select('*')
                .order('multiplier', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Erro ao buscar rank multipliers:', error);
            throw error;
        }
    }

    static async getByRank(rank: JutsuRank): Promise<RankMultiplier | null> {
        try {
            const { data, error } = await supabase
                .from('rank_multipliers')
                .select('*')
                .eq('rank', rank)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar rank multiplier para ${rank}:`, error);
            throw error;
        }
    }

    static async update(rank: JutsuRank, multiplier: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('rank_multipliers')
                .update({ multiplier })
                .eq('rank', rank);

            if (error) throw error;
        } catch (error) {
            console.error(`Erro ao atualizar rank multiplier ${rank}:`, error);
            throw error;
        }
    }
}

// ============================================================
// Resource Calculation Rules
// ============================================================

export class ResourceCalculationRulesService {
    static async getAll(): Promise<ResourceCalculationRule[]> {
        try {
            const { data, error } = await supabase
                .from('resource_calculation_rules')
                .select('*')
                .order('rule_type', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Erro ao buscar resource calculation rules:', error);
            throw error;
        }
    }

    static async getByType(ruleType: ResourceRuleType): Promise<ResourceCalculationRule | null> {
        try {
            const { data, error } = await supabase
                .from('resource_calculation_rules')
                .select('*')
                .eq('rule_type', ruleType)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar resource rule para ${ruleType}:`, error);
            throw error;
        }
    }

    static async update(
        ruleType: ResourceRuleType,
        updates: Partial<Omit<ResourceCalculationRule, 'id' | 'rule_type' | 'created_at' | 'updated_at'>>
    ): Promise<void> {
        try {
            const { error } = await supabase
                .from('resource_calculation_rules')
                .update(updates)
                .eq('rule_type', ruleType);

            if (error) throw error;
        } catch (error) {
            console.error(`Erro ao atualizar resource rule ${ruleType}:`, error);
            throw error;
        }
    }
}

// ============================================================
// Jutsu Categories
// ============================================================

export class JutsuCategoriesService {
    static async getAll(): Promise<JutsuCategory[]> {
        try {
            const { data, error } = await supabase
                .from('jutsu_categories')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Erro ao buscar jutsu categories:', error);
            throw error;
        }
    }

    static async getById(id: string): Promise<JutsuCategory | null> {
        try {
            const { data, error } = await supabase
                .from('jutsu_categories')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar jutsu category ${id}:`, error);
            throw error;
        }
    }

    static async update(id: string, name: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('jutsu_categories')
                .update({ name })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error(`Erro ao atualizar jutsu category ${id}:`, error);
            throw error;
        }
    }
}

// ============================================================
// Jutsu Category Ranks
// ============================================================

export class JutsuCategoryRanksService {
    static async getAll(): Promise<JutsuCategoryRank[]> {
        try {
            const { data, error } = await supabase
                .from('jutsu_category_ranks')
                .select('*')
                .order('category_id', { ascending: true })
                .order('rank', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Erro ao buscar jutsu category ranks:', error);
            throw error;
        }
    }

    static async getByCategory(categoryId: string): Promise<JutsuCategoryRank[]> {
        try {
            console.log(`🔍 [API] Buscando ranks para categoria: ${categoryId}`);
            
            // Adicionar timeout para evitar que a query trave indefinidamente
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Timeout: A query demorou mais de 10 segundos')), 10000);
            });

            const queryPromise = supabase
                .from('jutsu_category_ranks')
                .select('*')
                .eq('category_id', categoryId)
                .order('rank', { ascending: true });

            const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

            if (error) {
                console.error(`❌ [API] Erro do Supabase ao buscar ranks:`, error);
                console.error(`❌ [API] Detalhes do erro:`, JSON.stringify(error, null, 2));
                // Retornar array vazio em vez de lançar erro
                return [];
            }

            console.log(`✅ [API] Ranks encontrados:`, data?.length || 0, 'ranks');
            if (data && data.length > 0) {
                console.log(`✅ [API] Primeiro rank:`, data[0]);
            }
            return data || [];
        } catch (error) {
            console.error(`❌ [API] Erro ao buscar ranks da categoria ${categoryId}:`, error);
            console.error(`❌ [API] Stack trace:`, error instanceof Error ? error.stack : 'N/A');
            // Retornar array vazio em vez de lançar erro para evitar que o hook trave
            return [];
        }
    }

    static async getByCategoryAndRank(categoryId: string, rank: JutsuRank): Promise<JutsuCategoryRank | null> {
        try {
            const { data, error } = await supabase
                .from('jutsu_category_ranks')
                .select('*')
                .eq('category_id', categoryId)
                .eq('rank', rank)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar rank ${rank} da categoria ${categoryId}:`, error);
            throw error;
        }
    }

    static async update(
        id: string,
        updates: Partial<Omit<JutsuCategoryRank, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<void> {
        try {
            const { error } = await supabase
                .from('jutsu_category_ranks')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error(`Erro ao atualizar jutsu category rank ${id}:`, error);
            throw error;
        }
    }
}

// ============================================================
// Jutsu Effects
// ============================================================

export class JutsuEffectsService {
    static async getAll(): Promise<JutsuEffect[]> {
        try {
            const { data, error } = await supabase
                .from('jutsu_effects')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Erro ao buscar jutsu effects:', error);
            throw error;
        }
    }

    static async getById(id: string): Promise<JutsuEffect | null> {
        try {
            const { data, error } = await supabase
                .from('jutsu_effects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar jutsu effect ${id}:`, error);
            throw error;
        }
    }

    static async create(effect: Omit<JutsuEffect, 'id' | 'created_at' | 'updated_at'>): Promise<JutsuEffect> {
        try {
            const { data, error } = await supabase
                .from('jutsu_effects')
                .insert(effect)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao criar jutsu effect:', error);
            throw error;
        }
    }

    static async update(
        id: string,
        updates: Partial<Omit<JutsuEffect, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<void> {
        try {
            const { error } = await supabase
                .from('jutsu_effects')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error(`Erro ao atualizar jutsu effect ${id}:`, error);
            throw error;
        }
    }

    static async delete(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('jutsu_effects')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error(`Erro ao deletar jutsu effect ${id}:`, error);
            throw error;
        }
    }
}

// ============================================================
// Resistance Difficulties
// ============================================================

export class ResistanceDifficultiesService {
    static async getAll(): Promise<ResistanceDifficulty[]> {
        try {
            const { data, error } = await supabase
                .from('resistance_difficulties')
                .select('*')
                .order('execucao', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Erro ao buscar resistance difficulties:', error);
            throw error;
        }
    }

    static async getByRank(rank: JutsuRank): Promise<ResistanceDifficulty | null> {
        try {
            const { data, error } = await supabase
                .from('resistance_difficulties')
                .select('*')
                .eq('rank', rank)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar resistance difficulty para ${rank}:`, error);
            throw error;
        }
    }

    static async update(rank: JutsuRank, execucao: number, rmRf: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('resistance_difficulties')
                .update({ execucao, rm_rf: rmRf })
                .eq('rank', rank);

            if (error) throw error;
        } catch (error) {
            console.error(`Erro ao atualizar resistance difficulty ${rank}:`, error);
            throw error;
        }
    }
}


