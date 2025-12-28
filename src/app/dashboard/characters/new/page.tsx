'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Character, createEmptyCharacter } from '@/lib/gameConstants';
import { AuthService } from '@/lib/auth';
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
import { syncCharacterData } from '@/lib/api/characters';
import { useRouter } from 'next/navigation';

export default function NewCharacterPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'sheet' | 'jutsus' | 'items'>('sheet');

    useEffect(() => {
        if (!authLoading && user) {
            initializeCharacter();
        } else if (!authLoading && !user) {
            window.location.href = '/login';
        }
    }, [user, authLoading]);

    const initializeCharacter = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const emptyCharacter = createEmptyCharacter(user.id, 'Novo Personagem', 'no_clan', 12);
            setCharacter(emptyCharacter);
        } catch (error) {
            console.error('Erro ao inicializar personagem:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!character || !user) return;

        setSaving(true);
        setSaveError(null);
        
        try {
            console.log('💾 Iniciando salvamento do personagem...', {
                hasId: !!character.id,
                name: character.name,
                enhancementsCount: character.enhancements?.length || 0,
                defectsCount: character.defects?.length || 0
            });

            // Sincronizar todos os dados do personagem
            // IMPORTANTE: Passar uma cópia do character para não modificar o estado diretamente
            const characterToSave = { ...character };
            const success = await syncCharacterData(characterToSave);
            
            if (success) {
                // Atualizar o character com o ID retornado
                if (characterToSave.id && characterToSave.id !== character.id) {
                    setCharacter(characterToSave);
                }

                // Redirecionar para a página de visualização
                if (characterToSave.id) {
                    console.log('✅ Personagem salvo, redirecionando para:', characterToSave.id);
                    router.push(`/dashboard/characters/${characterToSave.id}`);
                } else {
                    console.error('⚠️ Personagem salvo mas não retornou ID');
                    setSaveError('Personagem salvo, mas houve um problema ao obter o ID. Recarregue a página.');
                    setSaving(false);
                }
            } else {
                console.error('❌ Falha ao salvar personagem');
                setSaveError('Erro ao salvar personagem. Verifique o console para mais detalhes.');
            }
        } catch (error) {
            console.error('❌ Erro ao salvar personagem:', error);
            setSaveError(`Erro ao salvar personagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        } finally {
            // Não definir setSaving(false) aqui se foi redirecionado com sucesso
            if (!character.id || saveError) {
                setSaving(false);
            }
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
                            <h1 className="heading-2 text-white">Nova Ficha</h1>
                        </Flex>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            {saveError && (
                                <div className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded border border-red-200">
                                    {saveError}
                                </div>
                            )}
                            <Button
                                variant="secondary"
                                onClick={handleSave}
                                disabled={saving || !character.isEditable}
                                className="bg-white hover:bg-gray-50 text-primary border-white"
                            >
                                {saving ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={async () => {
                                    await AuthService.signOut();
                                    window.location.href = '/login';
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Sair
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



