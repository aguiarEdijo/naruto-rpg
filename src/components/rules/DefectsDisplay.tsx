import React, { useState } from 'react';
import { Card, Select } from '@/components/ui';
import { useDefects } from '@/lib/hooks/useDefects';

interface DefectsDisplayProps {
    showDescriptions?: boolean;
    className?: string;
}

export const DefectsDisplay: React.FC<DefectsDisplayProps> = ({
    showDescriptions = true,
    className = ''
}) => {
    const { defects, defectsByType, loading, error, getTypeColor, getTypeIcon } = useDefects();
    const [filterType, setFilterType] = useState<string>('all');

    if (loading) {
        return (
            <Card className={`p-6 ${className}`}>
                <h2 className="heading-3 mb-4">Sistema de Defeitos</h2>
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={`p-6 ${className}`}>
                <h2 className="heading-3 mb-4">Sistema de Defeitos</h2>
                <div className="text-red-600 text-sm">
                    {error}
                </div>
            </Card>
        );
    }

    // Filtrar defeitos por tipo
    const filteredDefects = filterType === 'all'
        ? defects
        : defectsByType[filterType] || [];

    // Obter tipos únicos para o filtro
    const availableTypes = Object.keys(defectsByType).sort();

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Cabeçalho com filtro */}
            <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h2 className="heading-3">Sistema de Defeitos</h2>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Filtrar por tipo:
                        </label>
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="min-w-[200px]"
                            options={[
                                { value: 'all', label: 'Todos os tipos' },
                                ...availableTypes.map(type => ({
                                    value: type,
                                    label: type
                                }))
                            ]}
                        />
                    </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                    Os defeitos são características que limitam ou complicam a vida do personagem,
                    mas também podem adicionar profundidade à narrativa. Cada defeito tem um tipo
                    específico que indica sua natureza.
                </div>
            </Card>

            {/* Lista de defeitos */}
            <div className="space-y-4">
                {filteredDefects.map((defect) => (
                    <Card
                        key={defect.id}
                        className={`p-6 ${getTypeColor(defect.tipo)}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="text-2xl flex-shrink-0 mt-1">
                                {getTypeIcon(defect.tipo)}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                    <h3 className="heading-4 text-gray-900">
                                        {defect.nome}
                                    </h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/70 text-gray-800">
                                        {defect.tipo}
                                    </span>
                                </div>

                                {showDescriptions && (
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-gray-700 leading-relaxed">
                                            {defect.descricao}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Resumo quando filtrado */}
            {filterType !== 'all' && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="text-sm text-blue-800">
                        <strong>Filtro ativo:</strong> {filterType}
                        <span className="ml-2">
                            ({filteredDefects.length} defeito{filteredDefects.length !== 1 ? 's' : ''} encontrado{filteredDefects.length !== 1 ? 's' : ''})
                        </span>
                    </div>
                </Card>
            )}

            {/* Estatísticas gerais */}
            <Card className="p-6 bg-gray-50">
                <h3 className="heading-4 mb-4">Resumo por Tipo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(defectsByType).map(([type, typeDefects]) => (
                        <div key={type} className="flex items-center gap-2">
                            <span className="text-lg">{getTypeIcon(type)}</span>
                            <div>
                                <div className="font-medium text-gray-900">{type}</div>
                                <div className="text-sm text-gray-600">
                                    {typeDefects.length} defeito{typeDefects.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
