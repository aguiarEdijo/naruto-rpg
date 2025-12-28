import { useState, useEffect } from 'react';
import { AttributesService, Attribute } from '@/lib/api/attributes';

interface AttributeMapping {
    abbreviation: string;
    name: string;
    category: string;
    description: string;
    key: string; // Chave do sistema (strength, agility, etc.)
}

export const useAttributes = () => {
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                setLoading(true);
                const data = await AttributesService.getAllAttributes();
                setAttributes(data);
            } catch (err) {
                console.error('Failed to fetch attributes:', err);
                setError('Failed to load attributes data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAttributes();
    }, []);

    // Mapear abreviações para chaves do sistema
    const attributeKeyMap: Record<string, string> = {
        'FOR': 'strength',
        'VIG': 'vigor',
        'AGI': 'agility',
        'INT': 'intelligence',
        'PER': 'perception',
        'ESS': 'essence',
        'INF': 'influence'
    };

    // Criar mapeamento completo dos atributos
    const attributeMapping: AttributeMapping[] = attributes
        .filter(attr => attributeKeyMap[attr.abreviacao])
        .map(attr => ({
            abbreviation: attr.abreviacao,
            name: attr.nome,
            category: attr.categoria,
            description: attr.descricao,
            key: attributeKeyMap[attr.abreviacao]
        }));

    return {
        attributes,
        attributeMapping,
        loading,
        error
    };
};
