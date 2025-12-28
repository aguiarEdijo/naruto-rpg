import { supabase } from '@/lib/supabase';

export interface Clan {
    id: number;
    nome: string;
    descricao: string;
    modificador_for: number;
    modificador_vig: number;
    modificador_agi: number;
    modificador_int: number;
    modificador_per: number;
    modificador_ess: number;
    modificador_inf: number;
    qualidade_inicial: string | null;
    defeitos_iniciais: string | null;
    bonus_iniciais: string | null;
    foco_atributos: string;
    created_at: string;
    updated_at?: string;
}

export class ClansService {
    /**
     * Busca todos os clãs
     */
    static async getAllClans(): Promise<Clan[]> {
        try {
            const { data, error } = await supabase
                .from('clans')
                .select('*')
                .order('nome', { ascending: true });

            if (error) {
                console.error('Erro ao buscar clãs:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no ClansService.getAllClans:', error);
            throw error;
        }
    }

    /**
     * Busca um clã específico por nome
     */
    static async getClanByName(name: string): Promise<Clan | null> {
        try {
            const { data, error } = await supabase
                .from('clans')
                .select('*')
                .eq('nome', name)
                .single();

            if (error) {
                console.error(`Erro ao buscar clã ${name}:`, error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro no ClansService.getClanByName:', error);
            return null;
        }
    }

    /**
     * Busca clãs por qualidade inicial
     */
    static async getClansByQualidadeInicial(qualidade: string): Promise<Clan[]> {
        try {
            const { data, error } = await supabase
                .from('clans')
                .select('*')
                .eq('qualidade_inicial', qualidade)
                .order('nome', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar clãs por qualidade ${qualidade}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no ClansService.getClansByQualidadeInicial:', error);
            throw error;
        }
    }

    /**
     * Estatísticas dos clãs
     */
    static async getClansStatistics(): Promise<{ total: number; clans: string[] }> {
        try {
            const { data, error } = await supabase
                .from('clans')
                .select('nome');

            if (error) {
                console.error('Erro ao buscar estatísticas de clãs:', error);
                throw error;
            }

            return {
                total: data?.length || 0,
                clans: data?.map(c => c.nome) || []
            };
        } catch (error) {
            console.error('Erro no ClansService.getClansStatistics:', error);
            throw error;
        }
    }

    // ========== Métodos CRUD para GM ==========

    /**
     * Cria um novo clã
     */
    static async createClan(clan: Omit<Clan, 'id' | 'created_at'>): Promise<Clan> {
        try {
            const { data, error } = await supabase
                .from('clans')
                .insert(clan)
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar clã:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no ClansService.createClan:', error);
            throw error;
        }
    }

    /**
     * Atualiza um clã existente
     */
    static async updateClan(id: number, updates: Partial<Omit<Clan, 'id' | 'created_at'>>): Promise<Clan> {
        try {
            const { data, error } = await supabase
                .from('clans')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Erro ao atualizar clã:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no ClansService.updateClan:', error);
            throw error;
        }
    }

    /**
     * Deleta um clã
     */
    static async deleteClan(id: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('clans')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Erro ao deletar clã:', error);
                throw error;
            }
        } catch (error) {
            console.error('Erro no ClansService.deleteClan:', error);
            throw error;
        }
    }
}



