'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Character } from '@/lib/gameConstants';
import { useAuth } from '@/contexts/AuthContext';
import { Container, Card, Button, Grid, Flex } from '@/components/ui';
import { fetchAllCharacters } from '@/lib/api/characters';

export default function CharactersPage() {
    const { user, loading: authLoading } = useAuth();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGM, setIsGM] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            setIsGM(user.is_gm || false);
            loadCharacters();
        }
    }, [user, authLoading, router]);

    const loadCharacters = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const fetchedCharacters = await fetchAllCharacters(false);
            setCharacters(fetchedCharacters);
        } catch (error) {
            console.error('Erro ao carregar fichas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCharacter = async () => {
        router.push('/dashboard/characters/new');
    };

    const handleSelectCharacter = (characterId: string) => {
        router.push(`/dashboard/characters/${characterId}`);
    };

    if (authLoading || loading) {
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
                            <Link href="/" className="text-white hover:text-white/80 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="heading-2 text-white">Minhas Fichas</h1>
                        </Flex>
                        <Flex align="center" gap="md">
                            {isGM && (
                                <Link href="/dashboard/gm">
                                    <Button
                                        variant="secondary"
                                        className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                                    >
                                        🔐 Painel GM
                                    </Button>
                                </Link>
                            )}
                            <Button
                                variant="accent"
                                onClick={handleCreateCharacter}
                                className="bg-white hover:bg-gray-50 text-primary border-white"
                            >
                                + Nova Ficha
                            </Button>
                        </Flex>
                    </Flex>
                </Container>
            </div>

            <Container className="py-8">
                {characters.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Card className="max-w-md w-full text-center p-8">
                            <div className="mb-6">
                                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h2 className="heading-3 mb-2">Nenhuma Ficha Criada</h2>
                                <p className="text-small text-muted mb-6">
                                    Crie sua primeira ficha de personagem para começar a jogar
                                </p>
                            </div>
                            <Button
                                onClick={handleCreateCharacter}
                                variant="accent"
                                size="lg"
                                className="w-full"
                            >
                                Criar Primeira Ficha
                            </Button>
                        </Card>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {characters.map((character) => (
                            <Card key={character.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectCharacter(character.id)}>
                                <div className="p-6">
                                    <h3 className="heading-4 mb-2">{character.name}</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Clã:</span>
                                            <span className="font-medium">{character.clan}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Nível:</span>
                                            <span className="font-medium">{character.level}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Idade:</span>
                                            <span className="font-medium">{character.age} anos</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
            </div>
        </div>
    );
}