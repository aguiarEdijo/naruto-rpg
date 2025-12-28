'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Button, Card } from '@/components/ui';
import { useJutsuCategories, useJutsuCategoryRanksByCategory, useJutsuEffects } from '@/hooks/queries/useGameRules';
import type { JutsuRank } from '@/types/gameRules';

const RANK_ORDER: JutsuRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

interface CreateJutsuModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (jutsuData: {
        nome: string;
        tipo_jutsu: 'Ninjutsu' | 'Taijutsu' | 'Genjutsu';
        subtipo: string | null;
        rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
        custo_chakra: string;
        acao: string;
        duracao: string;
        restricao: string | null;
        descricao: string;
    }) => void;
}

export const CreateJutsuModal: React.FC<CreateJutsuModalProps> = ({
    isOpen,
    onClose,
    onSubmit
}) => {
    const { data: categories = [], isLoading: loadingCategories, error: categoriesError } = useJutsuCategories();
    const { data: effects = [], isLoading: loadingEffects } = useJutsuEffects();

    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [selectedRank, setSelectedRank] = useState<JutsuRank | ''>('');
    const [jutsuName, setJutsuName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedEffectIds, setSelectedEffectIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Buscar ranks da categoria selecionada
    const { data: categoryRanks = [], isLoading: loadingRanks, error: ranksError } = useJutsuCategoryRanksByCategory(selectedCategoryId);

    // Debug: log quando categoria é selecionada
    useEffect(() => {
        if (selectedCategoryId) {
            console.log('🔍 Buscando ranks para categoria:', selectedCategoryId);
        }
        if (loadingRanks) {
            console.log('⏳ Carregando ranks...');
        }
        if (categoryRanks.length > 0) {
            console.log('✅ Ranks carregados:', categoryRanks);
        }
        if (ranksError) {
            console.error('❌ Erro ao carregar ranks:', ranksError);
        }
    }, [selectedCategoryId, loadingRanks, categoryRanks, ranksError]);

    // Encontrar o rank selecionado para obter PE
    const selectedRankData = useMemo(() => {
        if (!selectedRank || !selectedCategoryId) return null;
        return categoryRanks.find(r => r.rank === selectedRank);
    }, [selectedRank, categoryRanks, selectedCategoryId]);

    // Extrair número de PE do campo "efeito" (ex: "7 Pe" -> 7)
    const peAvailable = useMemo(() => {
        if (!selectedRankData?.efeito) return 0;
        const match = selectedRankData.efeito.match(/(\d+)\s*Pe?/i);
        return match ? parseInt(match[1], 10) : 0;
    }, [selectedRankData]);

    // Extrair custo de chakra do campo "custo"
    const chakraCost = useMemo(() => {
        if (!selectedRankData?.custo) return null;
        return selectedRankData.custo; // Pode ser "10", "4 + 3/turno", "1/turno", etc.
    }, [selectedRankData]);

    // Calcular PE usado pelos efeitos selecionados
    const peUsed = useMemo(() => {
        return selectedEffectIds.reduce((total, effectId) => {
            const effect = effects.find(e => e.id === effectId);
            return total + (effect?.custo || 0);
        }, 0);
    }, [selectedEffectIds, effects]);

    const peRemaining = peAvailable - peUsed;

    // Filtrar efeitos por busca
    const filteredEffects = useMemo(() => {
        if (!searchQuery) return effects;
        const query = searchQuery.toLowerCase();
        return effects.filter(effect =>
            effect.name.toLowerCase().includes(query) ||
            effect.descricao.toLowerCase().includes(query) ||
            (effect.categoria && effect.categoria.toLowerCase().includes(query))
        );
    }, [effects, searchQuery]);

    // Separar efeitos positivos e negativos
    const positiveEffects = filteredEffects.filter(e => e.custo > 0);
    const negativeEffects = filteredEffects.filter(e => e.custo < 0);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        setSelectedRank(''); // Reset rank ao mudar categoria
    };

    const handleRankChange = (rank: JutsuRank) => {
        setSelectedRank(rank);
        setSelectedEffectIds([]); // Reset efeitos ao mudar rank
    };

    const toggleEffect = (effectId: string) => {
        const effect = effects.find(e => e.id === effectId);
        if (!effect) return;

        const newCost = peUsed + effect.custo;
        
        // Não permitir selecionar se exceder PE disponível (exceto efeitos negativos)
        if (effect.custo > 0 && newCost > peAvailable) {
            return;
        }

        if (selectedEffectIds.includes(effectId)) {
            setSelectedEffectIds(selectedEffectIds.filter(id => id !== effectId));
        } else {
            setSelectedEffectIds([...selectedEffectIds, effectId]);
        }
    };

    const handleSubmit = () => {
        if (!jutsuName || !selectedCategoryId || !selectedRank) {
            alert('Preencha nome, categoria e rank do jutsu');
            return;
        }

        if (peRemaining < 0) {
            alert('Você excedeu os PE disponíveis!');
            return;
        }

        // Determinar tipo baseado na categoria
        let tipoJutsu: 'Ninjutsu' | 'Taijutsu' | 'Genjutsu' = 'Ninjutsu';
        if (selectedCategoryId === 'genjutsu') {
            tipoJutsu = 'Genjutsu';
        } else if (selectedCategoryId === 'taijutsu' || selectedCategoryId === 'estiloDeLuta') {
            tipoJutsu = 'Taijutsu';
        }

        // Criar string de efeitos
        const effectNames = selectedEffectIds.map(id => {
            const effect = effects.find(e => e.id === id);
            return effect?.name;
        }).filter(Boolean).join(', ');

        // Montar descrição com informações dos efeitos
        let descricaoCompleta = description || '';
        if (effectNames) {
            descricaoCompleta += (descricaoCompleta ? '\n\n' : '') + `Efeitos: ${effectNames}`;
        }

        // Criar dados do jutsu no formato esperado
        const jutsuData = {
            nome: jutsuName,
            tipo_jutsu: tipoJutsu,
            subtipo: selectedCategoryId !== 'ninjutsu' && selectedCategoryId !== 'taijutsu' && selectedCategoryId !== 'genjutsu' 
                ? categories.find(c => c.id === selectedCategoryId)?.name || null
                : null,
            rank: selectedRank,
            custo_chakra: chakraCost || '',
            acao: selectedRankData?.mult ? `Multiplicador: ${selectedRankData.mult}` : 'Padrão',
            duracao: selectedRankData?.duracao || 'Instantâneo',
            restricao: selectedRankData?.requisito ? `Requisito: ${selectedRankData.requisito}` : null,
            descricao: descricaoCompleta || `PE: ${peUsed}/${peAvailable}${selectedRankData?.realidade ? ` | Realidade: ${selectedRankData.realidade}` : ''}`
        };

        onSubmit(jutsuData);

        // Reset form
        setSelectedCategoryId('');
        setSelectedRank('');
        setJutsuName('');
        setDescription('');
        setSelectedEffectIds([]);
        setSearchQuery('');
    };

    const handleClose = () => {
        setSelectedCategoryId('');
        setSelectedRank('');
        setJutsuName('');
        setDescription('');
        setSelectedEffectIds([]);
        setSearchQuery('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Criar Novo Jutsu"
            size="xl"
        >
            <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Jutsu *
                        </label>
                        <input
                            type="text"
                            value={jutsuName}
                            onChange={(e) => setJutsuName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Ex: Rasengan, Chidori..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoria *
                            </label>
                            {loadingCategories ? (
                                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 animate-pulse">
                                    Carregando categorias...
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-700 text-sm">
                                    <p className="font-semibold mb-1">⚠️ Nenhuma categoria encontrada</p>
                                    <p className="text-xs">Verifique se as tabelas foram populadas no banco.</p>
                                </div>
                            ) : (
                                <select
                                    value={selectedCategoryId}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rank *
                            </label>
                            {!selectedCategoryId ? (
                                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                                    Selecione uma categoria primeiro
                                </div>
                            ) : loadingRanks ? (
                                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 animate-pulse">
                                    Carregando ranks...
                                </div>
                            ) : ranksError ? (
                                <div className="px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-700 text-sm">
                                    <p className="font-semibold mb-1">⚠️ Erro ao carregar ranks</p>
                                    <p className="text-xs">Verifique o console para mais detalhes.</p>
                                </div>
                            ) : categoryRanks.length === 0 ? (
                                <div className="px-3 py-2 border border-yellow-300 rounded-md bg-yellow-50 text-yellow-700 text-sm">
                                    <p className="font-semibold mb-1">⚠️ Nenhum rank encontrado</p>
                                    <p className="text-xs">Esta categoria ainda não tem ranks configurados.</p>
                                </div>
                            ) : (
                                <select
                                    value={selectedRank}
                                    onChange={(e) => handleRankChange(e.target.value as JutsuRank)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">Selecione um rank</option>
                                    {RANK_ORDER.map((rank) => {
                                        const rankData = categoryRanks.find(r => r.rank === rank);
                                        if (!rankData) return null;
                                        return (
                                            <option key={rank} value={rank}>
                                                Rank {rank} {rankData.efeito ? `(${rankData.efeito})` : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Display Information Cards */}
                    {selectedRank && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* PE Information */}
                            {peAvailable > 0 && (
                                <Card className="p-4 bg-blue-50 border-blue-200">
                                    <span className="text-sm font-medium text-gray-700">Pontos de Efeito (PE):</span>
                                    <div className="mt-1">
                                        <span className={`text-2xl font-bold ${peRemaining < 0 ? 'text-red-600' : peRemaining === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                                            {peRemaining}
                                        </span>
                                        <span className="text-sm text-gray-600 ml-2">
                                            / {peAvailable} disponíveis
                                        </span>
                                    </div>
                                    {peUsed > 0 && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            Usados: <span className="font-semibold text-gray-800">{peUsed}</span>
                                        </div>
                                    )}
                                </Card>
                            )}

                            {/* Chakra Cost Information */}
                            {chakraCost && (
                                <Card className="p-4 bg-purple-50 border-purple-200">
                                    <span className="text-sm font-medium text-gray-700">Custo de Chakra:</span>
                                    <div className="mt-1">
                                        <span className="text-2xl font-bold text-purple-600">
                                            {chakraCost}
                                        </span>
                                    </div>
                                    {selectedRankData?.requisito && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            Requisito: <span className="font-semibold text-gray-800">{selectedRankData.requisito}</span>
                                        </div>
                                    )}
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Additional Info */}
                    {selectedRankData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {selectedRankData.mult && (
                                <div>
                                    <span className="font-medium text-gray-700">Multiplicador: </span>
                                    <span className="text-gray-600">{selectedRankData.mult}</span>
                                </div>
                            )}
                            {selectedRankData.duracao && (
                                <div>
                                    <span className="font-medium text-gray-700">Duração: </span>
                                    <span className="text-gray-600">{selectedRankData.duracao}</span>
                                </div>
                            )}
                            {selectedRankData.realidade && (
                                <div>
                                    <span className="font-medium text-gray-700">Realidade: </span>
                                    <span className="text-gray-600">{selectedRankData.realidade}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            rows={3}
                            placeholder="Descreva o jutsu..."
                        />
                    </div>
                </div>

                {/* Seleção de Efeitos */}
                {selectedRank && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Buscar Efeitos
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Buscar por nome, descrição ou categoria..."
                            />
                        </div>

                        {loadingEffects ? (
                            <div className="text-center py-8 text-gray-500">Carregando efeitos...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                {/* Efeitos Positivos */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                        Efeitos Positivos ({positiveEffects.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {positiveEffects.map((effect) => {
                                            const isSelected = selectedEffectIds.includes(effect.id);
                                            const canSelect = peUsed + effect.custo <= peAvailable;
                                            return (
                                                <button
                                                    key={effect.id}
                                                    onClick={() => toggleEffect(effect.id)}
                                                    disabled={!canSelect && !isSelected}
                                                    className={`w-full text-left p-3 border rounded-md transition-colors ${
                                                        isSelected
                                                            ? 'bg-primary/20 border-primary'
                                                            : canSelect
                                                            ? 'bg-white border-gray-300 hover:bg-gray-50'
                                                            : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-sm text-gray-900">
                                                                {effect.name}
                                                            </div>
                                                            <div className="text-xs text-gray-600 mt-1">
                                                                {effect.descricao}
                                                            </div>
                                                            {effect.requisito && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Requisito: {effect.requisito}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                                                            effect.custo > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {effect.custo > 0 ? '+' : ''}{effect.custo} PE
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Efeitos Negativos */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                        Efeitos Negativos ({negativeEffects.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {negativeEffects.map((effect) => {
                                            const isSelected = selectedEffectIds.includes(effect.id);
                                            return (
                                                <button
                                                    key={effect.id}
                                                    onClick={() => toggleEffect(effect.id)}
                                                    className={`w-full text-left p-3 border rounded-md transition-colors ${
                                                        isSelected
                                                            ? 'bg-primary/20 border-primary'
                                                            : 'bg-white border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-sm text-gray-900">
                                                                {effect.name}
                                                            </div>
                                                            <div className="text-xs text-gray-600 mt-1">
                                                                {effect.descricao}
                                                            </div>
                                                            {effect.requisito && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Requisito: {effect.requisito}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                                                            {effect.custo} PE
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Efeitos Selecionados */}
                        {selectedEffectIds.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                    Efeitos Selecionados ({selectedEffectIds.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedEffectIds.map((effectId) => {
                                        const effect = effects.find(e => e.id === effectId);
                                        if (!effect) return null;
                                        return (
                                            <div
                                                key={effectId}
                                                className="px-3 py-1 bg-primary/20 border border-primary rounded-md flex items-center gap-2"
                                            >
                                                <span className="text-sm font-medium text-gray-900">
                                                    {effect.name}
                                                </span>
                                                <span className={`text-xs font-semibold ${
                                                    effect.custo > 0 ? 'text-green-700' : 'text-red-700'
                                                }`}>
                                                    ({effect.custo > 0 ? '+' : ''}{effect.custo} PE)
                                                </span>
                                                <button
                                                    onClick={() => toggleEffect(effectId)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Botões */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={!jutsuName || !selectedCategoryId || !selectedRank || peRemaining < 0}
                    >
                        Criar Jutsu
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

