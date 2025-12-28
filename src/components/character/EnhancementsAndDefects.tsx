import React, { useState } from 'react';
import { Character } from '@/lib/gameConstants';
import { Card, Button, Modal } from '@/components/ui';
import { useDefects } from '@/lib/hooks/useDefects';
import { useEnhancements } from '@/lib/hooks/useEnhancements';

interface EnhancementsAndDefectsProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const EnhancementsAndDefects: React.FC<EnhancementsAndDefectsProps> = ({
    character,
    onCharacterUpdate
}) => {
    const { defects, loading: defectsLoading, getTypeColor, getTypeIcon } = useDefects();
    const { enhancements, loading: enhancementsLoading, getGeneral, getByClan, getClanColor, getClanIcon, formatRequisitos } = useEnhancements();
    const [activeTab, setActiveTab] = useState<'gerais' | 'clan' | 'defects'>('gerais');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDefectModal, setShowDefectModal] = useState(false);

    // Mapear ID do sistema para nome do clã no banco
    const CLAN_ID_TO_NAME: Record<string, string | null> = {
        'uchiha': 'Uchiha',
        'hyuga': 'Hyuga',
        'nara': 'Nara',
        'akimichi': 'Akimichi',
        'uzumaki': 'Uzumaki',
        'yamanaka': 'Yamanaka',
        'aburame': 'Aburame',
        'inuzuka': 'Inuzuka',
        'senju': 'Senju',
        'no_clan': null, // Sem clã não tem aprimoramentos específicos
        'mutation': null  // Mutação não tem aprimoramentos específicos
    };

    // Obter nome do clã no banco
    const clanName = CLAN_ID_TO_NAME[character.clan] || character.clan;

    // Obter aprimoramentos filtrados
    const generalEnhancements = getGeneral();
    const clanEnhancements = clanName ? getByClan(clanName) : [];
    const availableEnhancements = activeTab === 'gerais' ? generalEnhancements : clanEnhancements;

    return (
        <>
            <Card>
                <div className="flex flex-col justify-between  mb-4">
                    <h2 className="heading-4">Aprimoramentos & Defeitos</h2>
                    <div className="flex justify-start mt-4">
                        {character.isEditable && (
                            <Button
                                variant="accent"
                                size="sm"
                                onClick={() => setShowCreateModal(true)}
                                className="text-xs bg-[#7A8B7B] hover:bg-[#7C9BA6] text-white"
                            >
                                Criar Aprimoramento
                            </Button>
                        )}
                    </div>
                </div>

                {/* Sistema de Tabs */}
                <div className="mb-4">
                    <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('gerais')}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${activeTab === 'gerais'
                                ? 'bg-accent text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            Gerais
                        </button>
                        <button
                            onClick={() => setActiveTab('clan')}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${activeTab === 'clan'
                                ? 'bg-accent text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            Clã
                        </button>
                        <button
                            onClick={() => setActiveTab('defects')}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${activeTab === 'defects'
                                ? 'bg-accent text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            Defeitos
                        </button>
                    </div>
                </div>

                {/* Conteúdo das Abas */}
                {activeTab === 'defects' ? (
                    /* Aba de Defeitos */
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-semibold text-gray-700">Defeitos</h4>
                            {character.isEditable && (
                                <Button
                                    variant="accent"
                                    size="sm"
                                    onClick={() => setShowDefectModal(true)}
                                    className="text-xs"
                                >
                                    Adicionar Defeito
                                </Button>
                            )}
                        </div>

                        {/* Lista de Defeitos */}
                        {character.defects && character.defects.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {character.defects.map((defect) => {
                                    // Buscar dados completos do defeito no banco
                                    const fullDefect = defects.find(d => d.nome === defect.name);
                                    const typeColor = getTypeColor(fullDefect?.tipo || 'Comportamental');
                                    const typeIcon = getTypeIcon(fullDefect?.tipo || 'Comportamental');

                                    return (
                                        <Card
                                            key={defect.id}
                                            variant="outlined"
                                            className={`${typeColor} border-opacity-50`}
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className="text-sm flex-shrink-0">{typeIcon}</span>
                                                        <h4 className="font-semibold text-gray-800 text-xs flex-shrink-0">
                                                            {defect.name}
                                                        </h4>
                                                        {fullDefect?.tipo && (
                                                            <span className="px-1.5 py-0.5 bg-white/70 rounded text-xs text-gray-600 flex-shrink-0">
                                                                {fullDefect.tipo}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                        {fullDefect?.descricao || defect.description}
                                                    </p>
                                                </div>
                                                {character.isEditable && (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            onCharacterUpdate({
                                                                ...character,
                                                                defects: character.defects?.filter(d => d.id !== defect.id) || []
                                                            });
                                                        }}
                                                        className="text-xs px-2 py-1 flex-shrink-0"
                                                    >
                                                        ×
                                                    </Button>
                                                )}
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 text-sm py-4">
                                Nenhum defeito selecionado
                            </div>
                        )}
                    </div>
                ) : (
                    /* Abas de Aprimoramentos (Gerais e Clã) */
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-semibold text-gray-700">
                                {activeTab === 'gerais' ? 'Aprimoramentos Gerais' : 'Aprimoramentos do Clã'}
                            </h4>
                            {character.isEditable && (
                                <Button
                                    variant="accent"
                                    size="sm"
                                    onClick={() => setShowAddModal(true)}
                                    className="text-xs"
                                >
                                    Adicionar {activeTab === 'gerais' ? 'Geral' : 'do Clã'}
                                </Button>
                            )}
                        </div>

                        {/* Lista de Aprimoramentos */}
                        {(() => {
                            const filteredEnhancements = character.enhancements.filter(e => {
                                // Para aprimoramentos gerais, verificar se não tem clan
                                if (activeTab === 'gerais') {
                                    return !e.clan;
                                }
                                // Para aprimoramentos do clã, verificar se o clan do enhancement corresponde ao clã do personagem
                                // Precisamos verificar tanto pelo ID do sistema quanto pelo nome no banco
                                const enhancementClanName = e.clan ? CLAN_ID_TO_NAME[e.clan] || e.clan : null;
                                return enhancementClanName === clanName;
                            });

                            if (filteredEnhancements.length === 0) {
                                return (
                                    <div className="text-center text-gray-500 text-sm py-4">
                                        Nenhum aprimoramento {activeTab === 'gerais' ? 'geral' : 'do clã'} adquirido
                                    </div>
                                );
                            }

                            return (
                                <div className="space-y-2">
                                    {filteredEnhancements.map((enhancement) => {
                                        // Buscar dados completos do aprimoramento no banco
                                        const fullEnhancement = enhancements.find(e => e.nome === enhancement.name);
                                        const clanKey = activeTab === 'gerais' ? (fullEnhancement?.clan_restricao || null) : character.clan;
                                        const clanColor = getClanColor(clanKey);
                                        const clanIcon = getClanIcon(clanKey);

                                        return (
                                            <Card
                                                key={enhancement.id}
                                                variant="outlined"
                                                className={`${clanColor} border-opacity-50`}
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <span className="text-sm flex-shrink-0">{clanIcon}</span>
                                                            <h4 className="font-semibold text-gray-800 text-xs flex-shrink-0">
                                                                {enhancement.name}
                                                            </h4>
                                                            {fullEnhancement?.tipo && (
                                                                <span className="px-1.5 py-0.5 bg-white/70 rounded text-xs text-gray-600 flex-shrink-0">
                                                                    {fullEnhancement.tipo}
                                                                </span>
                                                            )}
                                                            {fullEnhancement?.rank_restricao && (
                                                                <span className="px-1.5 py-0.5 bg-orange-200 rounded text-xs text-gray-700 flex-shrink-0">
                                                                    {fullEnhancement.rank_restricao}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                            {fullEnhancement?.descricao || enhancement.description}
                                                        </p>
                                                        {/* Informações extras */}
                                                        {(fullEnhancement?.acoes || fullEnhancement?.duracao) && (
                                                            <div className="flex gap-2 mt-1 text-xs text-gray-500">
                                                                {fullEnhancement.acoes && (
                                                                    <span>Ações: {fullEnhancement.acoes}</span>
                                                                )}
                                                                {fullEnhancement.duracao && (
                                                                    <span>Duração: {fullEnhancement.duracao}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {character.isEditable && (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => {
                                                                onCharacterUpdate({
                                                                    ...character,
                                                                    enhancements: character.enhancements.filter(e => e.id !== enhancement.id)
                                                                });
                                                            }}
                                                            className="text-xs px-2 py-1 flex-shrink-0"
                                                        >
                                                            ×
                                                        </Button>
                                                    )}
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>
                )}
            </Card>

            {/* Modal de Criar Aprimoramento */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Criar Novo Aprimoramento"
                size="lg"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Funcionalidade para criar aprimoramentos personalizados será implementada em breve.
                    </p>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowCreateModal(false)}
                        >
                            Fechar
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal de Adicionar Aprimoramentos */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={`Adicionar ${activeTab === 'gerais' ? 'Aprimoramento Geral' : 'Aprimoramento do Clã'}`}
                size="xl"
            >
                <div className="space-y-3">
                    {enhancementsLoading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-16 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {availableEnhancements.map((enhancement) => {
                                const isAcquired = character.enhancements.some(e => e.name === enhancement.nome);
                                return (
                                    <Card key={enhancement.id} variant="outlined" className={`p-3 hover:shadow-md transition-shadow ${getClanColor(enhancement.clan_restricao)} border-opacity-50`}>
                                        <div className="space-y-2">
                                            {/* Título e Tipo */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{getClanIcon(enhancement.clan_restricao)}</span>
                                                <h4 className="text-sm font-semibold text-gray-800">{enhancement.nome}</h4>
                                                {enhancement.tipo && (
                                                    <span className="px-2 py-0.5 bg-white/70 rounded text-xs text-gray-600">
                                                        {enhancement.tipo}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Descrição */}
                                            <p className="text-xs text-gray-600 leading-relaxed">{enhancement.descricao}</p>

                                            {/* Informações extras e Botão */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1 space-y-1 text-xs text-gray-600">
                                                    {enhancement.acoes && (
                                                        <div>Ações: {enhancement.acoes}</div>
                                                    )}
                                                    {enhancement.duracao && (
                                                        <div>Duração: {enhancement.duracao}</div>
                                                    )}
                                                    {formatRequisitos(enhancement.requisitos) && (
                                                        <div>Requisitos: {formatRequisitos(enhancement.requisitos)}</div>
                                                    )}
                                                </div>

                                                {/* Botão de Adicionar */}
                                                <Button
                                                    variant="accent"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (!isAcquired) {
                                                            // Mapear nome do banco de volta para ID do sistema
                                                            const reverseMapping: Record<string, string | undefined> = {
                                                                'Uchiha': 'uchiha',
                                                                'Hyuga': 'hyuga',
                                                                'Nara': 'nara',
                                                                'Akimichi': 'akimichi',
                                                                'Uzumaki': 'uzumaki',
                                                                'Yamanaka': 'yamanaka',
                                                                'Aburame': 'aburame',
                                                                'Inuzuka': 'inuzuka',
                                                                'Senju': 'senju'
                                                            };

                                                            // Se for Geral ou sem clan_restricao, clan fica undefined
                                                            // Se for de um clã específico, converte para ID do sistema
                                                            let clanToSave: string | undefined;
                                                            if (enhancement.clan_restricao && enhancement.clan_restricao !== 'Geral') {
                                                                clanToSave = reverseMapping[enhancement.clan_restricao] || character.clan;
                                                            }

                                                            onCharacterUpdate({
                                                                ...character,
                                                                enhancements: [...character.enhancements, {
                                                                    id: enhancement.id.toString(),
                                                                    name: enhancement.nome,
                                                                    description: enhancement.descricao,
                                                                    clan: clanToSave,
                                                                    effects: [],
                                                                    requirements: {}
                                                                }]
                                                            });
                                                            setShowAddModal(false);
                                                        }
                                                    }}
                                                    disabled={isAcquired}
                                                    className="text-xs px-3 py-1 flex-shrink-0"
                                                    style={{
                                                        backgroundColor: '#7C9BA6',
                                                        color: 'white',
                                                        border: 'none'
                                                    }}
                                                >
                                                    {isAcquired ? 'Adquirido' : 'Adicionar'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                    {!enhancementsLoading && availableEnhancements.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            Nenhum aprimoramento {activeTab === 'gerais' ? 'geral' : 'do clã'} disponível.
                        </div>
                    )}
                </div>
            </Modal>

            {/* Modal de Adicionar Defeitos */}
            <Modal
                isOpen={showDefectModal}
                onClose={() => setShowDefectModal(false)}
                title="Adicionar Defeito"
                size="xl"
            >
                <div className="space-y-3">
                    {defectsLoading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-16 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {defects.map((defect) => (
                                <Card key={defect.id} variant="outlined" className={`p-3 hover:shadow-md transition-shadow ${getTypeColor(defect.tipo)} border-opacity-50`}>
                                    <div className="space-y-2">
                                        {/* Título e Tipo */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getTypeIcon(defect.tipo)}</span>
                                            <h4 className="text-sm font-semibold text-gray-800">{defect.nome}</h4>
                                            <span className="px-2 py-0.5 bg-white/70 rounded text-xs text-gray-600">
                                                {defect.tipo}
                                            </span>
                                        </div>

                                        {/* Descrição */}
                                        <p className="text-xs text-gray-600 leading-relaxed">{defect.descricao}</p>

                                        {/* Botão de Adicionar */}
                                        <div className="flex justify-end">
                                            <Button
                                                variant="accent"
                                                size="sm"
                                                onClick={() => {
                                                    // Verificar se já possui o defeito
                                                    const hasDefect = character.defects?.some(d => d.name === defect.nome);
                                                    // Verificar limite de defeitos (máximo 2)
                                                    const canAddDefect = (character.defects?.length || 0) < 2;

                                                    if (!hasDefect && canAddDefect) {
                                                        onCharacterUpdate({
                                                            ...character,
                                                            defects: [...(character.defects || []), {
                                                                id: defect.id.toString(),
                                                                name: defect.nome,
                                                                description: defect.descricao,
                                                                penalties: [] // Será implementado conforme necessário
                                                            }]
                                                        });
                                                        setShowDefectModal(false);
                                                    }
                                                }}
                                                disabled={character.defects?.some(d => d.name === defect.nome) || (character.defects?.length || 0) >= 2}
                                                className="text-xs px-3 py-1"
                                                style={{
                                                    backgroundColor: '#7C9BA6',
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                            >
                                                {character.defects?.some(d => d.name === defect.nome)
                                                    ? 'Adquirido'
                                                    : (character.defects?.length || 0) >= 2
                                                        ? 'Limite atingido'
                                                        : 'Adicionar'
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};