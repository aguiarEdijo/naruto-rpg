'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Character, KONOHA_CLANS, calculateSkills, levelUpCharacter, createEmptyCharacter, getAgeDescription, calculateRemainingEnhancementPoints, Enhancement } from '@/lib/gameConstants';
import { GENERAL_ENHANCEMENTS, canPurchaseEnhancement } from '@/lib/enhancements';
import { GENERAL_DEFECTS, canApplyDefect } from '@/lib/defects';
import { Defect, Attributes, Skills } from '@/types/game';

export default function CharacterSheet() {
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showEnhancementModal, setShowEnhancementModal] = useState(false);
    const [showDefectModal, setShowDefectModal] = useState(false);
    const [showCreateEnhancementModal, setShowCreateEnhancementModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'gerais' | 'clan'>('gerais');
    const [characterImage, setCharacterImage] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState('');

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

    const handleSpendAttributePoint = (attribute: keyof Character['baseAttributes']) => {
        if (!character || character.availableAttributePoints <= 0) return;

        const updatedCharacter = {
            ...character,
            distributedAttributes: {
                ...character.distributedAttributes,
                [attribute]: character.distributedAttributes[attribute] + 1,
            },
            availableAttributePoints: character.availableAttributePoints - 1,
            updatedAt: new Date(),
        };

        setCharacter(updatedCharacter);
    };

    const handleRemoveAttributePoint = (attribute: keyof Character['baseAttributes']) => {
        if (!character || character.distributedAttributes[attribute] <= 0) return;

        const updatedCharacter = {
            ...character,
            distributedAttributes: {
                ...character.distributedAttributes,
                [attribute]: character.distributedAttributes[attribute] - 1,
            },
            availableAttributePoints: character.availableAttributePoints + 1,
            updatedAt: new Date(),
        };

        setCharacter(updatedCharacter);
    };

    const handleSpendSkillPoint = (skill: keyof Character['skills']) => {
        if (!character || character.availableSkillPoints <= 0) return;

        const updatedCharacter = {
            ...character,
            skills: {
                ...character.skills,
                [skill]: character.skills[skill] + 1,
            },
            availableSkillPoints: character.availableSkillPoints - 1,
            updatedAt: new Date(),
        };

        setCharacter(updatedCharacter);
    };

    const handleRemoveSkillPoint = (skill: keyof Character['skills']) => {
        if (!character || character.skills[skill] <= 0) return;

        const updatedCharacter = {
            ...character,
            skills: {
                ...character.skills,
                [skill]: character.skills[skill] - 1,
            },
            availableSkillPoints: character.availableSkillPoints + 1,
            updatedAt: new Date(),
        };

        setCharacter(updatedCharacter);
    };

    const handleClanChange = (newClan: string) => {
        if (!character) return;

        const updatedCharacter = createEmptyCharacter(character.userId, character.name, newClan, character.age);

        // Preservar dados importantes do personagem atual
        updatedCharacter.level = character.level;
        updatedCharacter.distributedAttributes = character.distributedAttributes;
        updatedCharacter.skills = character.skills;
        updatedCharacter.auxiliary = character.auxiliary;
        updatedCharacter.attributeBonuses = character.attributeBonuses;
        updatedCharacter.skillBonuses = character.skillBonuses;
        updatedCharacter.techniques = character.techniques;
        updatedCharacter.isEditable = character.isEditable;

        // Recalcular pontos disponíveis baseado no novo clã
        updatedCharacter.availableAttributePoints = updatedCharacter.availableAttributePoints;
        updatedCharacter.availableSkillPoints = updatedCharacter.availableSkillPoints;

        setCharacter(updatedCharacter);
    };

    const handleAgeChange = (newAge: number) => {
        if (!character) return;

        const updatedCharacter = createEmptyCharacter(character.userId, character.name, character.clan, newAge);

        // Preservar dados importantes do personagem atual
        updatedCharacter.level = character.level;
        updatedCharacter.availableAttributePoints = character.availableAttributePoints;
        updatedCharacter.availableSkillPoints = character.availableSkillPoints;
        updatedCharacter.distributedAttributes = character.distributedAttributes;
        updatedCharacter.skills = character.skills;
        updatedCharacter.auxiliary = character.auxiliary;
        updatedCharacter.attributeBonuses = character.attributeBonuses;
        updatedCharacter.skillBonuses = character.skillBonuses;
        updatedCharacter.techniques = character.techniques;
        updatedCharacter.isEditable = character.isEditable;

        setCharacter(updatedCharacter);
    };

    const handlePurchaseEnhancement = (enhancement: Enhancement) => {
        if (!character) return;

        const canPurchase = canPurchaseEnhancement(enhancement, character);

        if (!canPurchase.canPurchase) {
            alert(`Não é possível comprar este aprimoramento: ${canPurchase.reason}`);
            return;
        }

        // Verificar se já possui este aprimoramento
        if (character.enhancements.some(e => e.id === enhancement.id)) {
            alert('Você já possui este aprimoramento!');
            return;
        }

        setCharacter({
            ...character,
            enhancements: [...character.enhancements, enhancement]
        });

        setShowEnhancementModal(false);
    };

    const handlePurchaseDefect = (defect: Defect) => {
        if (!character) return;

        const canApply = canApplyDefect(defect, character);

        if (!canApply.canApply) {
            alert(`Não é possível aplicar este defeito: ${canApply.reason}`);
            return;
        }

        // Verificar se já possui este defeito
        if (character.defects?.some(d => d.id === defect.id)) {
            alert('Você já possui este defeito!');
            return;
        }

        setCharacter({
            ...character,
            defects: [...(character.defects || []), defect]
        });

        setShowDefectModal(false);
    };

    const handleCreateCustomEnhancement = (customEnhancement: Enhancement) => {
        if (!character) return;

        setCharacter({
            ...character,
            enhancements: [...character.enhancements, customEnhancement]
        });

        setShowCreateEnhancementModal(false);
    };

    const handleLevelUp = () => {
        if (!character) return;

        const updatedCharacter = levelUpCharacter(character);
        setCharacter(updatedCharacter);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!character) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Personagem não encontrado
                </div>
            </div>
        );
    }

    const selectedClan = KONOHA_CLANS.find((clan) => clan.id === character.clan);

    // Funções para lidar com a imagem
    const handleImageUrlChange = (url: string) => {
        setImageUrl(url);
        if (url.trim()) {
            setCharacterImage(url);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setCharacterImage(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setCharacterImage(null);
        setImageUrl('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
            {/* Header com tema ninja */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 shadow-lg border-b-4 border-orange-800">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-white hover:text-orange-200 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="text-2xl font-bold text-white drop-shadow-lg">🥷 Ficha de Personagem</h1>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving || !character.isEditable}
                            className="bg-white hover:bg-orange-50 disabled:bg-gray-300 text-orange-600 px-6 py-2 rounded-lg font-bold transition-colors shadow-lg border-2 border-orange-200"
                        >
                            {saving ? '💾 Salvando...' : '💾 Salvar'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Layout Principal: 3 Colunas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Coluna 1: Informações Básicas */}
                    <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg p-4 border-2 border-orange-200">
                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            📋 Informações Básicas
                        </h2>

                        <div className="space-y-3">
                            {/* Clã */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Clã</label>
                                <select
                                    value={character.clan}
                                    disabled={!character.isEditable}
                                    onChange={(e) => handleClanChange(e.target.value)}
                                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                >
                                    {KONOHA_CLANS.map((clan) => (
                                        <option key={clan.id} value={clan.id}>
                                            {clan.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Nome */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={character.name}
                                    disabled={!character.isEditable}
                                    onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                    placeholder="Digite o nome do personagem"
                                />
                            </div>

                            {/* Idade com influência */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="6"
                                        max="100"
                                        value={character.age}
                                        disabled={!character.isEditable}
                                        onChange={(e) => handleAgeChange(parseInt(e.target.value) || 12)}
                                        className="w-16 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-center"
                                    />
                                    <span className="text-sm text-gray-500">|</span>
                                    <span className="text-sm text-gray-600">{getAgeDescription(character.age)}</span>
                                </div>
                            </div>

                            {/* Descrição do Clã */}
                            {selectedClan && (
                                <div className="mt-3 bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-lg border border-orange-300">
                                    <h3 className="font-bold text-orange-800 mb-1 text-sm">{selectedClan.name}</h3>
                                    <p className="text-xs text-orange-700 mb-1">{selectedClan.description}</p>
                                    <p className="text-xs text-orange-700">
                                        <strong>Habilidade:</strong> {selectedClan.specialAbility}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Coluna 2: Imagem do Personagem */}
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-4 border-2 border-blue-200">
                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            🖼️ Imagem do Personagem
                        </h2>

                        {characterImage ? (
                            /* Preview da Imagem - Ocupando todo o espaço */
                            <div className="relative aspect-square">
                                <Image
                                    src={characterImage}
                                    alt="Personagem"
                                    fill
                                    className="object-cover rounded-lg border border-gray-300"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors shadow-lg"
                                    disabled={!character.isEditable}
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            /* Área de Upload */
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors aspect-square flex flex-col justify-center">
                                <div className="mb-3">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="url"
                                        placeholder="Cole a URL da imagem aqui"
                                        value={imageUrl}
                                        onChange={(e) => handleImageUrlChange(e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={!character.isEditable}
                                    />
                                    <div className="text-xs text-gray-500">ou</div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        disabled={!character.isEditable}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Formatos: JPG, PNG, GIF (máx. 2MB)
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Coluna 3: Sistema de Níveis */}
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-4 border-2 border-purple-200">
                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            ⚡ Sistema de Níveis
                        </h2>

                        <div className="space-y-3">
                            {/* Botão de Up Level */}
                            <button
                                onClick={handleLevelUp}
                                disabled={!character.isEditable}
                                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg border-2 border-green-300"
                            >
                                ⬆️ Subir de Nível
                            </button>

                            {/* Cards de Informação */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-3 text-center border border-blue-300">
                                    <div className="text-xl font-bold text-blue-800">{character.level}</div>
                                    <div className="text-xs text-blue-600 font-medium">Nível</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-3 text-center border border-purple-300">
                                    <div className="text-lg font-bold text-purple-800">{character.rank}</div>
                                    <div className="text-xs text-purple-600 font-medium">Patente</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-3 text-center border border-yellow-300">
                                    <div className="text-lg font-bold text-yellow-800">{character.availableAttributePoints}</div>
                                    <div className="text-xs text-yellow-600 font-medium">Pontos Atributo</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-3 text-center border border-green-300">
                                    <div className="text-lg font-bold text-green-800">{character.availableSkillPoints}</div>
                                    <div className="text-xs text-green-600 font-medium">Pontos Perícia</div>
                                </div>
                                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg p-3 text-center border border-indigo-300">
                                    <div className="text-lg font-bold text-indigo-800">{calculateRemainingEnhancementPoints(character.level, character.enhancements)}</div>
                                    <div className="text-xs text-indigo-600 font-medium">Pontos Aprimoramento</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Layout Principal: 4 Colunas com Flexbox */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Coluna 1: Atributos */}
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-4 border-2 border-blue-200 flex-1">
                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            💪 Atributos
                        </h2>
                        <div className="space-y-2">
                            {Object.entries(character.baseAttributes).map(([key, baseValue]) => {
                                const distributed = character.distributedAttributes[key as keyof typeof character.distributedAttributes];
                                const bonus = character.attributeBonuses[key as keyof typeof character.attributeBonuses];
                                const total = (baseValue as number) + distributed + bonus;
                                return (
                                    <div key={key} className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-sm font-bold text-gray-700">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </label>
                                            <div className="flex space-x-1">
                                                {character.distributedAttributes[key as keyof typeof character.distributedAttributes] > 0 && character.isEditable && (
                                                    <button
                                                        onClick={() => handleRemoveAttributePoint(key as keyof Character['baseAttributes'])}
                                                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded font-bold"
                                                    >
                                                        -1
                                                    </button>
                                                )}
                                                {character.availableAttributePoints > 0 && character.isEditable && (
                                                    <button
                                                        onClick={() => handleSpendAttributePoint(key as keyof Character['baseAttributes'])}
                                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded font-bold"
                                                    >
                                                        +1
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1">
                                            <div>
                                                <label className="text-xs text-gray-500">Base</label>
                                                <div className="w-full px-1 py-1 text-xs bg-gray-100 border border-gray-300 rounded text-center font-bold">
                                                    {baseValue as number}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Dist.</label>
                                                <div className="w-full px-1 py-1 text-xs bg-blue-100 border border-gray-300 rounded text-center font-bold">
                                                    {distributed}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Bônus</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="99"
                                                    value={String(bonus)}
                                                    disabled={!character.isEditable}
                                                    onChange={(e) => setCharacter({
                                                        ...character,
                                                        attributeBonuses: {
                                                            ...character.attributeBonuses,
                                                            [key]: parseInt(e.target.value) || 0
                                                        }
                                                    })}
                                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100 text-center"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Total</label>
                                                <div className="w-full px-1 py-1 text-xs bg-green-100 border border-gray-300 rounded text-center font-bold text-green-800">
                                                    {total}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Coluna 2: Perícias */}
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-4 border-2 border-purple-200 flex-1">
                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            ⚔️ Perícias
                        </h2>
                        <div className="space-y-2">
                            {Object.entries(character.skills).map(([key, distributed]) => {
                                const bonus = character.skillBonuses[key as keyof typeof character.skillBonuses];
                                // Calcular atributos totais para o cálculo da base
                                const totalAttributes = {
                                    strength: character.baseAttributes.strength + character.distributedAttributes.strength + character.attributeBonuses.strength,
                                    agility: character.baseAttributes.agility + character.distributedAttributes.agility + character.attributeBonuses.agility,
                                    vigor: character.baseAttributes.vigor + character.distributedAttributes.vigor + character.attributeBonuses.vigor,
                                    intelligence: character.baseAttributes.intelligence + character.distributedAttributes.intelligence + character.attributeBonuses.intelligence,
                                    essence: character.baseAttributes.essence + character.distributedAttributes.essence + character.attributeBonuses.essence,
                                    perception: character.baseAttributes.perception + character.distributedAttributes.perception + character.attributeBonuses.perception,
                                };
                                const baseSkills = calculateSkills(totalAttributes);
                                const base = baseSkills[key as keyof typeof baseSkills];
                                const total = base + (distributed as number) + bonus;
                                return (
                                    <div key={key} className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-sm font-bold text-gray-700">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </label>
                                            <div className="flex space-x-1">
                                                {(distributed as number) > 0 && character.isEditable && (
                                                    <button
                                                        onClick={() => handleRemoveSkillPoint(key as keyof Character['skills'])}
                                                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded font-bold"
                                                    >
                                                        -1
                                                    </button>
                                                )}
                                                {character.availableSkillPoints > 0 && character.isEditable && (
                                                    <button
                                                        onClick={() => handleSpendSkillPoint(key as keyof Character['skills'])}
                                                        className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded font-bold"
                                                    >
                                                        +1
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1">
                                            <div>
                                                <label className="text-xs text-gray-500">Base</label>
                                                <div className="w-full px-1 py-1 text-xs bg-gray-100 border border-gray-300 rounded text-center font-bold">
                                                    {base}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Dist.</label>
                                                <div className="w-full px-1 py-1 text-xs bg-purple-100 border border-gray-300 rounded text-center font-bold">
                                                    {distributed as number}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Bônus</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="99"
                                                    value={String(bonus)}
                                                    disabled={!character.isEditable}
                                                    onChange={(e) => setCharacter({
                                                        ...character,
                                                        skillBonuses: {
                                                            ...character.skillBonuses,
                                                            [key]: parseInt(e.target.value) || 0
                                                        }
                                                    })}
                                                    className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100 text-center"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Total</label>
                                                <div className="w-full px-1 py-1 text-xs bg-green-100 border border-gray-300 rounded text-center font-bold text-green-800">
                                                    {total}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Coluna 3: Recursos */}
                    <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-4 border-2 border-green-200 flex-1">
                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            ❤️ Recursos
                        </h2>

                        {/* Recursos */}
                        <div className="space-y-2 mb-4">
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(character.resources).map(([key, value]) => (
                                    <div key={key} className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-2">
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </label>
                                        <div className="w-full px-2 py-1 text-sm bg-gray-100 border border-gray-300 rounded text-center font-bold text-gray-800">
                                            {value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recursos Auxiliares */}
                        <div className="space-y-2 mb-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Resistência Mental</label>
                                    <input
                                        type="number"
                                        value={character.auxiliary.mentalResistance}
                                        disabled={!character.isEditable}
                                        onChange={(e) => setCharacter({
                                            ...character,
                                            auxiliary: { ...character.auxiliary, mentalResistance: parseInt(e.target.value) }
                                        })}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-center font-bold"
                                    />
                                </div>
                                <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Resistência Física</label>
                                    <input
                                        type="number"
                                        value={character.auxiliary.physicalResistance}
                                        disabled={!character.isEditable}
                                        onChange={(e) => setCharacter({
                                            ...character,
                                            auxiliary: { ...character.auxiliary, physicalResistance: parseInt(e.target.value) }
                                        })}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-center font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Componente Emoções */}
                        <div className="space-y-2 mb-4">
                            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-3">
                                <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                                    💭 Emoções
                                </h3>
                                <div className="flex items-center justify-center space-x-1">
                                    {Array.from({ length: 11 }, (_, i) => (
                                        <div
                                            key={i}
                                            className={`w-6 h-6 rounded-full border-2 transition-colors cursor-pointer ${i < character.emotions
                                                ? 'bg-red-500 border-red-600'
                                                : 'bg-gray-200 border-gray-300'
                                                } ${character.isEditable ? 'hover:scale-110' : ''}`}
                                            onClick={() => {
                                                if (character.isEditable) {
                                                    setCharacter({
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
                                    <span className="text-sm font-bold text-gray-700">
                                        {character.emotions}/10
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Seção de Defeitos */}
                        <div className="border-t border-gray-300 pt-3">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center">
                                    ⚠️ Defeitos
                                </h3>
                                {character.isEditable && (
                                    <button
                                        onClick={() => setShowDefectModal(true)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-bold transition-colors shadow-lg text-xs"
                                    >
                                        + Adicionar
                                    </button>
                                )}
                            </div>

                            {/* Cards de Informação */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-2">
                                    <h4 className="text-xs font-bold text-gray-700 mb-1">Atuais</h4>
                                    <div className="text-lg font-bold text-red-600 text-center">
                                        {character.defects?.length || 0}
                                    </div>
                                </div>
                                <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-2">
                                    <h4 className="text-xs font-bold text-gray-700 mb-1">Máximo</h4>
                                    <div className="text-lg font-bold text-orange-600 text-center">
                                        2
                                    </div>
                                </div>
                            </div>

                            {/* Lista de Defeitos */}
                            {character.defects && character.defects.length > 0 ? (
                                <div className="space-y-1">
                                    {character.defects.map((defect) => (
                                        <div key={defect.id} className="bg-gradient-to-r from-red-100 to-orange-100 p-2 rounded-lg border border-red-300">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-red-800 text-xs">{defect.name}</h4>
                                                    <p className="text-xs text-red-700 mt-1 line-clamp-2">{defect.description}</p>
                                                </div>
                                                {character.isEditable && (
                                                    <button
                                                        onClick={() => {
                                                            setCharacter({
                                                                ...character,
                                                                defects: character.defects?.filter(d => d.id !== defect.id) || []
                                                            });
                                                        }}
                                                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded ml-2"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 text-sm py-2">
                                    Nenhum defeito selecionado
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Coluna 4: Aprimoramentos */}
                    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg p-4 border-2 border-indigo-200 flex-1">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                ⭐ Aprimoramentos
                            </h2>
                            {character.isEditable && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setShowCreateEnhancementModal(true)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg font-bold transition-colors shadow-lg text-xs"
                                        title="Criar aprimoramento customizado"
                                    >
                                        ✨ Criar
                                    </button>
                                    <button
                                        onClick={() => setShowEnhancementModal(true)}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded-lg font-bold transition-colors shadow-lg text-xs"
                                    >
                                        + Adicionar
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sistema de Tabs */}
                        <div className="mb-3">
                            <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab('gerais')}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-colors ${activeTab === 'gerais'
                                        ? 'bg-indigo-500 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-300'
                                        }`}
                                >
                                    Gerais
                                </button>
                                <button
                                    onClick={() => setActiveTab('clan')}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-colors ${activeTab === 'clan'
                                        ? 'bg-indigo-500 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-300'
                                        }`}
                                >
                                    Clã
                                </button>
                            </div>
                        </div>

                        {/* Lista de Aprimoramentos */}
                        {character.enhancements.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {character.enhancements.map((enhancement) => (
                                    <div key={enhancement.id} className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg border border-indigo-300">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-indigo-800 text-xs">{enhancement.name}</h4>
                                                <p className="text-xs text-indigo-700 mt-1 line-clamp-2">{enhancement.description}</p>
                                            </div>
                                            {character.isEditable && (
                                                <button
                                                    onClick={() => {
                                                        setCharacter({
                                                            ...character,
                                                            enhancements: character.enhancements.filter(e => e.id !== enhancement.id)
                                                        });
                                                    }}
                                                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded ml-2"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 text-sm py-4">
                                Nenhum aprimoramento adquirido
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal de Aprimoramentos */}
                {showEnhancementModal && (
                    <div
                        className="fixed inset-0 flex items-start justify-center z-50 pt-8"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowEnhancementModal(false);
                            }
                        }}
                    >
                        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-2xl border-2 border-indigo-200 p-6 max-w-6xl w-[95%] max-h-[90vh] overflow-hidden backdrop-blur-sm">
                            {/* Header do Modal */}
                            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-indigo-200">
                                <div>
                                    <h3 className="text-2xl font-bold text-indigo-800 flex items-center">
                                        ⭐ Comprar Aprimoramento
                                    </h3>
                                    <p className="text-sm text-indigo-600 mt-1">
                                        Pontos disponíveis: <span className="font-bold text-indigo-800">{calculateRemainingEnhancementPoints(character.level, character.enhancements)}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowEnhancementModal(false)}
                                    className="text-indigo-500 hover:text-indigo-700 text-3xl font-bold bg-indigo-100 hover:bg-indigo-200 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Sistema de Tabs no Modal */}
                            <div className="mb-6">
                                <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab('gerais')}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-colors ${activeTab === 'gerais'
                                            ? 'bg-indigo-500 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-300'
                                            }`}
                                    >
                                        Gerais
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('clan')}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-colors ${activeTab === 'clan'
                                            ? 'bg-indigo-500 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-300'
                                            }`}
                                    >
                                        Clã
                                    </button>
                                </div>
                            </div>

                            {/* Lista de Aprimoramentos */}
                            <div className="overflow-y-auto max-h-[60vh] pr-2">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {(activeTab === 'gerais'
                                        ? GENERAL_ENHANCEMENTS.filter(e => !e.clan)
                                        : GENERAL_ENHANCEMENTS.filter(e => e.clan === character.clan)
                                    ).map((enhancement) => {
                                        const canPurchase = canPurchaseEnhancement(enhancement, character);
                                        const alreadyOwned = character.enhancements.some(e => e.id === enhancement.id);

                                        return (
                                            <div key={enhancement.id} className={`border-2 rounded-xl p-4 transition-all duration-200 ${alreadyOwned
                                                ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400'
                                                : canPurchase.canPurchase
                                                    ? 'bg-gradient-to-br from-white to-blue-50 border-blue-300 hover:shadow-lg hover:scale-105'
                                                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 opacity-75'
                                                }`}>
                                                <div className="flex flex-col h-full">
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h4 className="font-bold text-gray-800 text-lg">{enhancement.name}</h4>
                                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${alreadyOwned
                                                                ? 'bg-green-500 text-white'
                                                                : canPurchase.canPurchase
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'bg-gray-500 text-white'
                                                                }`}>
                                                                {alreadyOwned ? 'Possuído' : canPurchase.canPurchase ? 'Disponível' : 'Indisponível'}
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{enhancement.description}</p>

                                                        <div className="bg-white/70 rounded-lg p-3 mb-3">
                                                            <div className="text-xs font-bold text-gray-700 mb-1">Efeitos:</div>
                                                            <div className="text-xs text-gray-600">{enhancement.effects.join(', ')}</div>
                                                        </div>

                                                        {enhancement.requirements && (
                                                            <div className="bg-orange-50 rounded-lg p-3 mb-3">
                                                                <div className="text-xs font-bold text-orange-700 mb-1">Pré-requisitos:</div>
                                                                <div className="text-xs text-orange-600">
                                                                    {enhancement.requirements.level && `Nível ${enhancement.requirements.level}+ `}
                                                                    {enhancement.requirements.attributes && Object.entries(enhancement.requirements.attributes).map(([attr, value]) => `${attr} ${value}+ `)}
                                                                    {enhancement.requirements.skills && Object.entries(enhancement.requirements.skills).map(([skill, value]) => `${skill} ${value}+ `)}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {enhancement.restricted && (
                                                            <div className="bg-red-50 rounded-lg p-3 mb-3">
                                                                <div className="text-xs font-bold text-red-700">Restrição: {enhancement.restricted}</div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-4">
                                                        {alreadyOwned ? (
                                                            <div className="text-center text-green-600 font-bold py-2">✓ Adquirido</div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handlePurchaseEnhancement(enhancement)}
                                                                disabled={!canPurchase.canPurchase}
                                                                className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${canPurchase.canPurchase
                                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                                                    : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                                                                    }`}
                                                            >
                                                                {canPurchase.canPurchase ? '🎯 Comprar' : `❌ ${canPurchase.reason}`}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Criação de Aprimoramento Customizado */}
                {showCreateEnhancementModal && (
                    <div
                        className="fixed inset-0 flex items-start justify-center z-50 pt-8"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowCreateEnhancementModal(false);
                            }
                        }}
                    >
                        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-2xl border-2 border-green-200 p-6 max-w-4xl w-[95%] max-h-[90vh] overflow-hidden backdrop-blur-sm">
                            {/* Header do Modal */}
                            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-green-200">
                                <div>
                                    <h3 className="text-2xl font-bold text-green-800 flex items-center">
                                        ✨ Criar Aprimoramento Customizado
                                    </h3>
                                    <p className="text-sm text-green-600 mt-1">
                                        Crie seu próprio aprimoramento personalizado
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCreateEnhancementModal(false)}
                                    className="text-green-500 hover:text-green-700 text-3xl font-bold bg-green-100 hover:bg-green-200 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Formulário de Criação com Scroll */}
                            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Nome do Aprimoramento
                                        </label>
                                        <input
                                            type="text"
                                            id="enhancementName"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Ex: Reflexos Aprimorados"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Descrição
                                        </label>
                                        <textarea
                                            id="enhancementDescription"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Descreva os benefícios do aprimoramento..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Efeitos
                                        </label>
                                        <textarea
                                            id="enhancementEffects"
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Ex: +2 em Agilidade, +1 em Percepção"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Nível Mínimo
                                            </label>
                                            <input
                                                type="number"
                                                id="enhancementLevel"
                                                min="1"
                                                max="20"
                                                defaultValue="1"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Clã Específico
                                            </label>
                                            <select
                                                id="enhancementClan"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                <option value="">Geral</option>
                                                {KONOHA_CLANS.map(clan => (
                                                    <option key={clan.id} value={clan.id}>{clan.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Restrições Especiais
                                        </label>
                                        <input
                                            type="text"
                                            id="enhancementRestricted"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Ex: Origem, Níveis de Patamar (opcional)"
                                        />
                                    </div>

                                    {/* Requisitos de Atributos */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Requisitos de Atributos (opcional)
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['strength', 'agility', 'vigor', 'intelligence', 'essence', 'perception'].map(attr => (
                                                <div key={attr} className="flex items-center space-x-2">
                                                    <label className="text-xs text-gray-600 w-20 capitalize">{attr}:</label>
                                                    <input
                                                        type="number"
                                                        id={`enhancementAttr_${attr}`}
                                                        min="0"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Requisitos de Perícias */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Requisitos de Perícias (opcional)
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['jutsu', 'stealth', 'nature', 'healing', 'survival', 'chakraControl', 'occultism', 'performance', 'crafts', 'combatTechnique'].map(skill => (
                                                <div key={skill} className="flex items-center space-x-2">
                                                    <label className="text-xs text-gray-600 w-20 capitalize">{skill}:</label>
                                                    <input
                                                        type="number"
                                                        id={`enhancementSkill_${skill}`}
                                                        min="0"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Botões de Ação - Fora da área de scroll */}
                                <div className="flex justify-end space-x-3 pt-4 border-t-2 border-green-200 mt-4">
                                    <button
                                        onClick={() => setShowCreateEnhancementModal(false)}
                                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => {
                                            const name = (document.getElementById('enhancementName') as HTMLInputElement)?.value;
                                            const description = (document.getElementById('enhancementDescription') as HTMLTextAreaElement)?.value;
                                            const effects = (document.getElementById('enhancementEffects') as HTMLTextAreaElement)?.value;
                                            const level = parseInt((document.getElementById('enhancementLevel') as HTMLInputElement)?.value || '1');
                                            const clan = (document.getElementById('enhancementClan') as HTMLSelectElement)?.value;
                                            const restricted = (document.getElementById('enhancementRestricted') as HTMLInputElement)?.value;

                                            // Coletar requisitos de atributos
                                            const attributes: Partial<Attributes> = {};
                                            ['strength', 'agility', 'vigor', 'intelligence', 'essence', 'perception'].forEach(attr => {
                                                const value = parseInt((document.getElementById(`enhancementAttr_${attr}`) as HTMLInputElement)?.value || '0');
                                                if (value > 0) {
                                                    attributes[attr as keyof Attributes] = value;
                                                }
                                            });

                                            // Coletar requisitos de perícias
                                            const skills: Partial<Skills> = {};
                                            ['jutsu', 'stealth', 'nature', 'healing', 'survival', 'chakraControl', 'occultism', 'performance', 'crafts', 'combatTechnique'].forEach(skill => {
                                                const value = parseInt((document.getElementById(`enhancementSkill_${skill}`) as HTMLInputElement)?.value || '0');
                                                if (value > 0) {
                                                    skills[skill as keyof Skills] = value;
                                                }
                                            });

                                            if (name && description && effects) {
                                                const customEnhancement: Enhancement = {
                                                    id: `custom_${Date.now()}`,
                                                    name,
                                                    description,
                                                    effects: effects.split(',').map(e => e.trim()),
                                                    requirements: {
                                                        level,
                                                        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
                                                        skills: Object.keys(skills).length > 0 ? skills : undefined
                                                    },
                                                    clan: clan || undefined,
                                                    restricted: restricted || undefined
                                                };

                                                handleCreateCustomEnhancement(customEnhancement);
                                            }
                                        }}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                                    >
                                        ✨ Criar Aprimoramento
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/* Modal de Defeitos */}
                        {showDefectModal && (
                            <div
                                className="fixed inset-0 flex items-start justify-center z-50 pt-8"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        setShowDefectModal(false);
                                    }
                                }}
                            >
                                <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-2xl border-2 border-red-200 p-6 max-w-6xl w-[95%] max-h-[90vh] overflow-hidden backdrop-blur-sm">
                                    {/* Header do Modal */}
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-red-200">
                                        <div>
                                            <h3 className="text-2xl font-bold text-red-800 flex items-center">
                                                ⚠️ Selecionar Defeito
                                            </h3>
                                            <p className="text-sm text-red-600 mt-1">
                                                Defeitos atuais: <span className="font-bold text-red-800">{character.defects?.length || 0}/2</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowDefectModal(false)}
                                            className="text-red-500 hover:text-red-700 text-3xl font-bold bg-red-100 hover:bg-red-200 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {/* Lista de Defeitos */}
                                    <div className="overflow-y-auto max-h-[60vh] pr-2">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {GENERAL_DEFECTS.map((defect) => {
                                                const canApply = canApplyDefect(defect, character);
                                                const alreadyOwned = character.defects?.some(d => d.id === defect.id);

                                                return (
                                                    <div key={defect.id} className={`border-2 rounded-xl p-4 transition-all duration-200 ${alreadyOwned
                                                        ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400'
                                                        : canApply.canApply
                                                            ? 'bg-gradient-to-br from-white to-red-50 border-red-300 hover:shadow-lg hover:scale-105'
                                                            : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 opacity-75'
                                                        }`}>
                                                        <div className="flex flex-col h-full">
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <h4 className="font-bold text-gray-800 text-lg">{defect.name}</h4>
                                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${alreadyOwned
                                                                        ? 'bg-green-500 text-white'
                                                                        : canApply.canApply
                                                                            ? 'bg-red-500 text-white'
                                                                            : 'bg-gray-500 text-white'
                                                                        }`}>
                                                                        {alreadyOwned ? 'Possuído' : canApply.canApply ? 'Disponível' : 'Indisponível'}
                                                                    </div>
                                                                </div>

                                                                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{defect.description}</p>

                                                                <div className="bg-white/70 rounded-lg p-3 mb-3">
                                                                    <div className="text-xs font-bold text-gray-700 mb-1">Penalidades:</div>
                                                                    <div className="text-xs text-gray-600">{defect.penalties.join(', ')}</div>
                                                                </div>

                                                                {defect.restrictions && (
                                                                    <div className="bg-orange-50 rounded-lg p-3 mb-3">
                                                                        <div className="text-xs font-bold text-orange-700 mb-1">Restrições:</div>
                                                                        <div className="text-xs text-orange-600">
                                                                            {defect.restrictions.level && `Nível ${defect.restrictions.level}+ `}
                                                                            {defect.restrictions.attributes && Object.entries(defect.restrictions.attributes).map(([attr, value]) => `${attr} ${value}+ `)}
                                                                            {defect.restrictions.skills && Object.entries(defect.restrictions.skills).map(([skill, value]) => `${skill} ${value}+ `)}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {defect.restricted && (
                                                                    <div className="bg-red-50 rounded-lg p-3 mb-3">
                                                                        <div className="text-xs font-bold text-red-700">Restrição: {defect.restricted}</div>
                                                                    </div>
                                                                )}

                                                                {defect.points && (
                                                                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                                                                        <div className="text-xs font-bold text-blue-700">Pontos: {defect.points}</div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="mt-4">
                                                                {alreadyOwned ? (
                                                                    <div className="text-center text-green-600 font-bold py-2">✓ Selecionado</div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handlePurchaseDefect(defect)}
                                                                        disabled={!canApply.canApply}
                                                                        className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${canApply.canApply
                                                                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                                                            : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                                                                            }`}
                                                                    >
                                                                        {canApply.canApply ? '⚠️ Selecionar' : `❌ ${canApply.reason}`}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}