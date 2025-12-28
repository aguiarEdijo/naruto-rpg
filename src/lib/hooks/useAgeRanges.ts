import { useState, useEffect } from 'react';
import { AgeRangesService, AgeRange } from '@/lib/api/ageRanges';
import { simpleCache } from '@/lib/cache';

export const useAgeRanges = () => {
    const [ageRanges, setAgeRanges] = useState<AgeRange[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAgeRanges = async () => {
            try {
                // Verificar cache
                const cached = simpleCache.get<AgeRange[]>('age_ranges');
                if (cached) {
                    setAgeRanges(cached);
                    setLoading(false);
                    return;
                }

                setLoading(true);
                const data = await AgeRangesService.getAllAgeRanges();

                // Armazenar no cache
                simpleCache.set('age_ranges', data);

                setAgeRanges(data);
            } catch (err) {
                console.error('Failed to fetch age ranges:', err);
                setError('Failed to load age ranges data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAgeRanges();
    }, []);

    // Buscar faixa etária por idade
    const getAgeRangeByAge = async (age: number): Promise<AgeRange | null> => {
        // Tentar usar cache primeiro
        const cachedRange = ageRanges.find(
            ar => age >= ar.idade_minima && (ar.idade_maxima === null || age <= ar.idade_maxima)
        );
        if (cachedRange) return cachedRange;

        // Buscar no banco
        return await AgeRangesService.getAgeRangeByAge(age);
    };

    // Buscar faixa etária por nome
    const getAgeRangeByName = (name: string): AgeRange | undefined => {
        return ageRanges.find(ar => ar.faixa_etaria === name);
    };

    // Obter modificadores de uma faixa etária
    const getModifiers = (ageRange: AgeRange | null) => {
        if (!ageRange) return null;
        return AgeRangesService.getModifiers(ageRange);
    };

    // Obter intervalo formatado
    const getFormattedInterval = (ageRange: AgeRange | null): string => {
        if (!ageRange) return '';
        return AgeRangesService.getFormattedInterval(ageRange);
    };

    // Obter faixa etária a partir de uma idade
    const findAgeRange = (age: number): AgeRange | undefined => {
        return ageRanges.find(
            ar => age >= ar.idade_minima && (ar.idade_maxima === null || age <= ar.idade_maxima)
        );
    };

    return {
        ageRanges,
        loading,
        error,
        getAgeRangeByAge,
        getAgeRangeByName,
        getModifiers,
        getFormattedInterval,
        findAgeRange
    };
};



