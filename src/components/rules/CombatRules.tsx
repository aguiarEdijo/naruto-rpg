import React from 'react';
import { Card } from '@/components/ui';

export const CombatRules: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h2 className="heading-3 mb-4">Sistema de Dados</h2>
                <p className="text-body text-muted mb-4">
                    O sistema usa <strong>2d6</strong> para todas as rolagens, mantendo os números baixos e os dados sempre relevantes.
                </p>

                <div className="mb-4">
                    <h3 className="heading-4 mb-2">Tipos de Rolagem:</h3>
                    <div className="space-y-2 text-small">
                        <div className="flex justify-between">
                            <span className="text-body">Teste de Perícia</span>
                            <span className="text-muted">2d6 + Perícia vs Dificuldade</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body">Combate</span>
                            <span className="text-muted">2d6 + Ataque vs 2d6 + Defesa</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body">Resistência Genjutsu</span>
                            <span className="text-muted">2d6 + Resistência vs 2d6 + Genjutsu</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="heading-4 mb-2">Dificuldades Padrão:</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Fácil: 6</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Médio: 8</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Difícil: 10</span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Muito Difícil: 12</span>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="heading-3 mb-4">Sistema de Técnicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="heading-4 mb-2">Taijutsu (Técnicas Corporais)</h3>
                        <p className="text-small text-muted">
                            Base: FOR + AGI<br />
                            Custo: Baixo (1-2 chakra)<br />
                            Exemplos: Socos, chutes, esquivas
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="heading-4 mb-2">Ninjutsu (Técnicas Ninja)</h3>
                        <p className="text-small text-muted">
                            Base: INT + ESS<br />
                            Custo: Médio a Alto (2-8 chakra)<br />
                            Controle: ESS + INT reduz custo<br />
                            Exemplos: Elementos, transformações, clones
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="heading-4 mb-2">Genjutsu (Técnicas de Ilusão)</h3>
                        <p className="text-small text-muted">
                            Base: INT + PER<br />
                            Custo: Médio (3-5 chakra)<br />
                            Exemplos: Ilusões visuais, auditivas, táteis
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
