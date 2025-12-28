import { supabase } from '@/lib/supabase';

export interface Defect {
    id: number;
    nome: string;
    tipo: string;
    descricao: string;
    created_at: string;
    updated_at?: string;
}

export class DefectsService {
    /**
     * Busca todos os defeitos
     */
    static async getAllDefects(): Promise<Defect[]> {
        try {
            const { data, error } = await supabase
                .from('defects')
                .select('*')
                .order('tipo', { ascending: true })
                .order('nome', { ascending: true });

            if (error) {
                console.error('Erro ao buscar defeitos:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no DefectsService.getAllDefects:', error);
            throw error;
        }
    }

    /**
     * Busca defeitos por tipo
     */
    static async getDefectsByType(type: string): Promise<Defect[]> {
        try {
            const { data, error } = await supabase
                .from('defects')
                .select('*')
                .eq('tipo', type)
                .order('nome', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar defeitos do tipo ${type}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no DefectsService.getDefectsByType:', error);
            throw error;
        }
    }

    /**
     * Busca um defeito específico por nome
     */
    static async getDefectByName(name: string): Promise<Defect | null> {
        try {
            const { data, error } = await supabase
                .from('defects')
                .select('*')
                .eq('nome', name)
                .single();

            if (error) {
                console.error(`Erro ao buscar defeito ${name}:`, error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro no DefectsService.getDefectByName:', error);
            return null;
        }
    }

    /**
     * Busca todos os tipos de defeitos disponíveis
     */
    static async getDefectTypes(): Promise<string[]> {
        try {
            const { data, error } = await supabase
                .from('defects')
                .select('tipo')
                .order('tipo', { ascending: true });

            if (error) {
                console.error('Erro ao buscar tipos de defeitos:', error);
                throw error;
            }

            // Remover duplicatas
            const types = [...new Set(data?.map(defect => defect.tipo) || [])];
            return types;
        } catch (error) {
            console.error('Erro no DefectsService.getDefectTypes:', error);
            throw error;
        }
    }

    /**
     * Busca estatísticas dos defeitos por tipo
     */
    static async getDefectsStatistics(): Promise<Record<string, { count: number; defects: string[] }>> {
        try {
            const { data, error } = await supabase
                .from('defects')
                .select('tipo, nome')
                .order('tipo', { ascending: true });

            if (error) {
                console.error('Erro ao buscar estatísticas de defeitos:', error);
                throw error;
            }

            const stats: Record<string, { count: number; defects: string[] }> = {};

            data?.forEach((defect) => {
                if (!stats[defect.tipo]) {
                    stats[defect.tipo] = {
                        count: 0,
                        defects: []
                    };
                }
                stats[defect.tipo].count++;
                stats[defect.tipo].defects.push(defect.nome);
            });

            return stats;
        } catch (error) {
            console.error('Erro no DefectsService.getDefectsStatistics:', error);
            throw error;
        }
    }

    /**
     * Busca defeitos relacionados a clãs específicos
     */
    static async getDefectsByClan(clanName: string): Promise<Defect[]> {
        try {
            const { data, error } = await supabase
                .from('defects')
                .select('*')
                .ilike('descricao', `%${clanName}%`)
                .order('nome', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar defeitos do clã ${clanName}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no DefectsService.getDefectsByClan:', error);
            throw error;
        }
    }

    // ========== Métodos CRUD para GM ==========

    /**
     * Cria um novo defeito
     */
    static async createDefect(defect: Omit<Defect, 'id' | 'created_at'>): Promise<Defect> {
        try {
            const { data, error } = await supabase
                .from('defects')
                .insert(defect)
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar defeito:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no DefectsService.createDefect:', error);
            throw error;
        }
    }

    /**
     * Atualiza um defeito existente
     */
    static async updateDefect(id: number, updates: Partial<Omit<Defect, 'id' | 'created_at'>>): Promise<Defect> {
        try {
            const { data, error } = await supabase
                .from('defects')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Erro ao atualizar defeito:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no DefectsService.updateDefect:', error);
            throw error;
        }
    }

    /**
     * Deleta um defeito
     */
    static async deleteDefect(id: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('defects')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Erro ao deletar defeito:', error);
                throw error;
            }
        } catch (error) {
            console.error('Erro no DefectsService.deleteDefect:', error);
            throw error;
        }
    }
}


