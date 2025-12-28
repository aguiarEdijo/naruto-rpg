'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Character } from '@/lib/gameConstants';
import { useAuth } from '@/contexts/AuthContext';
import { Container, Card, Button, Grid, Flex } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { fetchAllCharacters } from '@/lib/api/characters';
import { supabase } from '@/lib/supabase';

export default function GMCharactersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [userNames, setUserNames] = useState<Record<string, string>>({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            if (!user.is_gm) {
                router.push('/dashboard');
                return;
            }
            loadCharacters();
        }
    }, [user, authLoading, router]);

    const loadCharacters = async () => {
        try {
            setLoading(true);
            const fetchedCharacters = await fetchAllCharacters(true);
            setCharacters(fetchedCharacters);

            // Buscar nomes dos usuários
            const userIds = [...new Set(fetchedCharacters.map(c => c.userId))];
            const names: Record<string, string> = {};
            
            for (const userId of userIds) {
                const { data } = await supabase
                    .from('users')
                    .select('name')
                    .eq('id', userId)
                    .single();
                
                if (data) {
                    names[userId] = data.name;
                }
            }
            
            setUserNames(names);
        } catch (error) {
            console.error('Erro ao carregar fichas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCharacter = (characterId: string) => {
        router.push(`/dashboard/characters/${characterId}`);
    };

    const filteredCharacters = characters.filter(character => {
        const searchLower = searchTerm.toLowerCase();
        return (
            character.name.toLowerCase().includes(searchLower) ||
            character.clan.toLowerCase().includes(searchLower) ||
            userNames[character.userId]?.toLowerCase().includes(searchLower)
        );
    });

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
        <div className="min-h-screen bg-background">
            <GMHeader />

            <Container className="py-8">
                <div className="mb-6">
                    <h1 className="heading-2 mb-4">Todas as Fichas de Personagem</h1>
                    
                    {/* Barra de busca */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Buscar por nome, clã ou jogador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <p className="text-muted">
                        Total: {filteredCharacters.length} ficha{filteredCharacters.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {filteredCharacters.length === 0 ? (
                    <Card className="text-center p-8">
                        <p className="text-muted">
                            {searchTerm ? 'Nenhuma ficha encontrada com os critérios de busca.' : 'Nenhuma ficha cadastrada.'}
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCharacters.map((character) => (
                            <Card 
                                key={character.id} 
                                className="hover:shadow-lg transition-shadow cursor-pointer" 
                                onClick={() => handleSelectCharacter(character.id)}
                            >
                                <div className="p-6">
                                    <h3 className="heading-4 mb-2">{character.name}</h3>
                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex justify-between">
                                            <span>Jogador:</span>
                                            <span className="font-medium">{userNames[character.userId] || 'Desconhecido'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Clã:</span>
                                            <span className="font-medium">{character.clan}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Nível:</span>
                                            <span className="font-medium">{character.level}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Rank:</span>
                                            <span className="font-medium">{character.rank}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Idade:</span>
                                            <span className="font-medium">{character.age} anos</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectCharacter(character.id);
                                            }}
                                        >
                                            Ver Detalhes
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}

