'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Character, createEmptyCharacter } from '@/lib/gameConstants';
import { Container, Card, Button, Grid, Flex } from '@/components/ui';
import { CharacterBasicInfo } from '@/components/character/CharacterBasicInfo';
import { CharacterImage } from '@/components/character/CharacterImage';
import { AttributeSection } from '@/components/character/AttributeSection';
import { SkillSection } from '@/components/character/SkillSection';
import { ResourcesSection } from '@/components/character/ResourcesSection';
import { EnhancementsAndDefects } from '@/components/character/EnhancementsAndDefects';

export default function CharacterSheet() {
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCharacter();
    }, []);

    const loadCharacter = async () => {
        try {
            // Criar um personagem vazio para demonstração
            const emptyCharacter = createEmptyCharacter('example-user', '', 'no_clan', 12);
            setCharacter(emptyCharacter);
        } catch (error) {
            console.error('Erro ao carregar personagem:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!character) return;

        setSaving(true);
        try {
            console.log('Salvando personagem:', character);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Erro ao salvar personagem:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCharacterUpdate = (updatedCharacter: Character) => {
        setCharacter(updatedCharacter);
    };

    const handleImageUpdate = (imageUrl: string | null) => {
        // Implementar lógica de atualização de imagem se necessário
        console.log('Imagem atualizada:', imageUrl);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted">Carregando...</p>
                </Card>
            </div>
        );
    }

    if (!character) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card variant="outlined" className="bg-red-50 border-red-200 text-red-700 p-6">
                    Personagem não encontrado
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary shadow-lg border-b-4 border-primary/20">
                <Container>
                    <Flex justify="between" align="center" className="py-4">
                        <Flex align="center" gap="md">
                            <Link href="/" className="text-white hover:text-white/80 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="heading-2 text-white">Ficha de Personagem</h1>
                        </Flex>
                        <Button
                            variant="secondary"
                            onClick={handleSave}
                            disabled={saving || !character.isEditable}
                            className="bg-white hover:bg-gray-50 text-primary border-white"
                        >
                            {saving ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </Flex>
                </Container>
            </div>

            <Container className="py-6">
                {/* Layout Principal: 3 Colunas */}
                <Grid cols={3} gap="md" className="mb-6">
                    <CharacterBasicInfo
                        character={character}
                        onCharacterUpdate={handleCharacterUpdate}
                    />
                    <CharacterImage
                        character={character}
                        onImageUpdate={handleImageUpdate}
                    />
                    <ResourcesSection
                        character={character}
                        onCharacterUpdate={handleCharacterUpdate}
                    />
                </Grid>

                {/* Layout Principal: 3 Colunas */}
                <Grid cols={3} gap="md">
                    <AttributeSection
                        character={character}
                        onCharacterUpdate={handleCharacterUpdate}
                    />
                    <SkillSection
                        character={character}
                        onCharacterUpdate={handleCharacterUpdate}
                    />
                    <EnhancementsAndDefects
                        character={character}
                        onCharacterUpdate={handleCharacterUpdate}
                    />
                </Grid>
            </Container>
        </div>
    );
}