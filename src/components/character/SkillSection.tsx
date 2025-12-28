import React, { useMemo } from 'react';
import { Character } from '@/lib/gameConstants';
import { Card } from '@/components/ui';
import { useAttributes } from '@/lib/hooks/useAttributes';
import { useSkills } from '@/lib/hooks/useSkills';
import { SkillItemCompact } from './SkillItemCompact';

interface SkillSectionProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const SkillSection: React.FC<SkillSectionProps> = ({
    character,
    onCharacterUpdate
}) => {
    const { attributeMapping } = useAttributes();
    const { skills, loading: skillsLoading, mapAttributeToKey } = useSkills();

    // Mapeamento de perícias do banco - usar todas as perícias diretamente
    const skillsList = useMemo(() => {
        return skills.map((skill) => ({
            id: skill.id,
            name: skill.nome,
            attribute: skill.atributo_base,
            abbreviation: skill.atributo_base
        }));
    }, [skills]);

    // Ordenar perícias alfabeticamente
    const sortedSkills = useMemo(() => {
        return [...skillsList].sort((a, b) =>
            a.name.localeCompare(b.name, 'pt-BR')
        );
    }, [skillsList]);

    // Função para obter o valor base de uma perícia usando apenas seu atributo base
    const getSkillBaseValue = (skillAttribute: string): number => {
        const attributeKey = mapAttributeToKey(skillAttribute) as keyof Character['baseAttributes'];
        if (!attributeKey) return 0;

        const baseValue = character.baseAttributes[attributeKey] || 0;
        const distributedValue = character.distributedAttributes[attributeKey] || 0;
        const bonusValue = character.attributeBonuses[attributeKey] || 0;

        return baseValue + distributedValue + bonusValue;
    };

    const handleSpendSkillPoint = (skillName: string) => {
        if (!character || character.availableSkillPoints <= 0) return;

        const updatedCharacter = {
            ...character,
            skillValues: {
                ...(character.skillValues || {}),
                [skillName]: ((character.skillValues || {})[skillName] || 0) + 1,
            },
            availableSkillPoints: character.availableSkillPoints - 1,
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    const handleRemoveSkillPoint = (skillName: string) => {
        if (!character || ((character.skillValues || {})[skillName] || 0) <= 0) return;

        const updatedCharacter = {
            ...character,
            skillValues: {
                ...(character.skillValues || {}),
                [skillName]: ((character.skillValues || {})[skillName] || 0) - 1,
            },
            availableSkillPoints: character.availableSkillPoints + 1,
            updatedAt: new Date(),
        };

        onCharacterUpdate(updatedCharacter);
    };

    return (
        <Card>
            <div className="mb-4">
                <h2 className="heading-4">Perícias</h2>
            </div>

            <div className="space-y-2">
                {skillsLoading ? (
                    <Card variant="outlined" className="p-6 text-center">
                        <div className="animate-pulse">Carregando perícias...</div>
                    </Card>
                ) : sortedSkills.length === 0 ? (
                    <Card variant="outlined" className="p-6 text-center">
                        <div className="text-gray-500 text-sm">Nenhuma perícia disponível. Execute o script SQL no Supabase.</div>
                    </Card>
                ) : (
                    /* Perícias do banco de dados - ordenadas alfabeticamente */
                    sortedSkills.map((skillData) => {
                        const distributed = (character.skillValues || {})[skillData.name] || 0;
                        const bonus = (character.skillBonuses || {})[skillData.name] || 0;

                        // Obter valor base usando apenas o atributo base da perícia
                        const base = getSkillBaseValue(skillData.attribute);
                        const total = base + distributed + bonus;

                        // Obter nome do atributo (não exibido mais, mas mantido para compatibilidade)
                        const attributeName = attributeMapping.find(
                            a => a.abbreviation === skillData.abbreviation
                        )?.name || skillData.abbreviation;

                        return (
                            <SkillItemCompact
                                key={skillData.id}
                                skillName={skillData.name}
                                attributeAbbr={skillData.abbreviation}
                                attributeName={attributeName}
                                description="" // Não mostramos descrição na versão compacta
                                base={base}
                                distributed={distributed}
                                bonus={bonus}
                                total={total}
                                isEditable={character.isEditable}
                                onAddPoint={() => character.availableSkillPoints > 0 ? handleSpendSkillPoint(skillData.name) : undefined}
                                onRemovePoint={distributed > 0 ? () => handleRemoveSkillPoint(skillData.name) : undefined}
                                onBonusChange={(value) => onCharacterUpdate({
                                    ...character,
                                    skillBonuses: {
                                        ...(character.skillBonuses || {}),
                                        [skillData.name]: value
                                    }
                                })}
                                showDescription={false}
                            />
                        );
                    })
                )}

            </div>
        </Card>
    );
};
