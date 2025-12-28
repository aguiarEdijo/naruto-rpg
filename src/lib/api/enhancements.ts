import { supabase } from '@/lib/supabase';

export interface Enhancement {
    id: number;
    nome: string;
    tipo: string;
    clan_restricao: string | null;
    rank_restricao: string | null;
    requisitos: any;
    custo: string | null;
    acoes: string | null;
    duracao: string | null;
    descricao: string;
    created_at: string;
    updated_at?: string;
}

export class EnhancementsService {
    /**
     * Busca todos os aprimoramentos
     */
    static async getAllEnhancements(): Promise<Enhancement[]> {
        try {
            const { data, error } = await supabase
                .from('enhancements')
                .select('*')
                .order('tipo', { ascending: true })
                .order('clan_restricao', { ascending: true })
                .order('nome', { ascending: true });

            if (error) {
                console.error('Erro ao buscar aprimoramentos:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no EnhancementsService.getAllEnhancements:', error);
            throw error;
        }
    }

    /**
     * Busca aprimoramentos por tipo
     */
    static async getEnhancementsByType(type: string): Promise<Enhancement[]> {
        try {
            const { data, error } = await supabase
                .from('enhancements')
                .select('*')
                .eq('tipo', type)
                .order('clan_restricao', { ascending: true })
                .order('nome', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar aprimoramentos do tipo ${type}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no EnhancementsService.getEnhancementsByType:', error);
            throw error;
        }
    }

    /**
     * Busca aprimoramentos por clã
     */
    static async getEnhancementsByClan(clan: string): Promise<Enhancement[]> {
        try {
            const { data, error } = await supabase
                .from('enhancements')
                .select('*')
                .eq('clan_restricao', clan)
                .order('rank_restricao', { ascending: true })
                .order('nome', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar aprimoramentos do clã ${clan}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no EnhancementsService.getEnhancementsByClan:', error);
            throw error;
        }
    }

    /**
     * Busca aprimoramentos gerais (sem restrição de clã)
     */
    static async getGeneralEnhancements(): Promise<Enhancement[]> {
        try {
            const { data, error } = await supabase
                .from('enhancements')
                .select('*')
                .or('clan_restricao.is.null,clan_restricao.eq.Geral')
                .order('nome', { ascending: true });

            if (error) {
                console.error('Erro ao buscar aprimoramentos gerais:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no EnhancementsService.getGeneralEnhancements:', error);
            throw error;
        }
    }

    /**
     * Busca um aprimoramento específico por nome
     */
    static async getEnhancementByName(name: string): Promise<Enhancement | null> {
        try {
            const { data, error } = await supabase
                .from('enhancements')
                .select('*')
                .eq('nome', name)
                .single();

            if (error) {
                console.error(`Erro ao buscar aprimoramento ${name}:`, error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro no EnhancementsService.getEnhancementByName:', error);
            return null;
        }
    }

    /**
     * Busca todos os clãs disponíveis
     */
    static async getAvailableClans(): Promise<string[]> {
        try {
            const { data, error } = await supabase
                .from('enhancements')
                .select('clan_restricao')
                .not('clan_restricao', 'is', null);

            if (error) {
                console.error('Erro ao buscar clãs:', error);
                throw error;
            }

            // Remover duplicatas e valores nulos
            const clans = [...new Set(data?.map(e => e.clan_restricao).filter(Boolean) || [])];
            return clans.sort();
        } catch (error) {
            console.error('Erro no EnhancementsService.getAvailableClans:', error);
            throw error;
        }
    }

    /**
     * Busca estatísticas dos aprimoramentos
     */
    static async getEnhancementsStatistics(): Promise<Record<string, { count: number; enhancements: string[] }>> {
        try {
            const { data, error } = await supabase
                .from('enhancements')
                .select('tipo, clan_restricao, nome')
                .order('tipo', { ascending: true });

            if (error) {
                console.error('Erro ao buscar estatísticas de aprimoramentos:', error);
                throw error;
            }

            const stats: Record<string, { count: number; enhancements: string[] }> = {};

            data?.forEach((enhancement) => {
                const key = enhancement.clan_restricao || 'Geral';
                if (!stats[key]) {
                    stats[key] = {
                        count: 0,
                        enhancements: []
                    };
                }
                stats[key].count++;
                stats[key].enhancements.push(enhancement.nome);
            });

            return stats;
        } catch (error) {
            console.error('Erro no EnhancementsService.getEnhancementsStatistics:', error);
            throw error;
        }
    }

    // ========== Métodos CRUD para GM ==========

    /**
     * Cria um novo aprimoramento
     */
    static async createEnhancement(enhancement: Omit<Enhancement, 'id' | 'created_at'>): Promise<Enhancement> {
        try {
            const { data, error } = await supabase
                .from('enhancements')
                .insert(enhancement)
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar aprimoramento:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no EnhancementsService.createEnhancement:', error);
            throw error;
        }
    }

    /**
     * Atualiza um aprimoramento existente
     */
    static async updateEnhancement(id: number, updates: Partial<Omit<Enhancement, 'id' | 'created_at'>>): Promise<Enhancement> {
        try {
            const { data, error } = await supabase
                .from('enhancements')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Erro ao atualizar aprimoramento:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no EnhancementsService.updateEnhancement:', error);
            throw error;
        }
    }

    /**
     * Deleta um aprimoramento
     */
    static async deleteEnhancement(id: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('enhancements')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Erro ao deletar aprimoramento:', error);
                throw error;
            }
        } catch (error) {
            console.error('Erro no EnhancementsService.deleteEnhancement:', error);
            throw error;
        }
    }
}


