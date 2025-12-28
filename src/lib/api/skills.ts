import { supabase } from '@/lib/supabase';

export interface Skill {
    id: number;
    nome: string;
    atributo_base: string;
    descricao: string;
    created_at: string;
    updated_at?: string;
}

export class SkillsService {
    /**
     * Busca todas as perícias
     */
    static async getAllSkills(): Promise<Skill[]> {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .order('atributo_base', { ascending: true })
                .order('nome', { ascending: true });

            if (error) {
                console.error('Erro ao buscar perícias:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no SkillsService.getAllSkills:', error);
            throw error;
        }
    }

    /**
     * Busca perícias por atributo base
     */
    static async getSkillsByAttribute(attribute: string): Promise<Skill[]> {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .eq('atributo_base', attribute)
                .order('nome', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar perícias do atributo ${attribute}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no SkillsService.getSkillsByAttribute:', error);
            throw error;
        }
    }

    /**
     * Busca uma perícia específica por nome
     */
    static async getSkillByName(name: string): Promise<Skill | null> {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .eq('nome', name)
                .single();

            if (error) {
                console.error(`Erro ao buscar perícia ${name}:`, error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro no SkillsService.getSkillByName:', error);
            return null;
        }
    }

    /**
     * Busca todos os atributos base disponíveis
     */
    static async getAvailableAttributes(): Promise<string[]> {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('atributo_base')
                .order('atributo_base', { ascending: true });

            if (error) {
                console.error('Erro ao buscar atributos base:', error);
                throw error;
            }

            // Remover duplicatas
            const attributes = [...new Set(data?.map(skill => skill.atributo_base) || [])];
            return attributes;
        } catch (error) {
            console.error('Erro no SkillsService.getAvailableAttributes:', error);
            throw error;
        }
    }

    /**
     * Busca estatísticas das perícias por atributo
     */
    static async getSkillsStatistics(): Promise<Record<string, { count: number; skills: string[] }>> {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('atributo_base, nome')
                .order('atributo_base', { ascending: true });

            if (error) {
                console.error('Erro ao buscar estatísticas de perícias:', error);
                throw error;
            }

            const stats: Record<string, { count: number; skills: string[] }> = {};

            data?.forEach((skill) => {
                if (!stats[skill.atributo_base]) {
                    stats[skill.atributo_base] = {
                        count: 0,
                        skills: []
                    };
                }
                stats[skill.atributo_base].count++;
                stats[skill.atributo_base].skills.push(skill.nome);
            });

            return stats;
        } catch (error) {
            console.error('Erro no SkillsService.getSkillsStatistics:', error);
            throw error;
        }
    }

    // ========== Métodos CRUD para GM ==========

    /**
     * Cria uma nova perícia
     */
    static async createSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> {
        try {
            const { data, error } = await supabase
                .from('skills')
                .insert(skill)
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar perícia:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no SkillsService.createSkill:', error);
            throw error;
        }
    }

    /**
     * Atualiza uma perícia existente
     */
    static async updateSkill(id: number, updates: Partial<Omit<Skill, 'id' | 'created_at'>>): Promise<Skill> {
        try {
            const { data, error } = await supabase
                .from('skills')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Erro ao atualizar perícia:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erro no SkillsService.updateSkill:', error);
            throw error;
        }
    }

    /**
     * Deleta uma perícia
     */
    static async deleteSkill(id: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('skills')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Erro ao deletar perícia:', error);
                throw error;
            }
        } catch (error) {
            console.error('Erro no SkillsService.deleteSkill:', error);
            throw error;
        }
    }
}


