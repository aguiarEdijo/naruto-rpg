import { useState, useEffect } from 'react';
import { SkillsService, Skill } from '@/lib/api/skills';
import { simpleCache } from '@/lib/cache';

export const useSkills = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSkills = async (forceReload = false) => {
        try {
            // Verificar cache (pode ser bypassado)
            const cached = simpleCache.get<Skill[]>('skills', forceReload);
            if (cached && !forceReload) {
                setSkills(cached);
                setLoading(false);
                return;
            }

            setLoading(true);
            const data = await SkillsService.getAllSkills();

            // Armazenar no cache
            simpleCache.set('skills', data);

            setSkills(data);
        } catch (err) {
            console.error('Failed to fetch skills:', err);
            setError('Failed to load skills data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    // Função para forçar reload
    const reload = () => {
        simpleCache.invalidate('skills');
        fetchSkills(true);
    };

    // Agrupar perícias por atributo base
    const skillsByAttribute = skills.reduce((acc, skill) => {
        if (!acc[skill.atributo_base]) {
            acc[skill.atributo_base] = [];
        }
        acc[skill.atributo_base].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    // Obter perícias por atributo
    const getByAttribute = (attribute: string): Skill[] => {
        return skillsByAttribute[attribute] || [];
    };

    // Obter ícone para cada atributo
    const getAttributeIcon = (attribute: string): string => {
        const icons: Record<string, string> = {
            'FOR': '💪',
            'VIG': '🛡️',
            'AGI': '⚡',
            'INT': '🧠',
            'PER': '👁️',
            'ESS': '✨',
            'INF': '🗣️'
        };
        return icons[attribute] || '📋';
    };

    // Obter cor para cada atributo
    const getAttributeColor = (attribute: string): string => {
        const colors: Record<string, string> = {
            'FOR': 'bg-red-50 border-red-200 text-red-800',
            'VIG': 'bg-blue-50 border-blue-200 text-blue-800',
            'AGI': 'bg-green-50 border-green-200 text-green-800',
            'INT': 'bg-purple-50 border-purple-200 text-purple-800',
            'PER': 'bg-yellow-50 border-yellow-200 text-yellow-800',
            'ESS': 'bg-pink-50 border-pink-200 text-pink-800',
            'INF': 'bg-indigo-50 border-indigo-200 text-indigo-800'
        };
        return colors[attribute] || 'bg-gray-50 border-gray-200 text-gray-800';
    };

    // Mapear atributo base para chave do sistema
    const mapAttributeToKey = (attribute: string): string => {
        const mapping: Record<string, string> = {
            'FOR': 'strength',
            'VIG': 'vigor',
            'AGI': 'agility',
            'INT': 'intelligence',
            'PER': 'perception',
            'ESS': 'essence',
            'INF': 'influence'
        };
        return mapping[attribute] || attribute;
    };

    return {
        skills,
        skillsByAttribute,
        loading,
        error,
        getByAttribute,
        getAttributeIcon,
        getAttributeColor,
        mapAttributeToKey,
        reload // Exportar função de reload
    };
};


