import Link from 'next/link';
import { LEVEL_SYSTEM } from '@/lib/levelSystem';
import { AGE_MODIFIERS } from '@/lib/gameConstants';

export default function RulesPage() {
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
                        <h1 className="text-2xl font-bold text-gray-800">Regras do Sistema Naruto RPG</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
                    Sistema de RPG baseado no universo de Naruto, focado em simplicidade e narrativa
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sistema de Níveis */}
                    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sistema de Níveis (1-20)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-gray-800 mb-3">Evolução de Dados:</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Nível 1-4</span>
                                        <span className="text-gray-500">2d6</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Nível 5-8</span>
                                        <span className="text-gray-500">1d8+1d6</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Nível 9-12</span>
                                        <span className="text-gray-500">2d8</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Nível 13-16</span>
                                        <span className="text-gray-500">1d10+1d8</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Nível 17-20</span>
                                        <span className="text-gray-500">2d10</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800 mb-3">Pontos por Nível:</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Pontos de Atributo</span>
                                        <span className="text-gray-500">A cada 2 níveis (1,3,5,7...)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Pontos de Perícia</span>
                                        <span className="text-gray-500">+1 por nível</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Bônus de Patente</span>
                                        <span className="text-gray-500">+2 pontos extras nos patamares</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                                    <h4 className="font-medium text-orange-800 mb-2">Patamares Especiais:</h4>
                                    <div className="text-sm text-orange-700 space-y-1">
                                        <div>• <strong>Nível 5 (Chunnin):</strong> +2 pontos extras de perícia</div>
                                        <div>• <strong>Nível 10 (Jounin):</strong> +2 pontos extras de perícia</div>
                                        <div>• <strong>Nível 15 (Hokage):</strong> +2 pontos extras de perícia</div>
                                    </div>
                                </div>
                                <h3 className="font-medium text-gray-800 mb-3 mt-4">Requisitos de Patente:</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Genin</span>
                                        <span className="text-gray-500">Nível 1+</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Chunnin</span>
                                        <span className="text-gray-500">Nível 5+</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Jounin</span>
                                        <span className="text-gray-500">Nível 10+</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Hokage</span>
                                        <span className="text-gray-500">Nível 15+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sistema de Idade */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Modificadores por Idade</h2>
                        <div className="space-y-3">
                            {Object.entries(AGE_MODIFIERS).map(([key, ageGroup]) => (
                                <div key={key} className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium text-gray-800">
                                            {ageGroup.minAge}-{ageGroup.maxAge === 999 ? '∞' : ageGroup.maxAge} anos
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{ageGroup.description}</p>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        {Object.entries(ageGroup.modifiers).map(([attr, modifier]) => (
                                            modifier !== 0 && (
                                                <div key={attr} className={`text-center p-1 rounded ${modifier > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {attr.charAt(0).toUpperCase() + attr.slice(1)}: {modifier > 0 ? '+' : ''}{modifier}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Personagens Sem Clã */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personagens Sem Clã</h2>
                        <div className="space-y-4">
                            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                                <h3 className="font-medium text-orange-800 mb-2">Sem Clã</h3>
                                <p className="text-sm text-orange-700 mb-2">
                                    Personagem sem linhagem ninja conhecida - maior flexibilidade na criação
                                </p>
                                <div className="text-sm text-orange-800">
                                    <strong>Bônus:</strong> +2 pontos de atributo livres e +2 pontos de perícia extras
                                </div>
                            </div>
                            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                                <h3 className="font-medium text-purple-800 mb-2">Mutação</h3>
                                <p className="text-sm text-purple-700 mb-2">
                                    Personagem com características únicas, experimentos ou origem misteriosa
                                </p>
                                <div className="text-sm text-purple-800">
                                    <strong>Bônus:</strong> +3 pontos de atributo livres e +2 pontos de perícia extras
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Atributos */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Atributos Principais</h2>
                        <div className="space-y-3">
                            <div className="border-l-4 border-orange-500 pl-4">
                                <h3 className="font-medium text-gray-800">Força (FOR)</h3>
                                <p className="text-sm text-gray-600">Poder físico, resistência muscular</p>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-4">
                                <h3 className="font-medium text-gray-800">Agilidade (AGI)</h3>
                                <p className="text-sm text-gray-600">Velocidade, reflexos, coordenação</p>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-4">
                                <h3 className="font-medium text-gray-800">Vigor (VIG)</h3>
                                <p className="text-sm text-gray-600">Resistência física, saúde geral</p>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-4">
                                <h3 className="font-medium text-gray-800">Inteligência (INT)</h3>
                                <p className="text-sm text-gray-600">Raciocínio, memória, aprendizado</p>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-4">
                                <h3 className="font-medium text-gray-800">Essência (ESS)</h3>
                                <p className="text-sm text-gray-600">Reservas de chakra, energia espiritual</p>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-4">
                                <h3 className="font-medium text-gray-800">Percepção (PER)</h3>
                                <p className="text-sm text-gray-600">Atenção, intuição, observação</p>
                            </div>
                        </div>
                    </div>

                    {/* Perícias */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sistema de Perícias</h2>
                        <div className="space-y-4 mb-6">
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h3 className="font-medium text-gray-800 mb-2">Cálculo das Perícias</h3>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <div><strong>Base:</strong> Calculada automaticamente pelos atributos</div>
                                    <div><strong>Distribuído:</strong> Pontos gastos pelo jogador</div>
                                    <div><strong>Bônus:</strong> Modificadores de habilidades/itens</div>
                                    <div><strong>Total:</strong> Base + Distribuído + Bônus</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-700">Atletismo</span>
                                <span className="text-gray-500">FOR + AGI</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Furtividade</span>
                                <span className="text-gray-500">AGI + PER</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Natureza</span>
                                <span className="text-gray-500">VIG + PER</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Selamentos</span>
                                <span className="text-gray-500">INT + ESS</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Sociedade</span>
                                <span className="text-gray-500">INT + PER</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Controle de Chakra</span>
                                <span className="text-gray-500">ESS + INT</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Ocultismo</span>
                                <span className="text-gray-500">ESS + PER</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Performance</span>
                                <span className="text-gray-500">INT + AGI</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Ofícios</span>
                                <span className="text-gray-500">FOR + INT</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Técnica de Combate</span>
                                <span className="text-gray-500">FOR + VIG</span>
                            </div>
                        </div>
                    </div>

                    {/* Sistema de Dados */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sistema de Dados</h2>
                        <p className="text-gray-600 mb-4">
                            O sistema usa <strong>2d6</strong> para todas as rolagens, mantendo os números baixos e os dados sempre relevantes.
                        </p>

                        <div className="mb-4">
                            <h3 className="font-medium text-gray-800 mb-2">Tipos de Rolagem:</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Teste de Perícia</span>
                                    <span className="text-gray-500">2d6 + Perícia vs Dificuldade</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Combate</span>
                                    <span className="text-gray-500">2d6 + Ataque vs 2d6 + Defesa</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Resistência Genjutsu</span>
                                    <span className="text-gray-500">2d6 + Resistência vs 2d6 + Genjutsu</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-800 mb-2">Dificuldades Padrão:</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Fácil: 6</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Médio: 8</span>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Difícil: 10</span>
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Muito Difícil: 12</span>
                            </div>
                        </div>
                    </div>

                    {/* Recursos */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recursos do Personagem</h2>

                        <div className="mb-6">
                            <h3 className="font-medium text-gray-800 mb-3">Recursos Principais:</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Vida</span>
                                    <span className="text-gray-500">VIG × 3 + FOR</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Chakra</span>
                                    <span className="text-gray-500">ESS × 4 + INT</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Fadiga</span>
                                    <span className="text-gray-500">VIG × 2 + FOR (desgaste físico)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Stress</span>
                                    <span className="text-gray-500">INT × 2 + PER (desgaste mental)</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-800 mb-3">Recursos Auxiliares:</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Sabedoria</span>
                                    <span className="text-gray-500">Controle emocional, resistência a manipulação</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Paixão</span>
                                    <span className="text-gray-500">Intensidade emocional, poder em artes expressivas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clãs */}
                    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Clãs de Konoha</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="border-l-4 border-red-500 pl-4">
                                    <h3 className="font-medium text-gray-800">Uchiha</h3>
                                    <p className="text-sm text-gray-600">+1 INT, +1 ESS - Sharingan</p>
                                </div>
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h3 className="font-medium text-gray-800">Hyuga</h3>
                                    <p className="text-sm text-gray-600">+1 PER, +1 AGI - Byakugan</p>
                                </div>
                                <div className="border-l-4 border-purple-500 pl-4">
                                    <h3 className="font-medium text-gray-800">Nara</h3>
                                    <p className="text-sm text-gray-600">+1 INT, +1 PER - Técnicas de Sombra</p>
                                </div>
                                <div className="border-l-4 border-green-500 pl-4">
                                    <h3 className="font-medium text-gray-800">Akimichi</h3>
                                    <p className="text-sm text-gray-600">+1 FOR, +1 VIG - Expansão Corporal</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="border-l-4 border-orange-500 pl-4">
                                    <h3 className="font-medium text-gray-800">Uzumaki</h3>
                                    <p className="text-sm text-gray-600">+1 ESS, +1 VIG - Chakra Abundante</p>
                                </div>
                                <div className="border-l-4 border-pink-500 pl-4">
                                    <h3 className="font-medium text-gray-800">Yamanaka</h3>
                                    <p className="text-sm text-gray-600">+1 INT, +1 PER - Técnicas Mentais</p>
                                </div>
                                <div className="border-l-4 border-yellow-500 pl-4">
                                    <h3 className="font-medium text-gray-800">Aburame</h3>
                                    <p className="text-sm text-gray-600">+1 VIG, +1 PER - Controle de Insetos</p>
                                </div>
                                <div className="border-l-4 border-indigo-500 pl-4">
                                    <h3 className="font-medium text-gray-800">Inuzuka</h3>
                                    <p className="text-sm text-gray-600">+1 AGI, +1 FOR - Ninja Animal</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Técnicas */}
                    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sistema de Técnicas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-800 mb-2">Taijutsu (Técnicas Corporais)</h3>
                                <p className="text-sm text-gray-600">
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
                                <h3 className="font-medium text-gray-800 mb-2">Ninjutsu (Técnicas Ninja)</h3>
                                <p className="text-sm text-gray-600">
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
                                <h3 className="font-medium text-gray-800 mb-2">Genjutsu (Técnicas de Ilusão)</h3>
                                <p className="text-sm text-gray-600">
                                    Base: INT + PER<br />
                                    Custo: Médio (3-5 chakra)<br />
                                    Exemplos: Ilusões visuais, auditivas, táteis
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}