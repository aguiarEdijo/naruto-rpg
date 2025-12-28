'use client';

import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { 
    useJutsuCategories, 
    useJutsuCategoryRanksByCategory,
    useJutsuCategoryRankMutations
} from '@/hooks/queries/useGameRules';
import type { JutsuRank } from '@/types/gameRules';

const RANK_ORDER: JutsuRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

export default function JutsuCategoriesPage() {
    const { data: categories = [], isLoading: loadingCategories } = useJutsuCategories();
    const { updateJutsuCategoryRank } = useJutsuCategoryRankMutations();

    const [activeCategory, setActiveCategory] = useState<string>('');
    const [editingRank, setEditingRank] = useState<Record<string, any>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0].id);
        }
    }, [categories, activeCategory]);

    const { data: categoryRanks = [], isLoading: loadingRanks } = useJutsuCategoryRanksByCategory(activeCategory);

    const handleEditRank = (rankId: string, rankData: any) => {
        setEditingRank(prev => ({ ...prev, [rankId]: { ...rankData } }));
    };

    const handleSaveRank = async (rankId: string) => {
        const updates = editingRank[rankId];
        if (!updates) return;

        try {
            setSubmitting(true);
            await updateJutsuCategoryRank.mutateAsync({ id: rankId, updates });
            setEditingRank(prev => {
                const newEditing = { ...prev };
                delete newEditing[rankId];
                return newEditing;
            });
            // A invalidação da query é feita automaticamente pelo hook
        } catch (error) {
            console.error('Erro ao salvar rank:', error);
            alert('Erro ao salvar rank. Verifique o console.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelEdit = (rankId: string) => {
        setEditingRank(prev => {
            const newEditing = { ...prev };
            delete newEditing[rankId];
            return newEditing;
        });
    };

    const getFieldsForCategory = (categoryId: string) => {
        if (categoryId === 'sustentavel') {
            return ['custo', 'requisito', 'duracao', 'efeito'];
        } else if (categoryId === 'genjutsu') {
            return ['custo', 'requisito', 'realidade', 'efeito'];
        } else {
            return ['custo', 'requisito', 'mult', 'efeito'];
        }
    };

    if (loadingCategories) {
        return (
            <div className="min-h-screen bg-background">
                <GMHeader title="Categorias de Jutsus" backLink="/dashboard/gm/game-rules" />
                <Container className="py-8">
                    <Card>
                        <div className="text-center py-8">Carregando...</div>
                    </Card>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Categorias de Jutsus"
                description="Gerenciar categorias de jutsus e seus ranks"
                backLink="/dashboard/gm/game-rules"
            />

            <Container className="py-8">
                <div className="space-y-6">
                    {/* Navegação entre categorias */}
                    <Card>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeCategory === category.id
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Tabela de ranks da categoria selecionada */}
                    {activeCategory && (
                        <CategoryRanksTable
                            categoryId={activeCategory}
                            categoryName={categories.find(c => c.id === activeCategory)?.name || ''}
                            ranks={categoryRanks}
                            isLoading={loadingRanks}
                            editingRank={editingRank}
                            onEditRank={handleEditRank}
                            onSaveRank={handleSaveRank}
                            onCancelEdit={handleCancelEdit}
                            submitting={submitting}
                            fields={getFieldsForCategory(activeCategory)}
                        />
                    )}
                </div>
            </Container>
        </div>
    );
}

interface CategoryRanksTableProps {
    categoryId: string;
    categoryName: string;
    ranks: any[];
    isLoading: boolean;
    editingRank: Record<string, any>;
    onEditRank: (rankId: string, rankData: any) => void;
    onSaveRank: (rankId: string) => void;
    onCancelEdit: (rankId: string) => void;
    submitting: boolean;
    fields: string[];
}

function CategoryRanksTable({
    categoryId,
    categoryName,
    ranks,
    isLoading,
    editingRank,
    onEditRank,
    onSaveRank,
    onCancelEdit,
    submitting,
    fields
}: CategoryRanksTableProps) {
    if (isLoading) {
        return (
            <Card>
                <div className="text-center py-8">Carregando ranks...</div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="space-y-4">
                <div className="border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{categoryName}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Configure os valores para cada rank desta categoria
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-3 font-semibold text-sm">Rank</th>
                                {fields.includes('custo') && (
                                    <th className="text-left p-3 font-semibold text-sm">Custo</th>
                                )}
                                {fields.includes('requisito') && (
                                    <th className="text-left p-3 font-semibold text-sm">Requisito</th>
                                )}
                                {fields.includes('mult') && (
                                    <th className="text-left p-3 font-semibold text-sm">Multiplicador</th>
                                )}
                                {fields.includes('duracao') && (
                                    <th className="text-left p-3 font-semibold text-sm">Duração</th>
                                )}
                                {fields.includes('realidade') && (
                                    <th className="text-left p-3 font-semibold text-sm">Realidade</th>
                                )}
                                {fields.includes('efeito') && (
                                    <th className="text-left p-3 font-semibold text-sm">Efeito</th>
                                )}
                                <th className="text-right p-3 font-semibold text-sm">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RANK_ORDER.map((rank) => {
                                const rankData = ranks.find(r => r.rank === rank);
                                if (!rankData) return null;

                                const isEditing = editingRank[rankData.id] !== undefined;
                                const editData = isEditing ? editingRank[rankData.id] : rankData;

                                return (
                                    <tr key={rank} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg">
                                                <span className="text-lg font-bold text-primary">{rank}</span>
                                            </div>
                                        </td>
                                        {fields.includes('custo') && (
                                            <td className="p-3">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData.custo || ''}
                                                        onChange={(e) => onEditRank(rankData.id, { ...editData, custo: e.target.value })}
                                                        className="w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                        placeholder="Ex: 10, 4 + 3/turno..."
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold">{rankData.custo || '-'}</span>
                                                )}
                                            </td>
                                        )}
                                        {fields.includes('requisito') && (
                                            <td className="p-3">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editData.requisito || ''}
                                                        onChange={(e) => onEditRank(rankData.id, { ...editData, requisito: parseInt(e.target.value) || null })}
                                                        className="w-20 px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                        min="0"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold">{rankData.requisito ?? '-'}</span>
                                                )}
                                            </td>
                                        )}
                                        {fields.includes('mult') && (
                                            <td className="p-3">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData.mult || ''}
                                                        onChange={(e) => onEditRank(rankData.id, { ...editData, mult: e.target.value })}
                                                        className="w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                        placeholder="Ex: Nin x5, Tai x3..."
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold">{rankData.mult || '-'}</span>
                                                )}
                                            </td>
                                        )}
                                        {fields.includes('duracao') && (
                                            <td className="p-3">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData.duracao || ''}
                                                        onChange={(e) => onEditRank(rankData.id, { ...editData, duracao: e.target.value })}
                                                        className="w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                        placeholder="Ex: 3x Res Turnos..."
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold">{rankData.duracao || '-'}</span>
                                                )}
                                            </td>
                                        )}
                                        {fields.includes('realidade') && (
                                            <td className="p-3">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editData.realidade || ''}
                                                        onChange={(e) => onEditRank(rankData.id, { ...editData, realidade: parseInt(e.target.value) || null })}
                                                        className="w-20 px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                        min="0"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold">{rankData.realidade ?? '-'}</span>
                                                )}
                                            </td>
                                        )}
                                        {fields.includes('efeito') && (
                                            <td className="p-3">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData.efeito || ''}
                                                        onChange={(e) => onEditRank(rankData.id, { ...editData, efeito: e.target.value })}
                                                        className="w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                        placeholder="Ex: 7 Pe, 5 Pe..."
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold">{rankData.efeito || '-'}</span>
                                                )}
                                            </td>
                                        )}
                                        <td className="p-3 text-right">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => onSaveRank(rankData.id)}
                                                        disabled={submitting}
                                                    >
                                                        Salvar
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => onCancelEdit(rankData.id)}
                                                        disabled={submitting}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => onEditRank(rankData.id, rankData)}
                                                >
                                                    Editar
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
}
