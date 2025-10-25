import React from 'react';
import { Character, calculateSkills } from '@/lib/gameConstants';
import { Card, Button, Grid } from '@/components/ui';

interface SkillSectionProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const SkillSection: React.FC<SkillSectionProps> = ({
    character,
    onCharacterUpdate
}) => {
    const handleSpendSkillPoint = (skill: keyof Character['skills']) => {
        if (!character || character.availableSkillPoints <= 0) return;

        const updatedCharacter = {
            ...character,
            skills: {
                ...character.skills,
                [skill]: character.skills[skill] + 1,
            },
            availableSkillPoints: character.availableSkillPoints - 1,
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    const handleRemoveSkillPoint = (skill: keyof Character['skills']) => {
        if (!character || character.skills[skill] <= 0) return;

        const updatedCharacter = {
            ...character,
            skills: {
                ...character.skills,
                [skill]: character.skills[skill] - 1,
            },
            availableSkillPoints: character.availableSkillPoints + 1,
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    return (
        <Card>
            <h2 className="heading-4 mb-4">Perícias</h2>

            <div className="space-y-3">
                {Object.entries(character.skills).map(([key, distributed]) => {
                    const bonus = character.skillBonuses[key as keyof typeof character.skillBonuses];

                    // Calcular atributos totais para o cálculo da base
                    const totalAttributes = {
                        strength: character.baseAttributes.strength + character.distributedAttributes.strength + character.attributeBonuses.strength,
                        agility: character.baseAttributes.agility + character.distributedAttributes.agility + character.attributeBonuses.agility,
                        vigor: character.baseAttributes.vigor + character.distributedAttributes.vigor + character.attributeBonuses.vigor,
                        intelligence: character.baseAttributes.intelligence + character.distributedAttributes.intelligence + character.attributeBonuses.intelligence,
                        essence: character.baseAttributes.essence + character.distributedAttributes.essence + character.attributeBonuses.essence,
                        perception: character.baseAttributes.perception + character.distributedAttributes.perception + character.attributeBonuses.perception,
                    };

                    const baseSkills = calculateSkills(totalAttributes);
                    const base = baseSkills[key as keyof typeof baseSkills];
                    const total = base + (distributed as number) + bonus;

                    return (
                        <Card key={key} variant="outlined" className="bg-white/70">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <div className="flex space-x-1">
                                    {(distributed as number) > 0 && character.isEditable && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveSkillPoint(key as keyof Character['skills'])}
                                            className="px-2 py-1 text-xs"
                                        >
                                            -1
                                        </Button>
                                    )}
                                    {character.availableSkillPoints > 0 && character.isEditable && (
                                        <Button
                                            variant="accent"
                                            size="sm"
                                            onClick={() => handleSpendSkillPoint(key as keyof Character['skills'])}
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
                                        {base}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Dist.</label>
                                    <div className="w-full px-1 py-1 text-xs bg-purple-100 border border-gray-300 rounded text-center font-semibold">
                                        {distributed as number}
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
                                            skillBonuses: {
                                                ...character.skillBonuses,
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
