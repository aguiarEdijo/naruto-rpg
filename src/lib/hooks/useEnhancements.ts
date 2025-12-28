import { useState, useEffect } from 'react';
import { EnhancementsService, Enhancement } from '@/lib/api/enhancements';
import { simpleCache } from '@/lib/cache';

export const useEnhancements = () => {
    const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEnhancements = async (forceReload = false) => {
        try {
            // Verificar cache (pode ser bypassado)
            const cached = simpleCache.get<Enhancement[]>('enhancements', forceReload);
            if (cached && !forceReload) {
                setEnhancements(cached);
                setLoading(false);
                return;
            }

            setLoading(true);
            const data = await EnhancementsService.getAllEnhancements();

            // Armazenar no cache
            simpleCache.set('enhancements', data);

            setEnhancements(data);
        } catch (err) {
            console.error('Failed to fetch enhancements:', err);
            setError('Failed to load enhancements data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnhancements();
    }, []);

    // Função para forçar reload
    const reload = () => {
        simpleCache.invalidate('enhancements');
        fetchEnhancements(true);
    };

    // Agrupar aprimoramentos por tipo e clã
    const enhancementsByType = enhancements.reduce((acc, enhancement) => {
        const key = enhancement.clan_restricao || 'Geral';
        // Normalizar a chave (case-insensitive para evitar problemas)
        const normalizedKey = key === null || key === '' ? 'Geral' : key.trim();
        if (!acc[normalizedKey]) {
            acc[normalizedKey] = [];
        }
        acc[normalizedKey].push(enhancement);
        return acc;
    }, {} as Record<string, Enhancement[]>);

    // Obter aprimoramentos por clã
    const getByClan = (clan: string): Enhancement[] => {
        // Normalizar o nome do clã para busca (case-insensitive)
        const normalizedClan = clan ? clan.trim() : '';
        
        // Buscar exato primeiro
        let result = enhancementsByType[normalizedClan] || [];
        
        // Se não encontrou, tentar case-insensitive
        if (result.length === 0 && normalizedClan) {
            const foundKey = Object.keys(enhancementsByType).find(
                key => key && key.toLowerCase() === normalizedClan.toLowerCase()
            );
            if (foundKey) {
                result = enhancementsByType[foundKey] || [];
            }
        }
        
        // Debug log
        if (normalizedClan && result.length === 0) {
            console.log('⚠️ Nenhum aprimoramento encontrado para clã:', {
                buscado: normalizedClan,
                disponíveis: Object.keys(enhancementsByType),
                todos: enhancements.filter(e => e.clan_restricao).map(e => e.clan_restricao)
            });
        }
        
        return result;
    };

    // Obter aprimoramentos gerais
    const getGeneral = (): Enhancement[] => {
        return enhancementsByType['Geral'] || [];
    };

    // Obter cores para cada clã
    const getClanColor = (clan: string | null): string => {
        const clanColors: Record<string, string> = {
            'Aburame': 'bg-green-50 border-green-200 text-green-800',
            'Akimichi': 'bg-yellow-50 border-yellow-200 text-yellow-800',
            'Hyuga': 'bg-blue-50 border-blue-200 text-blue-800',
            'Inuzuka': 'bg-orange-50 border-orange-200 text-orange-800',
            'Nara': 'bg-purple-50 border-purple-200 text-purple-800',
            'Senju': 'bg-emerald-50 border-emerald-200 text-emerald-800',
            'Uchiha': 'bg-red-50 border-red-200 text-red-800',
            'Uzumaki': 'bg-pink-50 border-pink-200 text-pink-800',
            'Yamanaka': 'bg-indigo-50 border-indigo-200 text-indigo-800',
            'Geral': 'bg-gray-50 border-gray-200 text-gray-800'
        };
        return clanColors[clan || 'Geral'] || 'bg-gray-50 border-gray-200 text-gray-800';
    };

    // Obter ícones para cada clã
    const getClanIcon = (clan: string | null): string => {
        const clanIcons: Record<string, string> = {
            'Aburame': '🪲',
            'Akimichi': '🍖',
            'Hyuga': '👁️',
            'Inuzuka': '🐺',
            'Nara': '🦌',
            'Senju': '🌿',
            'Uchiha': '🔥',
            'Uzumaki': '🔄',
            'Yamanaka': '🧠',
            'Geral': '⚙️'
        };
        return clanIcons[clan || 'Geral'] || '📋';
    };

    // Formatar requisitos
    const formatRequisitos = (requisitos: any): string => {
        if (!requisitos || !Array.isArray(requisitos)) return '';

        return requisitos.map((req: any) => {
            if (req.pericia) return `${req.pericia} ${req.valor}+`;
            if (req.atributo) return `${req.atributo} ${req.valor}+`;
            if (req.aprimoramento) return req.aprimoramento;
            if (req.clã_restricao) return req.clã_restricao;
            return '';
        }).filter(Boolean).join(', ');
    };

    return {
        enhancements,
        enhancementsByType,
        loading,
        error,
        getByClan,
        getGeneral,
        getClanColor,
        getClanIcon,
        formatRequisitos,
        reload // Exportar função de reload
    };
};
