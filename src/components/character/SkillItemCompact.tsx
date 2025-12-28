import React from 'react';
import { Card } from '@/components/ui';

interface SkillItemProps {
    skillName: string;
    attributeAbbr: string;
    attributeName: string;
    description: string;
    base: number;
    distributed: number;
    bonus: number;
    total: number;
    isEditable?: boolean;
    onAddPoint?: () => void;
    onRemovePoint?: () => void;
    onBonusChange?: (value: number) => void;
    showDescription?: boolean;
}

export const SkillItemCompact: React.FC<SkillItemProps> = ({
    skillName,
    attributeAbbr,
    attributeName,
    description,
    base,
    distributed,
    bonus,
    total,
    isEditable = false,
    onAddPoint,
    onRemovePoint,
    onBonusChange,
    showDescription = false
}) => {
    // Cores por atributo usando paleta do design system
    const getAttributeColor = (abbr: string) => {
        const colors: Record<string, string> = {
            'FOR': 'bg-[#F5E6D3] border-[#C84B44] text-[#7C2D1F]', // Tom vermelho queimado
            'VIG': 'bg-[#E8F3F7] border-[#7C9BA6] text-[#4A6B7A]', // Tom azul-acinzentado
            'AGI': 'bg-[#E5F5E8] border-[#7A8B7B] text-[#4A5A4F]', // Tom verde acinzentado
            'INT': 'bg-[#F3E8F5] border-[#C84B44] text-[#7C2D1F]', // Tom primário
            'PER': 'bg-[#FFF8E5] border-[#C84B44] text-[#7C2D1F]', // Tom primário
            'ESS': 'bg-[#F5E8F3] border-[#C84B44] text-[#7C2D1F]', // Tom primário
            'INF': 'bg-[#E5E0F7] border-[#7C9BA6] text-[#4A6B7A]', // Tom accent
        };
        return colors[abbr] || 'bg-[#F9FAFB] border-[#D1D5DB] text-[#374151]';
    };

    return (
        <div className="flex items-center gap-2 py-1.5 px-2.5 bg-white border border-gray-200 rounded-lg hover:shadow-sm hover:border-primary/30 transition-all duration-150">
            {/* Nome da perícia + Badge (esquerda) */}
            <div className="flex items-center gap-1.5 flex-1 justify-start min-w-0">
                <h4 className="font-medium text-gray-700 text-[11px] truncate">
                    {skillName}
                </h4>
                <div className={`w-6 h-4 flex items-center justify-center rounded border text-[9px] font-bold flex-shrink-0 ${getAttributeColor(attributeAbbr)}`}>
                    {attributeAbbr}
                </div>
            </div>

            {/* Valores: Base, Dist., Bônus, Total */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Base */}
                <div className="flex flex-col items-center gap-0.5">
                    <label className="text-[10px] text-gray-500 font-medium">BAS</label>
                    <div className="w-8 h-7 bg-gray-50 border border-gray-300 rounded text-center flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">{base}</span>
                    </div>
                </div>

                {/* Distribuído */}
                <div className="flex flex-col items-center gap-0.5">
                    <label className="text-[10px] text-gray-500 font-medium">DIS</label>
                    <div className="w-8 h-7 bg-blue-50 border border-blue-300 rounded text-center flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-700">{distributed}</span>
                    </div>
                </div>

                {/* Bônus */}
                <div className="flex flex-col items-center gap-0.5">
                    <label className="text-[10px] text-gray-500 font-medium">BÔN</label>
                    <input
                        type="number"
                        min="0"
                        max="99"
                        value={bonus}
                        disabled={!isEditable}
                        onChange={(e) => onBonusChange?.(parseInt(e.target.value) || 0)}
                        className="w-8 h-7 border border-gray-300 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-400"
                    />
                </div>

                {/* Total */}
                <div className="flex flex-col items-center gap-0.5">
                    <label className="text-[10px] text-gray-500 font-medium">TOT</label>
                    <div className="w-9 h-7 bg-green-100 border border-green-300 rounded text-center flex items-center justify-center">
                        <span className="text-xs font-bold text-green-800">{total}</span>
                    </div>
                </div>

                {/* Botões + e - estilo atributo */}
                {isEditable && (
                    <div className="flex flex-col gap-0.5 mt-3.5">
                        {onAddPoint && (
                            <button
                                onClick={onAddPoint}
                                className="px-2 py-1 text-[10px] bg-accent hover:bg-[#6B8A95] text-white rounded transition-colors font-medium"
                                title="Adicionar ponto"
                            >
                                +1
                            </button>
                        )}
                        {onRemovePoint && distributed > 0 && (
                            <button
                                onClick={onRemovePoint}
                                className="px-2 py-1 text-[10px] bg-primary hover:bg-[#B5413C] text-white rounded transition-colors font-medium"
                                title="Remover ponto"
                            >
                                -1
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
