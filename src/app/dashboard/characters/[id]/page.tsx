'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Character } from '@/lib/gameConstants';
import { useAuth } from '@/contexts/AuthContext';
import { Container, Card, Button, Grid, Flex } from '@/components/ui';
import { CharacterBasicInfo } from '@/components/character/CharacterBasicInfo';
import { CharacterImage } from '@/components/character/CharacterImage';
import { AttributeSection } from '@/components/character/AttributeSection';
import { SkillSection } from '@/components/character/SkillSection';
import { ResourcesSection } from '@/components/character/ResourcesSection';
import { JutsuSection } from '@/components/character/JutsuSection';
import { ItemSection } from '@/components/character/ItemSection';
import { EnhancementsAndDefects } from '@/components/character/EnhancementsAndDefects';
import { fetchCharacterById } from '@/lib/api/characters';

export default function CharacterViewPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const characterId = params?.id as string;
    
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'sheet' | 'jutsus' | 'items'>('sheet');

    useEffect(() => {
        if (!authLoading && user && characterId) {
            loadCharacter();
        } else if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, characterId, router]);

    const loadCharacter = async () => {
        if (!characterId) return;
        
        try {
            setLoading(true);
            const fetchedCharacter = await fetchCharacterById(characterId);
            
            if (!fetchedCharacter) {
                router.push('/dashboard/characters');
                return;
            }
            
            // Verificar se o usuário tem permissão para ver/editar esta ficha
            const canEdit = fetchedCharacter.userId === user?.id && fetchedCharacter.isEditable;
            setEditing(false);
            
            setCharacter(fetchedCharacter);
        } catch (error) {
            console.error('Erro ao carregar personagem:', error);
            router.push('/dashboard/characters');
        } finally {
            setLoading(false);
        }
    };

    const handleCharacterUpdate = (updatedCharacter: Character) => {
        setCharacter(updatedCharacter);
    };

    const handleImageUpdate = (imageUrl: string | null) => {
        console.log('Imagem atualizada:', imageUrl);
    };

    if (authLoading || loading || !character) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted">Carregando...</p>
                </Card>
            </div>
        );
    }

    const canEdit = character.userId === user?.id && character.isEditable;
    const isOwner = character.userId === user?.id;

    return (
        <div className="min-h-screen bg-background relative">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                style={{
                    backgroundImage: `url('/assets_task_01k893tbr8fjcsx7bs3vqhe6cd_1761242713_img_0.webp')`
                }}
            />
            <div className="relative z-10">
            {/* Header */}
            <div className="bg-primary shadow-lg border-b-4 border-primary/20">
                <Container>
                    <Flex justify="between" align="center" className="py-4">
                        <Flex align="center" gap="md">
                            <Link href="/dashboard/characters" className="text-white hover:text-white/80 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="heading-2 text-white">{character.name}</h1>
                            {!isOwner && (
                                <span className="text-sm text-white/80 bg-white/20 px-2 py-1 rounded">Visualização</span>
                            )}
                        </Flex>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            {canEdit && (
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        if (editing) {
                                            setEditing(false);
                                        } else {
                                            router.push(`/dashboard/characters/${characterId}?edit=true`);
                                            setEditing(true);
                                        }
                                    }}
                                    className="bg-white hover:bg-gray-50 text-primary border-white"
                                >
                                    {editing ? 'Cancelar Edição' : 'Editar'}
                                </Button>
                            )}
                            <Button
                                variant="danger"
                                onClick={async () => {
                                    router.push('/dashboard/characters');
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Voltar
                            </Button>
                        </div>
                    </Flex>
                </Container>
            </div>

            <Container className="py-6">
                {/* Sistema de Abas */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('sheet')}
                            className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'sheet'
                                ? 'border-b-2 border-orange-500 text-orange-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Ficha
                        </button>
                        <button
                            onClick={() => setActiveTab('jutsus')}
                            className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'jutsus'
                                ? 'border-b-2 border-orange-500 text-orange-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Jutsus
                        </button>
                        <button
                            onClick={() => setActiveTab('items')}
                            className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'items'
                                ? 'border-b-2 border-orange-500 text-orange-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Itens
                        </button>
                    </div>
                </div>

                {/* Conteúdo das Abas */}
                {activeTab === 'sheet' && (
                    <>
                        {/* Layout Principal: Responsivo */}
                        <Grid cols={1} gap="md" className="mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

                        {/* Layout Principal: Responsivo */}
                        <Grid cols={1} gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                    </>
                )}

                {activeTab === 'jutsus' && (
                    <div className="max-w-4xl mx-auto px-4 sm:px-0">
                        <JutsuSection
                            character={character}
                            onCharacterUpdate={handleCharacterUpdate}
                        />
                    </div>
                )}

                {activeTab === 'items' && (
                    <div className="max-w-4xl mx-auto px-4 sm:px-0">
                        <ItemSection
                            character={character}
                            onCharacterUpdate={handleCharacterUpdate}
                        />
                    </div>
                )}
            </Container>
            </div>
        </div>
    );
}

