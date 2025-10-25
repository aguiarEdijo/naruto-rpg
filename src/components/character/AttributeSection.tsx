import React from 'react';
import { Character } from '@/lib/gameConstants';
import { Card, Button, Grid } from '@/components/ui';

interface AttributeSectionProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const AttributeSection: React.FC<AttributeSectionProps> = ({
    character,
    onCharacterUpdate
}) => {
    const handleSpendAttributePoint = (attribute: keyof Character['baseAttributes']) => {
        if (!character || character.availableAttributePoints <= 0) return;

        const updatedCharacter = {
            ...character,
            distributedAttributes: {
                ...character.distributedAttributes,
                [attribute]: character.distributedAttributes[attribute] + 1,
            },
            availableAttributePoints: character.availableAttributePoints - 1,
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    const handleRemoveAttributePoint = (attribute: keyof Character['baseAttributes']) => {
        if (!character || character.distributedAttributes[attribute] <= 0) return;

        const updatedCharacter = {
            ...character,
            distributedAttributes: {
                ...character.distributedAttributes,
                [attribute]: character.distributedAttributes[attribute] - 1,
            },
            availableAttributePoints: character.availableAttributePoints + 1,
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    return (
        <Card>
            <h2 className="heading-4 mb-4">Atributos</h2>

            <div className="space-y-3">
                {Object.entries(character.baseAttributes).map(([key, baseValue]) => {
                    const distributed = character.distributedAttributes[key as keyof typeof character.distributedAttributes];
                    const bonus = character.attributeBonuses[key as keyof typeof character.attributeBonuses];
                    const total = (baseValue as number) + distributed + bonus;

                    return (
                        <Card key={key} variant="outlined" className="bg-white/70">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <div className="flex space-x-1">
                                    {character.distributedAttributes[key as keyof typeof character.distributedAttributes] > 0 && character.isEditable && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveAttributePoint(key as keyof Character['baseAttributes'])}
                                            className="px-2 py-1 text-xs"
                                        >
                                            -1
                                        </Button>
                                    )}
                                    {character.availableAttributePoints > 0 && character.isEditable && (
                                        <Button
                                            variant="accent"
                                            size="sm"
                                            onClick={() => handleSpendAttributePoint(key as keyof Character['baseAttributes'])}
                                            className="px-2 py-1 text-xs"
                                        >
                                            +1
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Grid cols={4} gap="sm">
                                <div>
                                    <label className="text-xs text-gray-500">Base</label>
                                    <div className="w-full px-1 py-1 text-xs bg-gray-100 border border-gray-300 rounded text-center font-semibold">
                                        {baseValue as number}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Dist.</label>
                                    <div className="w-full px-1 py-1 text-xs bg-blue-100 border border-gray-300 rounded text-center font-semibold">
                                        {distributed}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Bônus</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        value={String(bonus)}
                                        disabled={!character.isEditable}
                                        onChange={(e) => onCharacterUpdate({
                                            ...character,
                                            attributeBonuses: {
                                                ...character.attributeBonuses,
                                                [key]: parseInt(e.target.value) || 0
                                            }
                                        })}
                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100 text-center"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Total</label>
                                    <div className="w-full px-1 py-1 text-xs bg-green-100 border border-gray-300 rounded text-center font-semibold text-green-800">
                                        {total}
                                    </div>
                                </div>
                            </Grid>
                        </Card>
                    );
                })}
            </div>
        </Card>
    );
};
