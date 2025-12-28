import { supabase } from '@/lib/supabase';

export interface Jutsu {
    id: number;
    nome: string;
    tipo_jutsu: 'Ninjutsu' | 'Taijutsu' | 'Genjutsu';
    subtipo: string | null;
    rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
    custo_chakra: string;
    acao: string;
    duracao: string;
    restricao: string | null;
    descricao: string;
    created_at: string;
    updated_at?: string;
}

export class JutsusService {
    /**
     * Busca todos os jutsus
     */
    static async getAllJutsus(): Promise<Jutsu[]> {
        try {
            const { data, error } = await supabase
                .from('jutsus')
                .select('*')
                .order('tipo_jutsu', { ascending: true })
                .order('rank', { ascending: true })
                .order('nome', { ascending: true });

            if (error) {
                console.error('Erro ao buscar jutsus:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no JutsusService.getAllJutsus:', error);
            throw error;
        }
    }

    /**
     * Busca jutsus por tipo
     */
    static async getJutsusByType(tipo: 'Ninjutsu' | 'Taijutsu' | 'Genjutsu'): Promise<Jutsu[]> {
        try {
            const { data, error } = await supabase
                .from('jutsus')
                .select('*')
                .eq('tipo_jutsu', tipo)
                .order('rank', { ascending: true })
                .order('nome', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar jutsus do tipo ${tipo}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no JutsusService.getJutsusByType:', error);
            throw error;
        }
    }

    /**
     * Busca jutsus por rank
     */
    static async getJutsusByRank(rank: string): Promise<Jutsu[]> {
        try {
            const { data, error } = await supabase
                .from('jutsus')
                .select('*')
                .eq('rank', rank)
                .order('tipo_jutsu', { ascending: true })
                .order('nome', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar jutsus do rank ${rank}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no JutsusService.getJutsusByRank:', error);
            throw error;
        }
    }

    /**
     * Busca um jutsu específico por nome
     */
    static async getJutsuByName(name: string): Promise<Jutsu | null> {
        try {
            const { data, error } = await supabase
                .from('jutsus')
                .select('*')
                .eq('nome', name)
                .single();

            if (error) {
                console.error(`Erro ao buscar jutsu ${name}:`, error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro no JutsusService.getJutsuByName:', error);
            return null;
        }
    }

    /**
     * Busca jutsus por subtipo
     */
    static async getJutsusBySubtipo(subtipo: string): Promise<Jutsu[]> {
        try {
            const { data, error } = await supabase
                .from('jutsus')
                .select('*')
                .eq('subtipo', subtipo)
                .order('rank', { ascending: true })
                .order('nome', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar jutsus do subtipo ${subtipo}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no JutsusService.getJutsusBySubtipo:', error);
            throw error;
        }
    }

    /**
     * Busca estatísticas dos jutsus
     */
    static async getJutsusStatistics(): Promise<{
        total: number;
        byType: Record<string, number>;
        byRank: Record<string, number>;
    }> {
        try {
            const allJutsus = await this.getAllJutsus();

            const byType: Record<string, number> = {};
            const byRank: Record<string, number> = {};

            allJutsus.forEach(jutsu => {
                byType[jutsu.tipo_jutsu] = (byType[jutsu.tipo_jutsu] || 0) + 1;
                byRank[jutsu.rank] = (byRank[jutsu.rank] || 0) + 1;
            });

            return {
                total: allJutsus.length,
                byType,
                byRank
            };
        } catch (error) {
            console.error('Erro no JutsusService.getJutsusStatistics:', error);
            throw error;
        }
    }

    // ========== Métodos CRUD para GM ==========

    /**
     * Cria um novo jutsu
     */
    static async createJutsu(jutsu: Omit<Jutsu, 'id' | 'created_at' | 'updated_at'>): Promise<Jutsu> {
        try {
            const { data, error } = await supabase
                .from('jutsus')
                .insert(jutsu)
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar jutsu:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no JutsusService.createJutsu:', error);
            throw error;
        }
    }

    /**
     * Atualiza um jutsu existente
     */
    static async updateJutsu(id: number, updates: Partial<Omit<Jutsu, 'id' | 'created_at' | 'updated_at'>>): Promise<Jutsu> {
        try {
            const { data, error } = await supabase
                .from('jutsus')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Erro ao atualizar jutsu:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no JutsusService.updateJutsu:', error);
            throw error;
        }
    }

    /**
     * Deleta um jutsu
     */
    static async deleteJutsu(id: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('jutsus')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Erro ao deletar jutsu:', error);
                throw error;
            }
        } catch (error) {
            console.error('Erro no JutsusService.deleteJutsu:', error);
            throw error;
        }
    }
}

