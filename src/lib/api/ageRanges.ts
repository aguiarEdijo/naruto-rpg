import { supabase } from '@/lib/supabase';

export interface AgeRange {
    id: number;
    faixa_etaria: string;
    idade_minima: number;
    idade_maxima: number | null;
    descricao: string;
    modificador_for: number;
    modificador_vig: number;
    modificador_agi: number;
    modificador_int: number;
    modificador_per: number;
    modificador_ess: number;
    modificador_inf: number;
    created_at: string;
}

export class AgeRangesService {
    /**
     * Busca todas as faixas etárias
     */
    static async getAllAgeRanges(): Promise<AgeRange[]> {
        try {
            const { data, error } = await supabase
                .from('age_ranges')
                .select('*')
                .order('idade_minima', { ascending: true });

            if (error) {
                console.error('Erro ao buscar faixas etárias:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Erro no AgeRangesService.getAllAgeRanges:', error);
            throw error;
        }
    }

    /**
     * Busca faixa etária por idade
     */
    static async getAgeRangeByAge(age: number): Promise<AgeRange | null> {
        try {
            const { data, error } = await supabase
                .from('age_ranges')
                .select('*')
                .lte('idade_minima', age)
                .or(`idade_maxima.gte.${age},idade_maxima.is.null`)
                .single();

            if (error) {
                console.error(`Erro ao buscar faixa etária para idade ${age}:`, error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro no AgeRangesService.getAgeRangeByAge:', error);
            return null;
        }
    }

    /**
     * Busca faixa etária por nome
     */
    static async getAgeRangeByName(name: string): Promise<AgeRange | null> {
        try {
            const { data, error } = await supabase
                .from('age_ranges')
                .select('*')
                .eq('faixa_etaria', name)
                .single();

            if (error) {
                console.error(`Erro ao buscar faixa etária ${name}:`, error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Erro no AgeRangesService.getAgeRangeByName:', error);
            return null;
        }
    }

    /**
     * Obter modificadores de uma faixa etária
     */
    static getModifiers(ageRange: AgeRange) {
        return {
            FOR: ageRange.modificador_for,
            VIG: ageRange.modificador_vig,
            AGI: ageRange.modificador_agi,
            INT: ageRange.modificador_int,
            PER: ageRange.modificador_per,
            ESS: ageRange.modificador_ess,
            INF: ageRange.modificador_inf
        };
    }

    /**
     * Obter intervalo de anos formatado
     */
    static getFormattedInterval(ageRange: AgeRange): string {
        if (ageRange.idade_maxima === null) {
            return `${ageRange.idade_minima}+ anos`;
        }
        return `${ageRange.idade_minima}-${ageRange.idade_maxima} anos`;
    }
}

