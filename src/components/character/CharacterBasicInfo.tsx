import React, { useState } from 'react';
import { Card, Input, Select, Button, Modal } from '@/components/ui';
import { Character, Attributes, calculateRemainingEnhancementPoints, levelUpCharacter } from '@/lib/gameConstants';
import { useLevelValidation } from '@/lib/hooks/useLevelValidation';
import { useClans } from '@/lib/hooks/useClans';
import { useAgeRanges } from '@/lib/hooks/useAgeRanges';

interface CharacterBasicInfoProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

// Mapeamento de nomes dos clãs do banco para IDs do sistema
const CLAN_NAME_TO_ID: Record<string, string> = {
    'Uchiha': 'uchiha',
    'Hyuga': 'hyuga',
    'Nara': 'nara',
    'Akimichi': 'akimichi',
    'Uzumaki': 'uzumaki',
    'Yamanaka': 'yamanaka',
    'Aburame': 'aburame',
    'Inuzuka': 'inuzuka',
    'Senju': 'senju',
    'Sem Clã': 'no_clan',
    'Mutação': 'mutation',
};

// Mapeamento reverso de IDs do sistema para nomes do banco
const CLAN_ID_TO_NAME: Record<string, string> = {
    'uchiha': 'Uchiha',
    'hyuga': 'Hyuga',
    'nara': 'Nara',
    'akimichi': 'Akimichi',
    'uzumaki': 'Uzumaki',
    'yamanaka': 'Yamanaka',
    'aburame': 'Aburame',
    'inuzuka': 'Inuzuka',
    'senju': 'Senju',
    'no_clan': 'Sem Clã',
    'mutation': 'Mutação',
};

export const CharacterBasicInfo: React.FC<CharacterBasicInfoProps> = ({
    character,
    onCharacterUpdate
}) => {
    const { clans, loading: clansLoading, getClanByName, getModificadores } = useClans();
    const { ageRanges, loading: ageRangesLoading, findAgeRange, getModifiers: getAgeModifiers, getFormattedInterval } = useAgeRanges();
    const { loading: validationLoading, validateCharacterLevel } = useLevelValidation(character);

    const [showAttributeModal, setShowAttributeModal] = useState(false);
    const [pendingClanSelection, setPendingClanSelection] = useState<string>('');
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

    // Buscar a faixa etária atual do personagem
    const currentAgeRange = findAgeRange(character.age);

    // Validar o personagem atual
    const validation = validateCharacterLevel(character);

    // Buscar o clã atual pelos dados do banco
    const clanName = CLAN_ID_TO_NAME[character.clan] || character.clan;
    const selectedClan = getClanByName(clanName);

    const handleClanChange = (clanName: string) => {
        const newClanId = CLAN_NAME_TO_ID[clanName] || clanName.toLowerCase().replace(' ', '_');
        const currentClanName = CLAN_ID_TO_NAME[character.clan] || character.clan;
        const currentModifiers = getModificadores(currentClanName);
        const newModifiers = getModificadores(clanName);

        // Verificar se precisa de atributos extras (Sem Clã ou Mutação)
        if (newClanId === 'no_clan') {
            setPendingClanSelection(clanName);
            setSelectedAttributes([]);
            setShowAttributeModal(true);
            return;
        } else if (newClanId === 'mutation') {
            setPendingClanSelection(clanName);
            setSelectedAttributes([]);
            setShowAttributeModal(true);
            return;
        }

        // Aplicar modificadores diretamente
        applyClanChanges(clanName, newClanId, currentModifiers, newModifiers);
    };

    const applyClanChanges = (
        clanName: string,
        clanId: string,
        currentModifiers: any,
        newModifiers: any,
        bonusAttributes?: string[]
    ) => {
        if (!currentModifiers || !newModifiers) return;

        // Calcular diferença nos modificadores
        const attributeDifference: Partial<Attributes> = {};

        // Mapear modificadores do banco para atributos do sistema
        const modifierMap: Record<string, keyof Attributes> = {
            'FOR': 'strength',
            'VIG': 'vigor',
            'AGI': 'agility',
            'INT': 'intelligence',
            'PER': 'perception',
            'ESS': 'essence',
            'INF': 'influence'
        };

        // Remover modificadores do clã atual
        Object.entries(currentModifiers).forEach(([attr, modifier]) => {
            const systemAttr = modifierMap[attr];
            if (systemAttr && modifier && modifier !== 0) {
                attributeDifference[systemAttr] = -(modifier as number);
            }
        });

        // Adicionar modificadores do novo clã
        Object.entries(newModifiers).forEach(([attr, modifier]) => {
            const systemAttr = modifierMap[attr];
            if (systemAttr && modifier && modifier !== 0) {
                attributeDifference[systemAttr] = (attributeDifference[systemAttr] || 0) + (modifier as number);
            }
        });

        // Aplicar as mudanças nos atributos base
        const newBaseAttributes = { ...character.baseAttributes };
        Object.entries(attributeDifference).forEach(([attr, difference]) => {
            if (difference) {
                newBaseAttributes[attr as keyof Attributes] += difference;
            }
        });

        // Aplicar bônus especiais se houver
        if (bonusAttributes && bonusAttributes.length > 0) {
            bonusAttributes.forEach(attr => {
                const systemAttr = attr as keyof Attributes;
                if (systemAttr) {
                    newBaseAttributes[systemAttr] += 1;
                }
            });
        }

        onCharacterUpdate({
            ...character,
            clan: clanId,
            baseAttributes: newBaseAttributes
        });
    };

    const handleConfirmAttributes = () => {
        if (selectedAttributes.length === 0) {
            alert('Selecione pelo menos um atributo');
            return;
        }

        const clanName = pendingClanSelection;
        const clanId = CLAN_NAME_TO_ID[clanName] || clanName.toLowerCase().replace(' ', '_');
        const currentClanName = CLAN_ID_TO_NAME[character.clan] || character.clan;
        const currentModifiers = getModificadores(currentClanName);
        const newModifiers = getModificadores(clanName);

        // Aplicar modificadores base com bônus
        applyClanChanges(clanName, clanId, currentModifiers, newModifiers, selectedAttributes);

        setShowAttributeModal(false);
        setSelectedAttributes([]);
        setPendingClanSelection('');
    };

    const handleAgeRangeChange = (faixaEtaria: string) => {
        const newAgeRange = ageRanges.find(ar => ar.faixa_etaria === faixaEtaria);
        if (!newAgeRange) return;

        // Obter idade média da faixa etária
        const averageAge = newAgeRange.idade_maxima
            ? Math.floor((newAgeRange.idade_minima + newAgeRange.idade_maxima) / 2)
            : newAgeRange.idade_minima + 10; // Para idoso, usar idade_minima + 10

        // Obter modificadores da nova faixa etária
        const newModifiers = getAgeModifiers(newAgeRange);
        const currentModifiers = getAgeModifiers(currentAgeRange);

        if (!newModifiers || !currentModifiers) {
            onCharacterUpdate({
                ...character,
                age: averageAge
            });
            return;
        }

        // Aplicar mudanças nos atributos base
        const attributeDifference: Partial<Attributes> = {};
        const modifierMap: Record<string, keyof Attributes> = {
            'FOR': 'strength',
            'VIG': 'vigor',
            'AGI': 'agility',
            'INT': 'intelligence',
            'PER': 'perception',
            'ESS': 'essence',
            'INF': 'influence'
        };

        // Remover modificadores da faixa etária atual
        Object.entries(currentModifiers).forEach(([attr, modifier]) => {
            const systemAttr = modifierMap[attr];
            if (systemAttr && modifier && modifier !== 0) {
                attributeDifference[systemAttr] = -(modifier as number);
            }
        });

        // Adicionar modificadores da nova faixa etária
        Object.entries(newModifiers).forEach(([attr, modifier]) => {
            const systemAttr = modifierMap[attr];
            if (systemAttr && modifier && modifier !== 0) {
                attributeDifference[systemAttr] = (attributeDifference[systemAttr] || 0) + (modifier as number);
            }
        });

        // Aplicar mudanças
        const newBaseAttributes = { ...character.baseAttributes };
        Object.entries(attributeDifference).forEach(([attr, difference]) => {
            if (difference) {
                newBaseAttributes[attr as keyof Attributes] += difference;
            }
        });

        onCharacterUpdate({
            ...character,
            age: averageAge,
            baseAttributes: newBaseAttributes
        });
    };

    const handleLevelUp = () => {
        const updatedCharacter = levelUpCharacter(character);
        onCharacterUpdate(updatedCharacter);
    };

    return (
        <Card className="h-fit">
            <h2 className="heading-4 mb-4">Informações Básicas</h2>

            <div className="space-y-3">
                {/* Layout compacto: Nome */}
                <Input
                    label="Nome"
                    value={character.name}
                    disabled={!character.isEditable}
                    onChange={(e) => onCharacterUpdate({ ...character, name: e.target.value })}
                    placeholder="Nome do personagem"
                    className="text-xs"
                />

                {/* Clã e Idade lado a lado */}
                <div className="grid grid-cols-[1fr_auto] gap-3">
                    {clansLoading ? (
                        <div className="animate-pulse bg-gray-200 rounded h-10"></div>
                    ) : (
                        <Select
                            label="Clã"
                            value={clanName}
                            disabled={!character.isEditable || clansLoading}
                            onChange={(e) => handleClanChange(e.target.value)}
                            options={clans.map(clan => ({
                                value: clan.nome,
                                label: clan.nome
                            }))}
                            className="text-xs"
                        />
                    )}
                    {ageRangesLoading ? (
                        <div className="animate-pulse bg-gray-200 rounded h-10"></div>
                    ) : ageRanges.length === 0 ? (
                        <div className="text-xs text-gray-500">
                            Nenhuma faixa etária disponível
                        </div>
                    ) : (
                        <Select
                            label="Faixa Etária"
                            value={currentAgeRange?.faixa_etaria || ageRanges[1]?.faixa_etaria || 'Jovem'}
                            disabled={!character.isEditable}
                            onChange={(e) => handleAgeRangeChange(e.target.value)}
                            options={ageRanges.map(ar => ({
                                value: ar.faixa_etaria,
                                label: ar.faixa_etaria
                            }))}
                            className="text-xs"
                        />
                    )}
                </div>

                {/* Informações do Clã */}
                {selectedClan && (
                    <Card variant="outlined" className="bg-gray-50 border-gray-200 p-2 text-xs">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800">
                                    {selectedClan.nome}
                                </h3>
                                <span className="text-gray-500">
                                    {character.age} anos
                                </span>
                            </div>
                            {selectedClan.qualidade_inicial && (
                                <p className="text-gray-600 text-[10px] leading-relaxed">
                                    <span className="font-medium">Qualidade Inicial:</span> {selectedClan.qualidade_inicial}
                                </p>
                            )}
                            {selectedClan.descricao && (
                                <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2 mt-1">
                                    {selectedClan.descricao}
                                </p>
                            )}
                        </div>
                    </Card>
                )}

                {/* Informações da Faixa Etária */}
                {currentAgeRange && (
                    <Card variant="outlined" className="bg-blue-50 border-blue-200 p-2 text-xs">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-600">ℹ️</span>
                                    <span className="font-semibold text-gray-800">
                                        {currentAgeRange.faixa_etaria} ({getFormattedInterval(currentAgeRange)})
                                    </span>
                                </div>
                                <span className="text-gray-500">
                                    {character.age} anos
                                </span>
                            </div>
                            <p className="text-gray-600 text-[10px] leading-relaxed">
                                {currentAgeRange.descricao}
                            </p>
                        </div>
                    </Card>
                )}

                {/* Sistema de Níveis - Simplificado */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">Nível {character.level}</h3>
                        <Button
                            variant="accent"
                            size="sm"
                            onClick={handleLevelUp}
                            disabled={!character.isEditable || validationLoading}
                            className="text-xs"
                        >
                            Subir Nível
                        </Button>
                    </div>

                    {validationLoading && (
                        <div className="animate-pulse mb-3">
                            <div className="h-6 bg-gray-200 rounded"></div>
                        </div>
                    )}

                    {/* Exibir validação inline se houver erro */}
                    {!validationLoading && validation.hasError && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            {validation.errors.map((error, index) => (
                                <div key={index}>⚠️ {error}</div>
                            ))}
                        </div>
                    )}

                    {/* Resumo de Pontos */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Pontos Atributo</span>
                            <span className="font-semibold text-gray-800">{character.availableAttributePoints}</span>
                        </div>
                        <div className="flex justify-between bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Pontos Perícia</span>
                            <span className="font-semibold text-gray-800">{character.availableSkillPoints}</span>
                        </div>
                        <div className="flex justify-between bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Pontos Aprimor.</span>
                            <span className="font-semibold text-gray-800">{calculateRemainingEnhancementPoints(character.level, character.enhancements)}</span>
                        </div>
                        <div className="flex justify-between bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Defeitos</span>
                            <span className="font-semibold text-red-600">{character.defects?.length || 0}/2</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Seleção de Atributos para Sem Clã e Mutação */}
            <Modal
                isOpen={showAttributeModal}
                onClose={() => setShowAttributeModal(false)}
                title={pendingClanSelection === 'Sem Clã' ? 'Selecione 2 Atributos' : 'Selecione 1 Atributo'}
                size="sm"
            >
                <div className="space-y-3">
                    <p className="text-xs text-gray-600">
                        {pendingClanSelection === 'Sem Clã'
                            ? 'Escolha 2 atributos para +1 em cada'
                            : 'Escolha 1 atributo para +1'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {['strength', 'vigor', 'agility', 'intelligence', 'perception', 'essence', 'influence'].map(attr => {
                            const attrNames: Record<string, string> = {
                                'strength': 'FOR',
                                'vigor': 'VIG',
                                'agility': 'AGI',
                                'intelligence': 'INT',
                                'perception': 'PER',
                                'essence': 'ESS',
                                'influence': 'INF'
                            };
                            const attrLongNames: Record<string, string> = {
                                'strength': 'Força',
                                'vigor': 'Vigor',
                                'agility': 'Agilidade',
                                'intelligence': 'Inteligência',
                                'perception': 'Percepção',
                                'essence': 'Essência',
                                'influence': 'Influência'
                            };
                            const isSelected = selectedAttributes.includes(attr);
                            const maxSelections = pendingClanSelection === 'Sem Clã' ? 2 : 1;
                            const canSelect = isSelected || selectedAttributes.length < maxSelections;

                            return (
                                <button
                                    key={attr}
                                    onClick={() => {
                                        if (isSelected) {
                                            setSelectedAttributes(selectedAttributes.filter(a => a !== attr));
                                        } else if (canSelect) {
                                            setSelectedAttributes([...selectedAttributes, attr]);
                                        }
                                    }}
                                    disabled={!canSelect && !isSelected}
                                    className={`p-2 rounded-md border transition-all text-left ${isSelected
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-200 bg-white hover:border-primary/50 text-gray-700'
                                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold">{attrNames[attr]}</span>
                                        {isSelected && <span className="text-primary text-xs">✓</span>}
                                    </div>
                                    <div className="text-[10px] text-gray-500">{attrLongNames[attr]}</div>
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowAttributeModal(false)}
                            className="text-xs"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="accent"
                            size="sm"
                            onClick={handleConfirmAttributes}
                            disabled={selectedAttributes.length === 0}
                            className="text-xs"
                        >
                            Confirmar ({selectedAttributes.length}/{pendingClanSelection === 'Sem Clã' ? '2' : '1'})
                        </Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
};
