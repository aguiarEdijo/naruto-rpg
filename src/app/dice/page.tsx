'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DiceSystem } from '@/lib/diceSystem';
import { LEVEL_SYSTEM, getDiceForLevel } from '@/lib/levelSystem';

export default function DicePage() {
    const [lastRoll, setLastRoll] = useState<any>(null);
    const [skillValue, setSkillValue] = useState(5);
    const [difficulty, setDifficulty] = useState(8);
    const [characterLevel, setCharacterLevel] = useState(1);
    const [rollHistory, setRollHistory] = useState<any[]>([]);

    const rollSkill = () => {
        const result = DiceSystem.rollSkill(skillValue, difficulty, characterLevel);
        const rollData = {
            ...result,
            timestamp: new Date(),
            skillValue,
            difficulty,
            level: characterLevel,
        };

        setLastRoll(rollData);
        setRollHistory(prev => [rollData, ...prev.slice(0, 9)]);
    };

    const roll2d6 = () => {
        const result = DiceSystem.rollByLevel(characterLevel);
        const rollData = {
            roll: result,
            timestamp: new Date(),
            type: '2d6',
            level: characterLevel,
        };

        setLastRoll(rollData);
        setRollHistory(prev => [rollData, ...prev.slice(0, 9)]);
    };

    const rollCombat = () => {
        const attackValue = 8;
        const defenseValue = 6;
        const result = DiceSystem.rollCombat(attackValue, defenseValue, characterLevel, characterLevel);
        const rollData = {
            ...result,
            timestamp: new Date(),
            type: 'combat',
            attackValue,
            defenseValue,
            level: characterLevel,
        };

        setLastRoll(rollData);
        setRollHistory(prev => [rollData, ...prev.slice(0, 9)]);
    };

    const getResultColor = (result: any) => {
        if (result.result?.criticalSuccess) return 'bg-green-100 text-green-800';
        if (result.result?.criticalFailure) return 'bg-red-100 text-red-800';
        if (result.result?.success) return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getResultText = (result: any) => {
        if (result.result?.criticalSuccess) return 'Sucesso Crítico!';
        if (result.result?.criticalFailure) return 'Falha Crítica!';
        if (result.result?.success) return 'Sucesso';
        return 'Falha';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-orange-600 hover:text-orange-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Sistema de Rolagem de Dados</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <p className="text-gray-600 mb-8 text-center">
                    Role dados para suas perícias, técnicas e situações de combate
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Controles de Rolagem */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Rolagem de Perícia</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={characterLevel}
                                        onChange={(e) => setCharacterLevel(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor da Perícia</label>
                                    <input
                                        type="number"
                                        value={skillValue}
                                        onChange={(e) => setSkillValue(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldade</label>
                                    <input
                                        type="number"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={rollSkill}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                            >
                                Rolar Perícia ({getDiceForLevel(characterLevel).description} + {skillValue})
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Rolagens Rápidas</h2>
                        <div className="space-y-4">
                            <button
                                onClick={roll2d6}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                            >
                                Rolar {getDiceForLevel(characterLevel).description}
                            </button>
                            <button
                                onClick={rollCombat}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                            >
                                Teste de Combate
                            </button>
                        </div>
                    </div>
                </div>

                {/* Resultado da Última Rolagem */}
                {lastRoll && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Último Resultado</h2>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="text-4xl font-bold text-orange-600">
                                {lastRoll.roll?.finalResult || lastRoll.roll?.total || 'N/A'}
                            </div>
                            {lastRoll.result && (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getResultColor(lastRoll)}`}>
                                    {getResultText(lastRoll)}
                                </span>
                            )}
                        </div>

                        {lastRoll.roll && (
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>Dados: [{lastRoll.roll.dice.join(', ')}] + {lastRoll.roll.modifier}</p>
                                <p>Total: {lastRoll.roll.total} + {lastRoll.roll.modifier} = {lastRoll.roll.finalResult}</p>
                            </div>
                        )}

                        {lastRoll.result && (
                            <div className="text-sm text-gray-600 mt-2">
                                <p>Dificuldade: {lastRoll.difficulty}</p>
                                <p>Margem: {lastRoll.result.margin > 0 ? '+' : ''}{lastRoll.result.margin}</p>
                            </div>
                        )}

                        {lastRoll.type === 'combat' && (
                            <div className="text-sm text-gray-600 mt-2">
                                <p>Ataque: {lastRoll.attackRoll.finalResult} vs Defesa: {lastRoll.defenseRoll.finalResult}</p>
                                <p>Dano: {lastRoll.damage}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Histórico de Rolagens */}
                {rollHistory.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Rolagens</h2>
                        <div className="max-h-80 overflow-y-auto space-y-2">
                            {rollHistory.map((roll, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500 w-20">
                                            {roll.timestamp.toLocaleTimeString()}
                                        </span>
                                        <span className="font-medium w-12">
                                            {roll.roll?.finalResult || roll.roll?.total || 'N/A'}
                                        </span>
                                        {roll.result && (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getResultColor(roll)}`}>
                                                {getResultText(roll)}
                                            </span>
                                        )}
                                        <span className="text-sm text-gray-600">
                                            {roll.type === 'combat'
                                                ? `Combate (Dano: ${roll.damage})`
                                                : roll.type === '2d6'
                                                    ? '2d6'
                                                    : `Perícia (${roll.skillValue} vs ${roll.difficulty})`
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}