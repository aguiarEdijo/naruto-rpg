import React from 'react';
import { Card } from '@/components/ui';
import { useAgeRanges } from '@/lib/hooks/useAgeRanges';

export const AgeRangesDisplay: React.FC = () => {
    const { ageRanges, loading, getFormattedInterval, getModifiers } = useAgeRanges();

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </Card>
        );
    }

    if (ageRanges.length === 0) {
        return (
            <Card className="p-6">
                <p className="text-small text-muted">
                    Nenhuma faixa etária disponível. Execute o script SQL no Supabase.
                </p>
            </Card>
        );
    }

    // Mapear abreviatura para nome completo
    const attrNameMap: Record<string, string> = {
        'FOR': 'Força',
        'VIG': 'Vigor',
        'AGI': 'Agilidade',
        'INT': 'Inteligência',
        'PER': 'Percepção',
        'ESS': 'Essência',
        'INF': 'Influência'
    };

    return (
        <Card className="p-6">
            <h2 className="heading-3 mb-4">Modificadores por Faixa Etária</h2>
            <div className="space-y-3">
                {ageRanges.map((ageRange) => {
                    const modifiers = getModifiers(ageRange);
                    if (!modifiers) return null;

                    // Verificar se há modificadores
                    const hasModifiers = Object.values(modifiers).some(mod => mod !== 0);

                    return (
                        <div key={ageRange.id} className="border border-default rounded-lg p-3 hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="heading-4 text-primary">
                                    {ageRange.faixa_etaria}
                                </h3>
                                <span className="text-small text-muted">
                                    ({getFormattedInterval(ageRange)})
                                </span>
                            </div>
                            <p className="text-small text-muted mb-2">
                                {ageRange.descricao}
                            </p>
                            {hasModifiers ? (
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {Object.entries(modifiers).map(([attr, modifier]) => (
                                        modifier !== 0 && (
                                            <div
                                                key={attr}
                                                className={`text-center p-1.5 rounded ${modifier > 0
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                <span className="font-semibold">{attr}:</span>{' '}
                                                {modifier > 0 ? '+' : ''}{modifier}
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500 italic">
                                    Sem modificadores
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};



