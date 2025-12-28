import React, { Suspense } from 'react';
import { Card } from '@/components/ui';
import { SkillsDisplay } from './SkillsDisplay';

export const SkillsRules: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card className="p-6 border-2 border-primary/20">
                <div className="mb-2">
                    <h2 className="heading-3 text-gray-900 mb-2">📊 Cálculo das Perícias</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Sistema de perícias baseado em atributos únicos para cálculos simples e eficientes.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-3">
                        <div className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold text-lg">1.</span>
                            <div>
                                <strong className="text-gray-900">Base:</strong>
                                <span className="text-gray-700 ml-2">Valor do atributo base</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold text-lg">2.</span>
                            <div>
                                <strong className="text-gray-900">Distribuído:</strong>
                                <span className="text-gray-700 ml-2">Pontos gastos pelo jogador</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold text-lg">3.</span>
                            <div>
                                <strong className="text-gray-900">Bônus:</strong>
                                <span className="text-gray-700 ml-2">Modificadores de habilidades/itens</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-orange-600 font-bold text-lg">=</span>
                            <div>
                                <strong className="text-gray-900">Total:</strong>
                                <span className="text-gray-700 ml-2">Base + Distribuído + Bônus</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Suspense
                fallback={
                    <Card className="p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                    </Card>
                }
            >
                <SkillsDisplay showDescriptions={true} />
            </Suspense>
        </div>
    );
};
