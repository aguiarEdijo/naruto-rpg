import React, { useState } from 'react';
import { Character } from '@/lib/gameConstants';
import { Card, Button, Modal } from '@/components/ui';
import { GENERAL_ENHANCEMENTS } from '@/lib/enhancements';
import { GENERAL_DEFECTS } from '@/lib/defects';

interface EnhancementsAndDefectsProps {
    character: Character;
    onCharacterUpdate: (character: Character) => void;
}

export const EnhancementsAndDefects: React.FC<EnhancementsAndDefectsProps> = ({
    character,
    onCharacterUpdate
}) => {
    const [activeTab, setActiveTab] = useState<'gerais' | 'clan' | 'defects'>('gerais');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDefectModal, setShowDefectModal] = useState(false);

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
                                {character.defects.map((defect) => (
                                    <Card key={defect.id} variant="outlined" className="bg-red-50 border-red-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 text-xs">{defect.name}</h4>
                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{defect.description}</p>
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
                                                    className="text-xs px-2 py-1 ml-2"
                                                >
                                                    ×
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                ))}
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
                        {character.enhancements.filter(e =>
                            activeTab === 'gerais' ? !e.clan : e.clan === character.clan
                        ).length > 0 ? (
                            <div className="space-y-2 overflow-y-auto">
                                {character.enhancements
                                    .filter(e => activeTab === 'gerais' ? !e.clan : e.clan === character.clan)
                                    .map((enhancement) => (
                                        <Card key={enhancement.id} variant="outlined" className="bg-green-50 border-green-200">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-800 text-xs">{enhancement.name}</h4>
                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{enhancement.description}</p>
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
                                                        className="text-xs px-2 py-1 ml-2"
                                                    >
                                                        ×
                                                    </Button>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 text-sm py-4">
                                Nenhum aprimoramento {activeTab === 'gerais' ? 'geral' : 'do clã'} adquirido
                            </div>
                        )}
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
                    <div className="space-y-3">
                        {GENERAL_ENHANCEMENTS
                            .filter(enhancement => {
                                if (activeTab === 'gerais') {
                                    return !enhancement.clan; // Aprimoramentos gerais
                                } else {
                                    return enhancement.clan === character.clan; // Aprimoramentos do clã
                                }
                            })
                            .map((enhancement) => (
                                <Card key={enhancement.id} variant="outlined" className="p-3 hover:shadow-md transition-shadow">
                                    <div className="space-y-2">
                                        {/* Título */}
                                        <h4 className="text-sm font-semibold text-gray-800">{enhancement.name}</h4>

                                        {/* Descrição */}
                                        <p className="text-xs text-gray-600 leading-relaxed">{enhancement.description}</p>

                                        {/* Efeitos, Requisitos e Botão em linha */}
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex-1 space-y-1">
                                                {/* Efeitos */}
                                                {enhancement.effects && (
                                                    <div className="text-xs">
                                                        <span className="font-medium text-gray-700">Efeitos: </span>
                                                        <span className="text-gray-600">
                                                            {enhancement.effects.map((effect, index) => (
                                                                <span key={index}>
                                                                    {effect}
                                                                    {index < enhancement.effects.length - 1 && ', '}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Requisitos */}
                                                {enhancement.requirements && (
                                                    <div className="text-xs">
                                                        <span className="font-medium text-gray-700">Requisitos: </span>
                                                        <span className="text-gray-600">
                                                            {enhancement.requirements.attributes &&
                                                                Object.entries(enhancement.requirements.attributes).map(([attr, value], index, array) => (
                                                                    <span key={attr}>
                                                                        {attr}: {value}
                                                                        {index < array.length - 1 && ', '}
                                                                    </span>
                                                                ))
                                                            }
                                                            {enhancement.requirements.skills &&
                                                                Object.entries(enhancement.requirements.skills).map(([skill, value], index, array) => (
                                                                    <span key={skill}>
                                                                        {enhancement.requirements?.attributes && ', '}
                                                                        {skill}: {value}
                                                                        {index < array.length - 1 && ', '}
                                                                    </span>
                                                                ))
                                                            }
                                                            {enhancement.requirements.level && (
                                                                <span>
                                                                    {(enhancement.requirements?.attributes || enhancement.requirements?.skills) && ', '}
                                                                    Nível: {enhancement.requirements.level}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Botão de Adicionar */}
                                            <Button
                                                variant="accent"
                                                size="sm"
                                                onClick={() => {
                                                    // Verificar se já possui o aprimoramento
                                                    const hasEnhancement = character.enhancements.some(e => e.id === enhancement.id);
                                                    if (!hasEnhancement) {
                                                        onCharacterUpdate({
                                                            ...character,
                                                            enhancements: [...character.enhancements, enhancement]
                                                        });
                                                        setShowAddModal(false);
                                                    }
                                                }}
                                                disabled={character.enhancements.some(e => e.id === enhancement.id)}
                                                className="text-xs px-3 py-1 flex-shrink-0"
                                                style={{
                                                    backgroundColor: '#7C9BA6',
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                            >
                                                {character.enhancements.some(e => e.id === enhancement.id) ? 'Adquirido' : 'Adicionar'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                    </div>
                    {GENERAL_ENHANCEMENTS.filter(enhancement => {
                        if (activeTab === 'gerais') {
                            return !enhancement.clan;
                        } else {
                            return enhancement.clan === character.clan;
                        }
                    }).length === 0 && (
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
                    <div className="space-y-3">
                        {GENERAL_DEFECTS.map((defect) => (
                            <Card key={defect.id} variant="outlined" className="p-3 hover:shadow-md transition-shadow">
                                <div className="space-y-2">
                                    {/* Título */}
                                    <h4 className="text-sm font-semibold text-gray-800">{defect.name}</h4>

                                    {/* Descrição */}
                                    <p className="text-xs text-gray-600 leading-relaxed">{defect.description}</p>

                                    {/* Penalidades e Botão em linha */}
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1">
                                            {/* Penalidades */}
                                            {defect.penalties && (
                                                <div className="text-xs">
                                                    <span className="font-medium text-gray-700">Penalidades: </span>
                                                    <span className="text-gray-600">
                                                        {defect.penalties.map((penalty, index) => (
                                                            <span key={index}>
                                                                {penalty}
                                                                {index < defect.penalties.length - 1 && ', '}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Botão de Adicionar */}
                                        <Button
                                            variant="accent"
                                            size="sm"
                                            onClick={() => {
                                                // Verificar se já possui o defeito
                                                const hasDefect = character.defects?.some(d => d.id === defect.id);
                                                // Verificar limite de defeitos (máximo 2)
                                                const canAddDefect = (character.defects?.length || 0) < 2;

                                                if (!hasDefect && canAddDefect) {
                                                    onCharacterUpdate({
                                                        ...character,
                                                        defects: [...(character.defects || []), defect]
                                                    });
                                                    setShowDefectModal(false);
                                                }
                                            }}
                                            disabled={character.defects?.some(d => d.id === defect.id) || (character.defects?.length || 0) >= 2}
                                            className="text-xs px-3 py-1 flex-shrink-0"
                                            style={{
                                                backgroundColor: '#7C9BA6',
                                                color: 'white',
                                                border: 'none'
                                            }}
                                        >
                                            {character.defects?.some(d => d.id === defect.id)
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
                </div>
            </Modal>
        </>
    );
};