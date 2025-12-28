import React, { useState } from 'react';
import { Character } from '@/lib/gameConstants';
import { Card, Button, Grid } from '@/components/ui';
import { t, translateAttribute } from '@/lib/translations';
import { Jutsu } from '@/types/game';
import { CreateJutsuModal } from './CreateJutsuModal';

interface JutsuSectionProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const JutsuSection: React.FC<JutsuSectionProps> = ({
    character,
    onCharacterUpdate
}) => {
    const [activeTab, setActiveTab] = useState<'Ninjutsu' | 'Taijutsu' | 'Genjutsu'>('Ninjutsu');
    const [showAddJutsuModal, setShowAddJutsuModal] = useState(false);
    const [editingJutsu, setEditingJutsu] = useState<Jutsu | null>(null);
    const [newJutsu, setNewJutsu] = useState<Partial<Jutsu>>({
        name: '',
        type: 'Ninjutsu',
        description: '',
        rank: 1,
        chakraCost: 0,
        damage: 0,
        effects: '',
    });

    const jutsuTypes: ('Ninjutsu' | 'Taijutsu' | 'Genjutsu')[] = ['Ninjutsu', 'Taijutsu', 'Genjutsu'];

    const getJutsusByType = (type: 'Ninjutsu' | 'Taijutsu' | 'Genjutsu') => {
        return character.jutsus.filter(jutsu => jutsu.type === type);
    };

    const handleCreateJutsu = (jutsuData: {
        name: string;
        categoryId: string;
        rank: string;
        description: string;
        selectedEffects: Array<{ id: string; name: string; custo: number }>;
        peUsed: number;
        peAvailable: number;
        chakraCost: string | null;
        requisito: number | null;
        mult: string | null;
        duracao: string | null;
        realidade: number | null;
    }) => {
        // Converter rank de string (E, D, C, B, A, S) para número (1-6)
        const rankMap: Record<string, number> = { 'E': 1, 'D': 2, 'C': 3, 'B': 4, 'A': 5, 'S': 6 };
        const rankNumber = rankMap[jutsuData.rank] || 1;

        // Determinar tipo baseado na categoria
        let jutsuType: 'Ninjutsu' | 'Taijutsu' | 'Genjutsu' = 'Ninjutsu';
        if (jutsuData.categoryId === 'genjutsu') {
            jutsuType = 'Genjutsu';
        } else if (jutsuData.categoryId === 'taijutsu' || jutsuData.categoryId === 'estiloDeLuta') {
            jutsuType = 'Taijutsu';
        }

        // Extrair valor numérico do custo de chakra (para exibição)
        let chakraCostNumber = 0;
        if (jutsuData.chakraCost) {
            // Tenta extrair o primeiro número do custo (ex: "10" -> 10, "4 + 3/turno" -> 4)
            const match = jutsuData.chakraCost.match(/(\d+)/);
            if (match) {
                chakraCostNumber = parseInt(match[1], 10);
            }
        }

        // Criar string de informações adicionais
        const additionalInfo: string[] = [];
        if (jutsuData.mult) additionalInfo.push(`Mult: ${jutsuData.mult}`);
        if (jutsuData.duracao) additionalInfo.push(`Duração: ${jutsuData.duracao}`);
        if (jutsuData.realidade) additionalInfo.push(`Realidade: ${jutsuData.realidade}`);
        if (jutsuData.requisito) additionalInfo.push(`Req: ${jutsuData.requisito}`);

        // Criar string de efeitos com nomes
        const effectNames = jutsuData.selectedEffects.map(e => e.name);
        let effectsString = `PE: ${jutsuData.peUsed}/${jutsuData.peAvailable}`;
        if (effectNames.length > 0) {
            effectsString += `. Efeitos: ${effectNames.join(', ')}`;
        }
        if (additionalInfo.length > 0) {
            effectsString += `. ${additionalInfo.join(' | ')}`;
        }
        if (jutsuData.chakraCost) {
            effectsString += `. Custo: ${jutsuData.chakraCost}`;
        }

        const jutsu: Jutsu = {
            id: Date.now().toString(),
            name: jutsuData.name,
            type: jutsuType,
            description: jutsuData.description || '',
            rank: rankNumber,
            chakraCost: chakraCostNumber, // Custo base calculado
            damage: 0,
            effects: effectsString,
        };

        const updatedCharacter = {
            ...character,
            jutsus: [...character.jutsus, jutsu],
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
        setShowAddJutsuModal(false);
    };

    const handleEditJutsu = (jutsu: Jutsu) => {
        setEditingJutsu(jutsu);
        setNewJutsu(jutsu);
        setShowAddJutsuModal(true);
    };

    const handleUpdateJutsu = () => {
        if (!editingJutsu || !newJutsu.name) return;

        const updatedJutsu: Jutsu = {
            ...editingJutsu,
            name: newJutsu.name,
            type: newJutsu.type as 'Ninjutsu' | 'Taijutsu' | 'Genjutsu',
            description: newJutsu.description || '',
            rank: newJutsu.rank || 1,
            chakraCost: newJutsu.chakraCost || 0,
            damage: newJutsu.damage || 0,
            effects: newJutsu.effects || '',
        };

        const updatedCharacter = {
            ...character,
            jutsus: character.jutsus.map(j => j.id === editingJutsu.id ? updatedJutsu : j),
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
        setShowAddJutsuModal(false);
        setEditingJutsu(null);
        resetJutsuForm();
    };

    const handleDeleteJutsu = (jutsuId: string) => {
        if (!confirm(t('messages.confirmDelete'))) return;

        const updatedCharacter = {
            ...character,
            jutsus: character.jutsus.filter(jutsu => jutsu.id !== jutsuId),
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    const resetJutsuForm = () => {
        setNewJutsu({
            name: '',
            type: 'Ninjutsu',
            description: '',
            rank: 1,
            chakraCost: 0,
            damage: 0,
            effects: '',
        });
    };

    const handleModalClose = () => {
        setShowAddJutsuModal(false);
        setEditingJutsu(null);
        resetJutsuForm();
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="heading-4">Jutsus</h2>
                <Button
                    variant="accent"
                    size="sm"
                    onClick={() => setShowAddJutsuModal(true)}
                    disabled={!character.isEditable}
                >
                    {t('labels.addJutsu')}
                </Button>
            </div>

            {/* Abas */}
            <div className="flex space-x-1 mb-6">
                {jutsuTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === type
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {t(`jutsuTypes.${type}`)}
                    </button>
                ))}
            </div>

            {/* Lista de Jutsus */}
            <div className="space-y-3">
                {getJutsusByType(activeTab).length === 0 ? (
                    <Card variant="outlined" className="text-center py-8 text-gray-500">
                        {t('messages.noJutsus')}
                    </Card>
                ) : (
                    getJutsusByType(activeTab).map((jutsu) => (
                        <Card key={jutsu.id} variant="outlined" className="bg-white/70">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800">{jutsu.name}</h3>
                                    <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                                        <span><strong>{t('labels.rank')}:</strong> {jutsu.rank}</span>
                                        <span><strong>{t('labels.chakraCost')}:</strong> {jutsu.chakraCost}</span>
                                        <span><strong>{t('labels.damage')}:</strong> {jutsu.damage}</span>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    {character.isEditable && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleEditJutsu(jutsu)}
                                                className="px-2 py-1 text-xs"
                                            >
                                                {t('labels.edit')}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteJutsu(jutsu.id)}
                                                className="px-2 py-1 text-xs"
                                            >
                                                {t('labels.delete')}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {jutsu.description && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-700">{jutsu.description}</p>
                                </div>
                            )}

                            {jutsu.effects && (
                                <div>
                                    <p className="text-sm text-gray-600">
                                        <strong>{t('labels.effects')}:</strong> {jutsu.effects}
                                    </p>
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>

            {/* Modal para adicionar jutsu */}
            {!editingJutsu && (
                <CreateJutsuModal
                    isOpen={showAddJutsuModal}
                    onClose={handleModalClose}
                    onSubmit={handleCreateJutsu}
                />
            )}

            {/* Modal simples para editar jutsu existente */}
            {editingJutsu && showAddJutsuModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="heading-5 mb-4">
                            {t('labels.edit')} Jutsu
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('labels.name')}
                                </label>
                                <input
                                    type="text"
                                    value={newJutsu.name}
                                    onChange={(e) => setNewJutsu({ ...newJutsu, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    placeholder="Nome do jutsu"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('labels.description')}
                                </label>
                                <textarea
                                    value={newJutsu.description}
                                    onChange={(e) => setNewJutsu({ ...newJutsu, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    rows={3}
                                    placeholder="Descrição do jutsu"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('labels.effects')}
                                </label>
                                <textarea
                                    value={newJutsu.effects}
                                    onChange={(e) => setNewJutsu({ ...newJutsu, effects: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    rows={2}
                                    placeholder="Efeitos especiais do jutsu"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                variant="secondary"
                                onClick={handleModalClose}
                            >
                                {t('labels.cancel')}
                            </Button>
                            <Button
                                variant="accent"
                                onClick={handleUpdateJutsu}
                                disabled={!newJutsu.name}
                            >
                                {t('labels.save')}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </Card>
    );
};
