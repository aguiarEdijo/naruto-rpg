import React, { useMemo } from 'react';
import { Character, calculatePhysicalResistance as calcRF, calculateMentalResistance as calcRM } from '@/lib/gameConstants';
import { Card, Badge } from '@/components/ui';
import { ResourceField } from './ResourceField';
import { useResourceCalculationRules } from '@/hooks/queries/useGameRules';

interface ResourcesSectionProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
    character,
    onCharacterUpdate
}) => {
    // Buscar regras de cálculo do banco de dados
    const { data: resourceRules = [] } = useResourceCalculationRules();

    // Preparar atributos totais
    const totalAttributes = useMemo(() => ({
        strength: character.baseAttributes.strength + character.distributedAttributes.strength + character.attributeBonuses.strength,
        agility: character.baseAttributes.agility + character.distributedAttributes.agility + character.attributeBonuses.agility,
        vigor: character.baseAttributes.vigor + character.distributedAttributes.vigor + character.attributeBonuses.vigor,
        intelligence: character.baseAttributes.intelligence + character.distributedAttributes.intelligence + character.attributeBonuses.intelligence,
        essence: character.baseAttributes.essence + character.distributedAttributes.essence + character.attributeBonuses.essence,
        perception: character.baseAttributes.perception + character.distributedAttributes.perception + character.attributeBonuses.perception,
        influence: character.baseAttributes.influence + character.distributedAttributes.influence + character.attributeBonuses.influence,
    }), [character]);

    // Organizar regras por tipo
    const rulesByType = useMemo(() => {
        const rules: Record<string, any> = {};
        resourceRules.forEach(rule => {
            rules[rule.rule_type] = rule;
        });
        return rules;
    }, [resourceRules]);

    // Calcular resistências usando regras do banco (com fallback)
    const calculatePhysicalResistance = () => {
        return calcRF(totalAttributes, rulesByType);
    };

    const calculateMentalResistance = () => {
        return calcRM(totalAttributes, rulesByType);
    };

    const handleResourceUpdate = (resourceType: keyof Character['resources'], field: 'base' | 'additional' | 'temporary', value: number) => {
        // Implementar lógica de atualização de recursos quando necessário
        console.log(`Updating ${resourceType}.${field} to ${value}`);
    };

    const handleResistanceUpdate = (resistanceType: 'physical' | 'mental', field: 'additional' | 'temporary', value: number) => {
        // Por enquanto, vamos apenas logar as mudanças
        // Em uma implementação completa, isso seria salvo no estado do personagem
        console.log(`Updating ${resistanceType} resistance ${field} to ${value}`);
    };

    const resetTemporaryResistance = (resistanceType: 'physical' | 'mental') => {
        console.log(`Resetting temporary ${resistanceType} resistance`);
    };
    return (
        <Card>
            <h2 className="heading-4 mb-4">Recursos</h2>

            <div className="space-y-4">
                <div className="space-y-3">
                    <ResourceField
                        label="Vida"
                        base={character.resources.health}
                        additional={0}
                        temporary={0}
                        total={character.resources.health}
                        isEditable={character.isEditable}
                        onBaseChange={(value) => handleResourceUpdate('health', 'base', value)}
                    />

                    <ResourceField
                        label="Chakra"
                        base={character.resources.chakra}
                        additional={0}
                        temporary={0}
                        total={character.resources.chakra}
                        isEditable={character.isEditable}
                        onBaseChange={(value) => handleResourceUpdate('chakra', 'base', value)}
                    />

                    <ResourceField
                        label="Resistência Física"
                        base={calculatePhysicalResistance()}
                        additional={0}
                        temporary={0}
                        total={calculatePhysicalResistance()}
                        isEditable={character.isEditable}
                        baseEditable={false}
                        onAdditionalChange={(value) => handleResistanceUpdate('physical', 'additional', value)}
                        onTemporaryChange={(value) => handleResistanceUpdate('physical', 'temporary', value)}
                        onResetTemporary={() => resetTemporaryResistance('physical')}
                    />

                    <ResourceField
                        label="Resistência Mental"
                        base={calculateMentalResistance()}
                        additional={0}
                        temporary={0}
                        total={calculateMentalResistance()}
                        isEditable={character.isEditable}
                        baseEditable={false}
                        onAdditionalChange={(value) => handleResistanceUpdate('mental', 'additional', value)}
                        onTemporaryChange={(value) => handleResistanceUpdate('mental', 'temporary', value)}
                        onResetTemporary={() => resetTemporaryResistance('mental')}
                    />
                </div>
            </div>

            {/* Sistema de Emoções */}
            <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Emoções</h3>
                <div className="bg-white/70 rounded-lg p-3">
                    <div className="flex items-center justify-center space-x-1">
                        {Array.from({ length: 10 }, (_, i) => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-full border-2 transition-colors cursor-pointer ${i < character.emotions
                                    ? 'bg-gray-600 border-gray-700'
                                    : 'bg-gray-200 border-gray-300'
                                    } ${character.isEditable ? 'hover:scale-110' : ''}`}
                                onClick={() => {
                                    if (character.isEditable) {
                                        onCharacterUpdate({
                                            ...character,
                                            emotions: i + 1
                                        });
                                    }
                                }}
                                title={character.isEditable ? `Clique para definir emoções como ${i + 1}` : ''}
                            />
                        ))}
                    </div>
                    <div className="text-center mt-2">
                        <Badge variant="default">
                            {character.emotions}/10
                        </Badge>
                    </div>
                </div>
            </div>
        </Card >
    );
};
