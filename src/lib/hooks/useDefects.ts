import { useState, useEffect } from 'react';
import { DefectsService, Defect } from '@/lib/api/defects';
import { simpleCache } from '@/lib/cache';

export const useDefects = () => {
    const [defects, setDefects] = useState<Defect[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDefects = async (forceReload = false) => {
        try {
            // Verificar cache (pode ser bypassado)
            const cached = simpleCache.get<Defect[]>('defects', forceReload);
            if (cached && !forceReload) {
                setDefects(cached);
                setLoading(false);
                return;
            }

            setLoading(true);
            const data = await DefectsService.getAllDefects();

            // Armazenar no cache
            simpleCache.set('defects', data);

            setDefects(data);
        } catch (err) {
            console.error('Failed to fetch defects:', err);
            setError('Failed to load defects data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDefects();
    }, []);

    // Função para forçar reload
    const reload = () => {
        simpleCache.invalidate('defects');
        fetchDefects(true);
    };

    // Agrupar defeitos por tipo
    const defectsByType = defects.reduce((acc, defect) => {
        if (!acc[defect.tipo]) {
            acc[defect.tipo] = [];
        }
        acc[defect.tipo].push(defect);
        return acc;
    }, {} as Record<string, Defect[]>);

    // Obter cores para cada tipo de defeito
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Mecânico':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'Compulsão':
                return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'Compulsão/Mental':
                return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'Emocional':
                return 'bg-purple-50 border-purple-200 text-purple-800';
            case 'Emocional/Obrigação':
                return 'bg-purple-50 border-purple-200 text-purple-800';
            case 'Emocional/Social':
                return 'bg-purple-50 border-purple-200 text-purple-800';
            case 'Obrigação/Emocional':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'Social':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'Social/Emocional':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'Comportamental':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'Mecânico/Mental':
                return 'bg-red-50 border-red-200 text-red-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    // Obter ícones para cada tipo de defeito
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Mecânico':
            case 'Mecânico/Mental':
                return '⚙️';
            case 'Compulsão':
            case 'Compulsão/Mental':
                return '🔄';
            case 'Emocional':
            case 'Emocional/Obrigação':
            case 'Emocional/Social':
                return '💭';
            case 'Obrigação/Emocional':
                return '📋';
            case 'Social':
            case 'Social/Emocional':
                return '👥';
            case 'Comportamental':
                return '🎭';
            default:
                return '⚠️';
        }
    };

    // Função para buscar defeitos por tipo
    const getDefectsByType = (type: string): Defect[] => {
        return defectsByType[type] || [];
    };

    // Função para buscar defeitos relacionados a um clã
    const getDefectsByClan = (clanName: string): Defect[] => {
        return defects.filter(defect =>
            defect.descricao.toLowerCase().includes(clanName.toLowerCase())
        );
    };

    return {
        defects,
        defectsByType,
        loading,
        error,
        getTypeColor,
        getTypeIcon,
        getDefectsByType,
        getDefectsByClan,
        reload // Exportar função de reload
    };
};
