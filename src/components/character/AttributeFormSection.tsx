import React, { useState, useEffect } from 'react';
import { Character } from '@/lib/gameConstants';
import { Card, Button, Grid } from '@/components/ui';
import { useAttributes } from '@/lib/hooks/useAttributes';

interface AttributeFormSectionProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const AttributeFormSection: React.FC<AttributeFormSectionProps> = ({
    character,
    onCharacterUpdate
}) => {
    const { attributeMapping, loading, error } = useAttributes();

    const handleSpendAttributePoint = (attributeKey: keyof Character['baseAttributes']) => {
        if (!character || character.availableAttributePoints <= 0) return;

        const updatedCharacter = {
            ...character,
            distributedAttributes: {
                ...character.distributedAttributes,
                [attributeKey]: character.distributedAttributes[attributeKey] + 1,
            },
            availableAttributePoints: character.availableAttributePoints - 1,
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    const handleRemoveAttributePoint = (attributeKey: keyof Character['baseAttributes']) => {
        if (!character || character.distributedAttributes[attributeKey] <= 0) return;

        const updatedCharacter = {
            ...character,
            distributedAttributes: {
                ...character.distributedAttributes,
                [attributeKey]: character.distributedAttributes[attributeKey] - 1,
            },
            availableAttributePoints: character.availableAttributePoints + 1,
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    if (loading) {
        return (
            <Card>
                <h2 className="heading-4 mb-4">Atributos</h2>
                <div className="space-y-3">
                    {[...Array(7)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <h2 className="heading-4 mb-4">Atributos</h2>
                <div className="text-red-600 text-sm">
                    {error}
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className="heading-4 mb-4">Atributos</h2>

            <div className="space-y-3">
                {attributeMapping.map((attr) => {
                    const baseValue = character.baseAttributes[attr.key as keyof Character['baseAttributes']];
                    const distributed = character.distributedAttributes[attr.key as keyof Character['baseAttributes']];
                    const bonus = character.attributeBonuses[attr.key as keyof Character['baseAttributes']];
                    const total = baseValue + distributed + bonus;

                    return (
                        <Card key={attr.key} variant="outlined" className="bg-white/70">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        {attr.name} ({attr.abbreviation})
                                    </label>
                                    <p className="text-xs text-gray-500">{attr.category}</p>
                                </div>
                                <div className="flex space-x-1">
                                    {distributed > 0 && character.isEditable && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveAttributePoint(attr.key as keyof Character['baseAttributes'])}
                                            className="px-2 py-1 text-xs"
                                        >
                                            -1
                                        </Button>
                                    )}
                                    {character.availableAttributePoints > 0 && character.isEditable && (
                                        <Button
                                            variant="accent"
                                            size="sm"
                                            onClick={() => handleSpendAttributePoint(attr.key as keyof Character['baseAttributes'])}
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
                                        {baseValue}
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
                                                [attr.key]: parseInt(e.target.value) || 0
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
