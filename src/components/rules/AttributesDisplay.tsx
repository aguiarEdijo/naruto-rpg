import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { AttributesService, Attribute } from '@/lib/api/attributes';

interface AttributesDisplayProps {
    showDescriptions?: boolean;
    className?: string;
}

export const AttributesDisplay: React.FC<AttributesDisplayProps> = ({
    showDescriptions = true,
    className = ''
}) => {
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

    if (loading) {
        return (
            <Card className={`p-6 ${className}`}>
                <h2 className="heading-3 mb-4">Atributos Principais</h2>
                <div className="space-y-3">
                    {[...Array(7)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={`p-6 ${className}`}>
                <h2 className="heading-3 mb-4">Atributos Principais</h2>
                <div className="text-red-600 text-sm">
                    {error}
                </div>
            </Card>
        );
    }

    // Agrupar atributos por categoria
    const attributesByCategory = attributes.reduce((acc, attr) => {
        if (!acc[attr.categoria]) {
            acc[attr.categoria] = [];
        }
        acc[attr.categoria].push(attr);
        return acc;
    }, {} as Record<string, Attribute[]>);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Físico':
                return 'border-red-400 bg-red-50';
            case 'Mental/Chakra':
                return 'border-blue-400 bg-blue-50';
            case 'Social':
                return 'border-green-400 bg-green-50';
            default:
                return 'border-gray-400 bg-gray-50';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Físico':
                return '💪';
            case 'Mental/Chakra':
                return '🧠';
            case 'Social':
                return '🗣️';
            default:
                return '📊';
        }
    };

    // Adicionar ícones específicos para cada atributo
    const getAttributeIcon = (abbreviation: string) => {
        switch (abbreviation) {
            case 'FOR':
                return '💪';
            case 'VIG':
                return '🛡️';
            case 'AGI':
                return '⚡';
            case 'INT':
                return '🧠';
            case 'PER':
                return '👁️';
            case 'ESS':
                return '✨';
            case 'INF':
                return '👑';
            default:
                return '📊';
        }
    };

    // Agrupar todos os atributos por categoria (sem filtro)
    const filteredAttributesByCategory = attributes.reduce((acc, attr) => {
        if (!acc[attr.categoria]) {
            acc[attr.categoria] = [];
        }
        acc[attr.categoria].push(attr);
        return acc;
    }, {} as Record<string, Attribute[]>);

    return (
        <div className={`space-y-6 ${className}`}>
            {Object.entries(filteredAttributesByCategory).map(([category, categoryAttributes]) => (
                <Card key={category} className={`p-6 ${getCategoryColor(category)}`}>
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-2">{getCategoryIcon(category)}</span>
                        <h2 className="heading-3">{category}</h2>
                    </div>

                    <div className="space-y-3">
                        {categoryAttributes.map((attr) => (
                            <div key={attr.id} className="border-l-4 border-primary pl-4">
                                <h3 className="heading-4 flex items-center gap-2">
                                    <span className="text-xl">{getAttributeIcon(attr.abreviacao)}</span>
                                    {attr.nome} ({attr.abreviacao})
                                </h3>
                                {showDescriptions && (
                                    <p className="text-small text-muted mt-1">
                                        {attr.descricao}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
};
