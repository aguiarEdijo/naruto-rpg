import { supabase } from '@/lib/supabase';

export interface Attribute {
    id: number;
    nome: string;
    abreviacao: string;
    categoria: string;
    descricao: string;
    created_at: string;
}

export class AttributesService {
    /**
     * Busca todos os atributos
     */
    static async getAllAttributes(): Promise<Attribute[]> {
        try {
            const { data, error } = await supabase
                .from('attributes')
                .select('*')
                .order('categoria', { ascending: true })
                .order('nome', { ascending: true });

            if (error) {
                console.error('Erro ao buscar atributos:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no AttributesService.getAllAttributes:', error);
            throw error;
        }
    }

    /**
     * Busca atributos por categoria
     */
    static async getAttributesByCategory(category: string): Promise<Attribute[]> {
        try {
            const { data, error } = await supabase
                .from('attributes')
                .select('*')
                .eq('categoria', category)
                .order('nome', { ascending: true });

            if (error) {
                console.error(`Erro ao buscar atributos da categoria ${category}:`, error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no AttributesService.getAttributesByCategory:', error);
            throw error;
        }
    }

    /**
     * Busca um atributo específico por abreviação
     */
    static async getAttributeByAbbreviation(abbreviation: string): Promise<Attribute | null> {
        try {
            const { data, error } = await supabase
                .from('attributes')
                .select('*')
                .eq('abreviacao', abbreviation)
                .single();

            if (error) {
                console.error(`Erro ao buscar atributo ${abbreviation}:`, error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro no AttributesService.getAttributeByAbbreviation:', error);
            return null;
        }
    }

    /**
     * Busca todas as categorias disponíveis
     */
    static async getCategories(): Promise<string[]> {
        try {
            const { data, error } = await supabase
                .from('attributes')
                .select('categoria')
                .order('categoria', { ascending: true });

            if (error) {
                console.error('Erro ao buscar categorias:', error);
                throw error;
            }

            // Remover duplicatas
            const categories = [...new Set(data?.map(attr => attr.categoria) || [])];
            return categories;
        } catch (error) {
            console.error('Erro no AttributesService.getCategories:', error);
            throw error;
        }
    }

    /**
     * Busca estatísticas dos atributos por categoria
     */
    static async getAttributesStatistics(): Promise<Record<string, { count: number; attributes: string[] }>> {
        try {
            const { data, error } = await supabase
                .from('attributes')
                .select('categoria, abreviacao')
                .order('categoria', { ascending: true });

            if (error) {
                console.error('Erro ao buscar estatísticas de atributos:', error);
                throw error;
            }

            const stats: Record<string, { count: number; attributes: string[] }> = {};

            data?.forEach((attr) => {
                if (!stats[attr.categoria]) {
                    stats[attr.categoria] = {
                        count: 0,
                        attributes: []
                    };
                }
                stats[attr.categoria].count++;
                stats[attr.categoria].attributes.push(attr.abreviacao);
            });

            return stats;
        } catch (error) {
            console.error('Erro no AttributesService.getAttributesStatistics:', error);
            throw error;
        }
    }
}


