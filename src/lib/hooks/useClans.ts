import { useState, useEffect } from 'react';
import { ClansService, Clan } from '@/lib/api/clans';
import { simpleCache } from '@/lib/cache';

export const useClans = () => {
    const [clans, setClans] = useState<Clan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClans = async (forceReload = false) => {
        try {
            // Verificar cache (pode ser bypassado)
            const cached = simpleCache.get<Clan[]>('clans', forceReload);
            if (cached && !forceReload) {
                setClans(cached);
                setLoading(false);
                return;
            }

            setLoading(true);
            const data = await ClansService.getAllClans();

            // Armazenar no cache
            simpleCache.set('clans', data);

            setClans(data);
        } catch (err) {
            console.error('Failed to fetch clans:', err);
            setError('Failed to load clans data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClans();
    }, []);

    // Função para forçar reload
    const reload = () => {
        simpleCache.invalidate('clans');
        fetchClans(true);
    };

    // Buscar um clã por nome
    const getClanByName = (name: string): Clan | undefined => {
        return clans.find(c => c.nome === name);
    };

    // Buscar clãs por foco de atributos
    const getClansByFoco = (foco: string): Clan[] => {
        return clans.filter(c => c.foco_atributos.includes(foco));
    };

    // Obter modificadores de um clã
    const getModificadores = (clanName: string) => {
        const clan = getClanByName(clanName);
        if (!clan) return null;

        return {
            FOR: clan.modificador_for,
            VIG: clan.modificador_vig,
            AGI: clan.modificador_agi,
            INT: clan.modificador_int,
            PER: clan.modificador_per,
            ESS: clan.modificador_ess,
            INF: clan.modificador_inf
        };
    };

    // Obter qualidade inicial de um clã
    const getQualidadeInicial = (clanName: string): string | null => {
        const clan = getClanByName(clanName);
        return clan?.qualidade_inicial || null;
    };

    // Obter defeitos iniciais de um clã
    const getDefeitosIniciais = (clanName: string): string | null => {
        const clan = getClanByName(clanName);
        return clan?.defeitos_iniciais || null;
    };

    // Obter bônus iniciais de um clã
    const getBonusIniciais = (clanName: string): string | null => {
        const clan = getClanByName(clanName);
        return clan?.bonus_iniciais || null;
    };

    // Obter foco de atributos de um clã
    const getFocoAtributos = (clanName: string): string => {
        const clan = getClanByName(clanName);
        return clan?.foco_atributos || 'Livre Escolha';
    };

    return {
        clans,
        loading,
        error,
        getClanByName,
        getClansByFoco,
        getModificadores,
        getQualidadeInicial,
        getDefeitosIniciais,
        getBonusIniciais,
        getFocoAtributos,
        reload // Exportar função de reload
    };
};



