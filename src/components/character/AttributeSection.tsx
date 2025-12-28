import React from 'react';
import { Character } from '@/lib/gameConstants';
import { AttributeFormSection } from './AttributeFormSection';

interface AttributeSectionProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const AttributeSection: React.FC<AttributeSectionProps> = ({
    character,
    onCharacterUpdate
}) => {
    return (
        <AttributeFormSection 
            character={character} 
            onCharacterUpdate={onCharacterUpdate} 
        />
    );
};
