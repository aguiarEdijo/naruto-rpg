import React, { useState, useMemo } from 'react';
import { Character } from '@/lib/gameConstants';
import { Card, Button, Input, Modal } from '@/components/ui';
import { useItems } from '@/lib/hooks/useItems';
import { Item as DbItem } from '@/lib/api/items';
import { Item as CharacterItem } from '@/types/game';

interface ItemSectionProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const ItemSection: React.FC<ItemSectionProps> = ({
    character,
    onCharacterUpdate
}) => {
    const { items: dbItems, utilityItems, loading: itemsLoading } = useItems();
    const [activeTab, setActiveTab] = useState<'utilities' | 'weapons'>('utilities');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DbItem | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Converter itens do personagem para o formato de inventário
    const inventoryItems = useMemo(() => character.items || [], [character.items]);

    // Parse do preço para número
    const parsePrice = (priceStr: string): number => {
        if (!priceStr) return 0;
        // Remove "Ryou" e extrai o número, tratando vírgulas e pontos
        const cleaned = priceStr.replace(/[^\d.,]/g, '').replace(',', '');
        return parseFloat(cleaned) || 0;
    };

    // Calcular valor total gasto
    const totalSpent = useMemo(() => {
        return inventoryItems.reduce((total, item) => {
            // Tentar encontrar o item no banco para pegar o preço real
            const dbItem = dbItems.find(db => db.nome === item.name);
            if (dbItem) {
                const itemPrice = parsePrice(dbItem.preco);
                return total + (itemPrice * item.quantity);
            }
            return total;
        }, 0);
    }, [inventoryItems, dbItems]);

    // Adicionar item do banco ao inventário
    const handleAddDbItem = () => {
        if (!selectedItem || quantity < 1) return;

        const newItem: CharacterItem = {
            id: Date.now().toString(),
            name: selectedItem.nome,
            description: selectedItem.descricao || '',
            quantity: quantity,
            weight: 0,
            effects: selectedItem.sistema_mecanico || '',
            rarity: 'common',
        };

        const updatedCharacter = {
            ...character,
            items: [...character.items, newItem],
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
        setShowAddModal(false);
        setSelectedItem(null);
        setQuantity(1);
        setSearchQuery('');
    };

    // Adicionar item customizado
    const handleAddCustomItem = (name: string) => {
        if (!name) return;

        const newItem: CharacterItem = {
            id: Date.now().toString(),
            name,
            description: '',
            quantity: 1,
            weight: 0,
            effects: '',
            rarity: activeTab === 'weapons' ? 'uncommon' : 'common',
        };

        const updatedCharacter = {
            ...character,
            items: [...character.items, newItem],
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
        setShowCustomModal(false);
    };

    // Remover item
    const handleRemoveItem = (itemId: string) => {
        if (!confirm('Deseja remover este item?')) return;

        const updatedCharacter = {
            ...character,
            items: character.items.filter(item => item.id !== itemId),
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    // Atualizar quantidade
    const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const updatedItems = character.items.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );

        const updatedCharacter = {
            ...character,
            items: updatedItems,
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    // Filtrar itens por categoria
    const filteredInventoryItems = activeTab === 'utilities'
        ? inventoryItems.filter(item => item.rarity !== 'legendary' && item.rarity !== 'epic')
        : inventoryItems.filter(item => item.rarity === 'legendary' || item.rarity === 'epic');

    // Filtrar itens do banco por busca
    const filteredDbItems = useMemo(() => {
        if (!searchQuery) return utilityItems;
        const query = searchQuery.toLowerCase();
        return utilityItems.filter(item =>
            item.nome.toLowerCase().includes(query) ||
            (item.descricao && item.descricao.toLowerCase().includes(query))
        );
    }, [utilityItems, searchQuery]);

    return (
        <div className="space-y-4">
            {/* Header com Abas */}
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="heading-4">Itens do Inventário</h2>
                        {totalSpent > 0 && (
                            <p className="text-sm text-gray-600">
                                Total gasto: {totalSpent.toFixed(0)} Ryou
                            </p>
                        )}
                    </div>
                    <Button
                        variant="accent"
                        size="sm"
                        onClick={() => setShowAddModal(true)}
                        disabled={!character.isEditable}
                    >
                        ➕ Adicionar Item
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 border-b border-gray-200 mb-4">
                    <button
                        onClick={() => setActiveTab('utilities')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'utilities'
                            ? 'border-b-2 border-orange-500 text-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Utilitários ({inventoryItems.filter(i => i.rarity !== 'legendary' && i.rarity !== 'epic').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('weapons')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'weapons'
                            ? 'border-b-2 border-orange-500 text-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Armas ({inventoryItems.filter(i => i.rarity === 'legendary' || i.rarity === 'epic').length})
                    </button>
                </div>

                {/* Lista de Itens */}
                <div className="space-y-2">
                    {filteredInventoryItems.length === 0 ? (
                        <Card variant="outlined" className="text-center py-8 text-gray-500">
                            Nenhum {activeTab === 'utilities' ? 'utilitário' : 'arma'} no inventário
                        </Card>
                    ) : (
                        filteredInventoryItems.map((item) => {
                            const dbItem = dbItems.find(db => db.nome === item.name);
                            const itemPrice = dbItem ? parsePrice(dbItem.preco) : 0;
                            const totalValue = itemPrice * item.quantity;

                            return (
                                <Card key={item.id} variant="outlined" className="bg-white/70">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span>Quantidade: {item.quantity}</span>
                                                {itemPrice > 0 && (
                                                    <span className="text-orange-600 font-medium">
                                                        {itemPrice.toFixed(0)} Ryou × {item.quantity} = {totalValue.toFixed(0)} Ryou
                                                    </span>
                                                )}
                                                {item.description && (
                                                    <span className="text-gray-500 truncate">{item.description}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                disabled={!character.isEditable}
                                                className="px-2 py-1"
                                            >
                                                -
                                            </Button>
                                            <span className="text-sm font-medium">{item.quantity}</span>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                disabled={!character.isEditable}
                                                className="px-2 py-1"
                                            >
                                                +
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={!character.isEditable}
                                                className="px-2 py-1"
                                            >
                                                🗑️
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </Card>

            {/* Modal para adicionar item do banco */}
            <Modal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setSelectedItem(null);
                    setQuantity(1);
                    setSearchQuery('');
                }}
                title="Adicionar Item"
                size="lg"
            >
                {!selectedItem ? (
                    // Lista de itens do banco
                    <div className="space-y-4">
                        {itemsLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-pulse">Carregando itens...</div>
                            </div>
                        ) : (
                            <>
                                <Input
                                    type="text"
                                    placeholder="Buscar item por nome ou descrição..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="max-h-96 overflow-y-auto space-y-2">
                                    {filteredDbItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            <Card variant="outlined">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold">{item.nome}</h4>
                                                        <p className="text-sm text-gray-600">{item.tipo}</p>
                                                        {item.preco && (
                                                            <p className="text-xs text-gray-500 mt-1">{item.preco}</p>
                                                        )}
                                                    </div>
                                                    {item.sistema_mecanico && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                                            {item.sistema_mecanico.substring(0, 30)}...
                                                        </span>
                                                    )}
                                                </div>
                                                {item.descricao && (
                                                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{item.descricao}</p>
                                                )}
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="accent"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setShowCustomModal(true);
                                        }}
                                    >
                                        Criar Item Customizado
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    // Detalhes do item selecionado
                    <div className="space-y-4">
                        {/* Header do Item */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-bold text-xl text-gray-900">{selectedItem.nome}</h4>
                                <p className="text-sm text-gray-600 mt-1">{selectedItem.tipo}</p>
                            </div>
                            {selectedItem.preco && (
                                <div className="ml-4">
                                    <p className="text-lg font-bold text-orange-600">{selectedItem.preco}</p>
                                </div>
                            )}
                        </div>

                        {/* Descrição */}
                        {selectedItem.descricao && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-700 leading-relaxed">{selectedItem.descricao}</p>
                            </div>
                        )}

                        {/* Informações Técnicas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Efeitos no Sistema */}
                            {selectedItem.sistema_mecanico && (
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Efeitos no Sistema</p>
                                    </div>
                                    <p className="text-sm text-blue-900 leading-relaxed">{selectedItem.sistema_mecanico}</p>
                                </div>
                            )}

                            {/* Efeitos Colaterais */}
                            {selectedItem.efeito_colateral && (
                                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">Efeitos Colaterais</p>
                                    </div>
                                    <p className="text-sm text-yellow-900 leading-relaxed">{selectedItem.efeito_colateral}</p>
                                </div>
                            )}

                            {/* Tempo de Criação */}
                            {selectedItem.tempo_criacao && (
                                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">Tempo de Criação</p>
                                    </div>
                                    <p className="text-sm text-green-900 font-medium">{selectedItem.tempo_criacao}</p>
                                </div>
                            )}

                            {/* Duração */}
                            {selectedItem.duracao && (
                                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide">Duração</p>
                                    </div>
                                    <p className="text-sm text-purple-900 font-medium">{selectedItem.duracao}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            {selectedItem.preco && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Total: {(parsePrice(selectedItem.preco) * quantity).toFixed(0)} Ryou
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                                Voltar
                            </Button>
                            <Button variant="accent" onClick={handleAddDbItem}>
                                Adicionar ao Inventário
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal para item customizado */}
            <Modal
                isOpen={showCustomModal}
                onClose={() => setShowCustomModal(false)}
                title="Adicionar Item Customizado"
                size="sm"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Item
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Digite o nome"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                    handleAddCustomItem(e.currentTarget.value);
                                }
                            }}
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setShowCustomModal(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="accent"
                            onClick={() => {
                                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                                if (input?.value) {
                                    handleAddCustomItem(input.value);
                                }
                            }}
                        >
                            Adicionar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
