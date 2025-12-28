import React, { useMemo, useState, useEffect } from 'react';
import { Card, Input, Button } from '@/components/ui';
import { useItems } from '@/lib/hooks/useItems';
import { usePageReload } from '@/hooks/usePageReload';

export const ItemsDisplay: React.FC = () => {
    const { items, utilityItems, loading, error, getCategories, reload } = useItems();
    
    // Recarregar quando o componente é montado ou quando a página ganha foco
    usePageReload(() => {
        reload();
    }, [], { reloadOnFocus: true, reloadOnVisibilityChange: false });
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('');

    const categories = useMemo(() => {
        const cats = getCategories()
            .filter((c) => c && !/arma/i.test(c));
        return ['Todas', ...cats];
    }, [getCategories]);

    const filtered = useMemo(() => {
        const base = utilityItems;
        const byCategory = activeCategory && activeCategory !== 'Todas'
            ? base.filter((i) => i.tipo === activeCategory)
            : base;
        if (!query.trim()) return byCategory;
        const q = query.toLowerCase();
        return byCategory.filter((i) =>
            i.nome.toLowerCase().includes(q) ||
            (i.descricao || '').toLowerCase().includes(q)
        );
    }, [utilityItems, activeCategory, query]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Input
                    placeholder="Buscar item por nome ou descrição..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                />
                <div className="flex gap-2 overflow-x-auto">
                    {categories.map((c) => (
                        <Button
                            key={c}
                            size="sm"
                            variant={activeCategory === c ? 'accent' : 'secondary'}
                            onClick={() => setActiveCategory(c)}
                        >
                            {c}
                        </Button>
                    ))}
                </div>
            </div>

            {loading ? (
                <Card variant="outlined" className="p-8 text-center">
                    <div className="animate-pulse">Carregando itens...</div>
                </Card>
            ) : error ? (
                <Card variant="outlined" className="p-8 text-center text-red-600">
                    Falha ao carregar itens.
                </Card>
            ) : filtered.length === 0 ? (
                <Card variant="outlined" className="p-8 text-center text-gray-500">
                    Nenhum item encontrado.
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filtered.map((item) => (
                        <Card key={item.id} variant="outlined" className="h-full">
                            <div className="flex flex-col h-full">
                                <div className="mb-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-800 mr-2 truncate">
                                            {item.nome}
                                        </h3>
                                        {item.preco && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                                                {item.preco}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{item.tipo}</p>
                                </div>
                                {item.descricao && (
                                    <p className="text-sm text-gray-700 line-clamp-3 mb-2">{item.descricao}</p>
                                )}
                                {item.sistema_mecanico && (
                                    <div className="mt-auto p-2 bg-blue-50 rounded border border-blue-100">
                                        <p className="text-xs font-semibold text-blue-800">Efeitos</p>
                                        <p className="text-xs text-blue-700">{item.sistema_mecanico}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};




