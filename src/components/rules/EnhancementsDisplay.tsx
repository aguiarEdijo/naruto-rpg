import React, { useState } from 'react';
import { Card, Select } from '@/components/ui';
import { useEnhancements } from '@/lib/hooks/useEnhancements';

interface EnhancementsDisplayProps {
    className?: string;
}

export const EnhancementsDisplay: React.FC<EnhancementsDisplayProps> = ({
    className = ''
}) => {
    const {
        enhancements,
        enhancementsByType,
        loading,
        error,
        getClanColor,
        getClanIcon,
        formatRequisitos
    } = useEnhancements();

    const [filterClan, setFilterClan] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');

    if (loading) {
        return (
            <Card className={`p-6 ${className}`}>
                <h2 className="heading-3 mb-4">Sistema de Aprimoramentos</h2>
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-24 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={`p-6 ${className}`}>
                <h2 className="heading-3 mb-4">Sistema de Aprimoramentos</h2>
                <div className="text-red-600 text-sm">
                    {error}
                </div>
            </Card>
        );
    }

    // Obter clãs únicos
    const availableClans = Object.keys(enhancementsByType).filter(c => c !== 'Geral' && c).sort();
    const availableTypes = [...new Set(enhancements.map(e => e.tipo))].sort();

    // Filtrar aprimoramentos
    const filteredEnhancements = enhancements.filter(e => {
        const clan = e.clan_restricao || 'Geral';
        if (filterClan !== 'all' && clan !== filterClan) return false;
        if (filterType !== 'all' && e.tipo !== filterType) return false;
        return true;
    });

    // Agrupar filtrados
    const filteredByClan = filteredEnhancements.reduce((acc, e) => {
        const key = e.clan_restricao || 'Geral';
        if (!acc[key]) acc[key] = [];
        acc[key].push(e);
        return acc;
    }, {} as Record<string, typeof filteredEnhancements>);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Cabeçalho com filtros */}
            <Card className="p-6">
                <div className="space-y-4">
                    <h2 className="heading-3">Sistema de Aprimoramentos</h2>

                    <div className="text-sm text-gray-600">
                        Os aprimoramentos são habilidades especiais que o personagem pode adquirir.
                        Cada aprimoramento tem requisitos, custos e durações específicas.
                    </div>

                    {/* Filtros */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Filtrar por clã:
                            </label>
                            <Select
                                value={filterClan}
                                onChange={(e) => setFilterClan(e.target.value)}
                                options={[
                                    { value: 'all', label: 'Todos os clãs' },
                                    ...availableClans.map(clan => ({
                                        value: clan,
                                        label: clan
                                    }))
                                ]}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Filtrar por tipo:
                            </label>
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
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
                </div>
            </Card>

            {/* Lista de Aprimoramentos */}
            <div className="space-y-6">
                {Object.entries(filteredByClan).map(([clan, clanEnhancements]) => (
                    <div key={clan} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{getClanIcon(clan)}</span>
                            <h3 className="heading-3">{clan}</h3>
                            <span className="text-sm text-gray-500">
                                ({clanEnhancements.length} aprimoramento{clanEnhancements.length !== 1 ? 's' : ''})
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {clanEnhancements.map((enhancement) => (
                                <Card
                                    key={enhancement.id}
                                    className={`p-4 ${getClanColor(enhancement.clan_restricao)}`}
                                >
                                    <div className="space-y-3">
                                        {/* Cabeçalho */}
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="heading-4 text-gray-900">
                                                {enhancement.nome}
                                            </h4>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="px-2 py-0.5 bg-white/70 rounded text-xs font-medium text-gray-700">
                                                    {enhancement.tipo}
                                                </span>
                                                {enhancement.rank_restricao && (
                                                    <span className="px-2 py-0.5 bg-white/70 rounded text-xs text-gray-600">
                                                        {enhancement.rank_restricao}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Descrição */}
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {enhancement.descricao}
                                        </p>

                                        {/* Informações complementares */}
                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-current/20">
                                            {enhancement.requisitos && JSON.stringify(enhancement.requisitos) !== '[]' && (
                                                <div>
                                                    <span className="text-xs font-medium text-gray-700">Requisitos:</span>
                                                    <p className="text-xs text-gray-600">{formatRequisitos(enhancement.requisitos)}</p>
                                                </div>
                                            )}
                                            {enhancement.custo && enhancement.custo !== 'N/A' && (
                                                <div>
                                                    <span className="text-xs font-medium text-gray-700">Custo:</span>
                                                    <p className="text-xs text-gray-600">{enhancement.custo}</p>
                                                </div>
                                            )}
                                            {enhancement.acoes && enhancement.acoes !== 'N/A' && (
                                                <div>
                                                    <span className="text-xs font-medium text-gray-700">Ações:</span>
                                                    <p className="text-xs text-gray-600">{enhancement.acoes}</p>
                                                </div>
                                            )}
                                            {enhancement.duracao && enhancement.duracao !== 'N/A' && enhancement.duracao !== 'Sempre Ativo' && (
                                                <div>
                                                    <span className="text-xs font-medium text-gray-700">Duração:</span>
                                                    <p className="text-xs text-gray-600">{enhancement.duracao}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumo quando filtrado */}
            {(filterClan !== 'all' || filterType !== 'all') && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="text-sm text-blue-800">
                        <strong>Filtros ativos:</strong>
                        {filterClan !== 'all' && <span className="ml-2">Clã: {filterClan}</span>}
                        {filterType !== 'all' && <span className="ml-2">Tipo: {filterType}</span>}
                        <span className="ml-2">
                            ({filteredEnhancements.length} aprimoramento{filteredEnhancements.length !== 1 ? 's' : ''} encontrado{filteredEnhancements.length !== 1 ? 's' : ''})
                        </span>
                    </div>
                </Card>
            )}

            {/* Estatísticas gerais */}
            <Card className="p-6 bg-gray-50">
                <h3 className="heading-4 mb-4">Resumo por Clã</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(enhancementsByType).map(([clan, clanEnhancements]) => (
                        <div key={clan} className="flex items-center gap-2">
                            <span className="text-xl">{getClanIcon(clan)}</span>
                            <div>
                                <div className="font-medium text-gray-900">{clan}</div>
                                <div className="text-sm text-gray-600">
                                    {clanEnhancements.length} aprimoramento{clanEnhancements.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
