import { supabase } from '@/lib/supabase';

export interface LevelProgression {
    id: number;
    level: number;
    rank: string;
    dice_evolution: string;
    attribute_points: string;
    skill_points: string;
    total_skill_gain: number;
    created_at: string;
    updated_at?: string;
}

export class LevelProgressionService {
    /**
     * Busca todos os níveis de progressão
     */
    static async getAllLevels(): Promise<LevelProgression[]> {
        try {
            const { data, error } = await supabase
                .from('level_progression')
                .select('*')
                .order('level', { ascending: true });

            if (error) {
                console.error('Erro ao buscar níveis de progressão:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no LevelProgressionService.getAllLevels:', error);
            throw error;
        }
    }

    /**
     * Busca informações de um nível específico
     */
    static async getLevelInfo(level: number): Promise<LevelProgression | null> {
        try {
            const { data, error } = await supabase
                .from('level_progression')
                .select('*')
                .eq('level', level)
                .single();

            if (error) {
                console.error(`Erro ao buscar nível ${level}:`, error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro no LevelProgressionService.getLevelInfo:', error);
            return null;
        }
    }

    /**
     * Busca todos os níveis de uma patente específica
     */
    static async getLevelsByRank(rank: string): Promise<LevelProgression[]> {
        try {
            const { data, error } = await supabase
                .from('level_progression')
                .select('*')
                .eq('rank', rank)
                .order('level', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar níveis da patente ${rank}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no LevelProgressionService.getLevelsByRank:', error);
            throw error;
        }
    }

    /**
     * Busca informações de evolução de dados por faixa de nível
     */
    static async getDiceEvolutionByLevelRange(minLevel: number, maxLevel: number): Promise<LevelProgression[]> {
        try {
            const { data, error } = await supabase
                .from('level_progression')
                .select('*')
                .gte('level', minLevel)
                .lte('level', maxLevel)
                .order('level', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar evolução de dados (${minLevel}-${maxLevel}):`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no LevelProgressionService.getDiceEvolutionByLevelRange:', error);
            throw error;
        }
    }

    /**
     * Busca estatísticas de progressão por patente
     */
    static async getRankStatistics(): Promise<Record<string, { minLevel: number; maxLevel: number; totalLevels: number }>> {
        try {
            const { data, error } = await supabase
                .from('level_progression')
                .select('rank, level')
                .order('level', { ascending: true });

            if (error) {
                console.error('Erro ao buscar estatísticas de patente:', error);
                throw error;
            }

            const stats: Record<string, { minLevel: number; maxLevel: number; totalLevels: number }> = {};

            data?.forEach((item) => {
                if (!stats[item.rank]) {
                    stats[item.rank] = {
                        minLevel: item.level,
                        maxLevel: item.level,
                        totalLevels: 0
                    };
                }

                stats[item.rank].minLevel = Math.min(stats[item.rank].minLevel, item.level);
                stats[item.rank].maxLevel = Math.max(stats[item.rank].maxLevel, item.level);
                stats[item.rank].totalLevels++;
            });

            return stats;
        } catch (error) {
            console.error('Erro no LevelProgressionService.getRankStatistics:', error);
            throw error;
        }
    }

    // ========== Métodos CRUD para GM ==========

    /**
     * Cria um novo nível de progressão
     */
    static async createLevel(level: Omit<LevelProgression, 'id' | 'created_at'>): Promise<LevelProgression> {
        try {
            const { data, error } = await supabase
                .from('level_progression')
                .insert(level)
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar nível:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no LevelProgressionService.createLevel:', error);
            throw error;
        }
    }

    /**
     * Atualiza um nível de progressão existente
     */
    static async updateLevel(id: number, updates: Partial<Omit<LevelProgression, 'id' | 'created_at'>>): Promise<LevelProgression> {
        try {
            const { data, error } = await supabase
                .from('level_progression')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Erro ao atualizar nível:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no LevelProgressionService.updateLevel:', error);
            throw error;
        }
    }

    /**
     * Deleta um nível de progressão
     */
    static async deleteLevel(id: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('level_progression')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Erro ao deletar nível:', error);
                throw error;
            }
        } catch (error) {
            console.error('Erro no LevelProgressionService.deleteLevel:', error);
            throw error;
        }
    }
}


