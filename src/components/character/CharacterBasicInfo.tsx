import React from 'react';
import { Character, Attributes, calculateRemainingEnhancementPoints } from '@/lib/gameConstants';
import { Card, Input, Select, Button, Grid, Flex } from '@/components/ui';
import { KONOHA_CLANS, getAgeDescription, levelUpCharacter } from '@/lib/gameConstants';

interface CharacterBasicInfoProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const CharacterBasicInfo: React.FC<CharacterBasicInfoProps> = ({
    character,
    onCharacterUpdate
}) => {
    const selectedClan = KONOHA_CLANS.find((clan) => clan.id === character.clan);

    const handleClanChange = (newClan: string) => {
        const currentClan = KONOHA_CLANS.find(c => c.id === character.clan);
        const newClanData = KONOHA_CLANS.find(c => c.id === newClan);

        // Calcular diferença nos modificadores de atributos
        const attributeDifference: Partial<Attributes> = {};

        // Remover modificadores do clã atual
        if (currentClan?.modifiers) {
            Object.entries(currentClan.modifiers).forEach(([attr, modifier]) => {
                if (modifier) {
                    attributeDifference[attr as keyof Attributes] = -modifier;
                }
            });
        }

        // Adicionar modificadores do novo clã
        if (newClanData?.modifiers) {
            Object.entries(newClanData.modifiers).forEach(([attr, modifier]) => {
                if (modifier) {
                    attributeDifference[attr as keyof Attributes] = (attributeDifference[attr as keyof Attributes] || 0) + modifier;
                }
            });
        }

        // Aplicar as mudanças nos atributos base
        const newBaseAttributes = { ...character.baseAttributes };
        Object.entries(attributeDifference).forEach(([attr, difference]) => {
            if (difference) {
                newBaseAttributes[attr as keyof Attributes] += difference;
            }
        });

        onCharacterUpdate({
            ...character,
            clan: newClan,
            baseAttributes: newBaseAttributes
        });
    };

    const handleAgeChange = (newAge: number) => {
        onCharacterUpdate({
            ...character,
            age: newAge
        });
    };

    const handleLevelUp = () => {
        const updatedCharacter = levelUpCharacter(character);
        onCharacterUpdate(updatedCharacter);
    };

    return (
        <Card className="h-fit">
            <h2 className="heading-4 mb-4">Informações Básicas</h2>

            <div className="space-y-4">
                <Select
                    label="Clã"
                    value={character.clan}
                    disabled={!character.isEditable}
                    onChange={(e) => handleClanChange(e.target.value)}
                    options={KONOHA_CLANS.map(clan => ({
                        value: clan.id,
                        label: clan.name
                    }))}
                />

                <Input
                    label="Nome"
                    value={character.name}
                    disabled={!character.isEditable}
                    onChange={(e) => onCharacterUpdate({ ...character, name: e.target.value })}
                    placeholder="Digite o nome do personagem"
                />

                <div>
                    <label className="text-small font-medium text-gray-700 mb-1 block">
                        Idade
                    </label>
                    <Flex align="center" gap="sm">
                        <Input
                            type="number"
                            min="6"
                            max="100"
                            value={character.age}
                            disabled={!character.isEditable}
                            onChange={(e) => handleAgeChange(parseInt(e.target.value) || 12)}
                            className="w-16 text-center"
                        />
                        <span className="text-small text-gray-600">
                            {getAgeDescription(character.age)}
                        </span>
                    </Flex>
                </div>

                {selectedClan && (
                    <Card variant="outlined" className="bg-gray-50 border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-1 text-xs">
                            {selectedClan.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                            {selectedClan.specialAbility}
                        </p>
                    </Card>
                )}

                {/* Sistema de Níveis Simplificado */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">Sistema de Níveis</h3>
                        <Button
                            variant="accent"
                            size="sm"
                            onClick={handleLevelUp}
                            disabled={!character.isEditable}
                            className="text-xs"
                        >
                            Subir Nível
                        </Button>
                    </div>

                    <Grid cols={2} gap="sm" className="mb-3">
                        <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">{character.level}</div>
                            <div className="text-xs text-gray-600">Nível</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">{character.rank}</div>
                            <div className="text-xs text-gray-600">Patente</div>
                        </div>
                    </Grid>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Pontos Atributo:</span>
                            <span className="font-semibold text-gray-800">{character.availableAttributePoints}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Pontos Perícia:</span>
                            <span className="font-semibold text-gray-800">{character.availableSkillPoints}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Pontos Aprimoramento:</span>
                            <span className="font-semibold text-gray-800">{calculateRemainingEnhancementPoints(character.level, character.enhancements)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Defeitos:</span>
                            <span className="font-semibold text-red-600">{character.defects?.length || 0}/2</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
