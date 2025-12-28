import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { useSkills } from '@/lib/hooks/useSkills';
import { useAttributes } from '@/lib/hooks/useAttributes';

interface SkillsDisplayProps {
    showDescriptions?: boolean;
    className?: string;
}

export const SkillsDisplay: React.FC<SkillsDisplayProps> = ({
    showDescriptions = true,
    className = ''
}) => {
    const { skills, skillsByAttribute, loading, error, getAttributeIcon, getAttributeColor } = useSkills();
    const { attributeMapping } = useAttributes();
    const [filterAttribute, setFilterAttribute] = useState<string>('all');

    if (loading) {
        return (
            <Card className={`p-6 ${className}`}>
                <h2 className="heading-3 mb-4">Sistema de Perícias</h2>
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
                <h2 className="heading-3 mb-4">Sistema de Perícias</h2>
                <div className="text-red-600 text-sm">
                    {error}
                </div>
            </Card>
        );
    }

    // Filtrar perícias por atributo
    const filteredSkills = filterAttribute === 'all'
        ? skills
        : skillsByAttribute[filterAttribute] || [];

    // Obter atributos disponíveis para o filtro
    const availableAttributes = Object.keys(skillsByAttribute).sort();

    // Obter nome completo do atributo
    const getAttributeName = (abbreviation: string): string => {
        const attribute = attributeMapping.find(a => a.abbreviation === abbreviation);
        return attribute?.name || abbreviation;
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Cabeçalho com filtro */}
            <Card className="p-6 border-2 border-primary/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <div>
                        <h2 className="heading-3 text-gray-900">Sistema de Perícias</h2>
                        <p className="text-sm text-gray-600 mt-2">
                            Habilidades específicas que personagens podem desenvolver. Cada perícia usa um atributo base para seus testes e cálculos.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Filtrar por atributo:
                        </label>
                        <select
                            value={filterAttribute}
                            onChange={(e) => setFilterAttribute(e.target.value)}
                            className="px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[220px] font-medium"
                        >
                            <option value="all">📍 Todos os atributos</option>
                            {availableAttributes.map(attr => (
                                <option key={attr} value={attr}>
                                    {getAttributeIcon(attr)} {getAttributeName(attr)} ({attr})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Agrupar perícias por atributo quando não filtrado */}
            {filterAttribute === 'all' ? (
                <div className="space-y-8">
                    {Object.entries(skillsByAttribute).map(([attribute, attributeSkills]) => (
                        <div key={attribute} className="space-y-3">
                            {/* Cabeçalho do grupo de atributo */}
                            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-l-4 border-primary">
                                <span className="text-3xl">{getAttributeIcon(attribute)}</span>
                                <div>
                                    <h3 className="heading-4 text-gray-900">
                                        {getAttributeName(attribute)}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {attributeSkills.length} perícia{attributeSkills.length !== 1 ? 's' : ''} baseada{attributeSkills.length !== 1 ? 's' : ''} em {getAttributeName(attribute)}
                                    </p>
                                </div>
                            </div>

                            {/* Lista de perícias do grupo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {attributeSkills.map((skill) => (
                                    <Card
                                        key={skill.id}
                                        className="p-5 hover:shadow-lg transition-all duration-200 border-l-4 border-primary/30 bg-white"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="text-2xl flex-shrink-0 mt-1">
                                                {getAttributeIcon(skill.atributo_base)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="heading-5 text-gray-900 mb-2">
                                                    {skill.nome}
                                                </h4>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                                        {skill.atributo_base}
                                                    </span>
                                                </div>
                                                {showDescriptions && (
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        {skill.descricao}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Lista de perícias quando filtrado */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSkills.map((skill) => {
                        const attrName = getAttributeName(skill.atributo_base);

                        return (
                            <Card
                                key={skill.id}
                                className="p-5 hover:shadow-lg transition-all duration-200 border-l-4 border-primary/30 bg-white"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="text-2xl flex-shrink-0 mt-1">
                                        {getAttributeIcon(skill.atributo_base)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="heading-5 text-gray-900 mb-2">
                                            {skill.nome}
                                        </h4>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                                {skill.atributo_base}
                                            </span>
                                        </div>
                                        {showDescriptions && (
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {skill.descricao}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Resumo quando filtrado */}
            {filterAttribute !== 'all' && (
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{getAttributeIcon(filterAttribute)}</span>
                        <div>
                            <div className="text-sm font-bold text-blue-900">
                                Filtro ativo: {getAttributeName(filterAttribute)} ({filterAttribute})
                            </div>
                            <div className="text-xs text-blue-700">
                                {filteredSkills.length} perícia{filteredSkills.length !== 1 ? 's' : ''} encontrada{filteredSkills.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                        <button
                            onClick={() => setFilterAttribute('all')}
                            className="ml-auto px-3 py-1 bg-white text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 text-xs font-medium transition-colors"
                        >
                            Limpar Filtro
                        </button>
                    </div>
                </Card>
            )}
        </div>
    );
};
