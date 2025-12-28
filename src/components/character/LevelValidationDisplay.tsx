import React from 'react';
import { Card, Badge } from '@/components/ui';
import { LevelValidationResult } from '@/lib/hooks/useLevelValidation';

interface LevelValidationDisplayProps {
    validation: LevelValidationResult;
    className?: string;
}

export const LevelValidationDisplay: React.FC<LevelValidationDisplayProps> = ({
    validation,
    className = ''
}) => {
    if (!validation.levelInfo) {
        return (
            <Card className={`p-4 bg-red-50 border-red-200 ${className}`}>
                <div className="text-red-700">
                    <h3 className="heading-4 mb-2">Erro de Validação</h3>
                    <p className="text-small">Não foi possível validar o nível do personagem</p>
                </div>
            </Card>
        );
    }

    const getRankColor = (rank: string) => {
        switch (rank) {
            case 'Genin':
                return 'success';
            case 'Chunnin':
                return 'info';
            case 'Jounin':
                return 'warning';
            case 'Hokage':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Card className={`p-4 ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="heading-4">Validação de Nível</h3>
                <Badge
                    variant={validation.isValid ? 'success' : 'error'}
                    size="sm"
                >
                    {validation.isValid ? 'Válido' : 'Inválido'}
                </Badge>
            </div>

            {/* Informações do Nível */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <div className="text-small text-muted mb-1">Nível Atual</div>
                    <div className="text-body font-semibold">{validation.levelInfo.level}</div>
                </div>
                <div>
                    <div className="text-small text-muted mb-1">Patente</div>
                    <div className="flex items-center gap-2">
                        <Badge variant={getRankColor(validation.expectedRank)} size="sm">
                            {validation.expectedRank}
                        </Badge>
                        {!validation.rankMatches && (
                            <Badge variant="error" size="sm">
                                Esperado
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Dados de Progressão */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <div className="text-small text-muted mb-1">Dados</div>
                    <div className="text-small font-mono font-semibold">{validation.levelInfo.dice_evolution}</div>
                </div>
                <div className="text-center">
                    <div className="text-small text-muted mb-1">Atributos</div>
                    <div className="text-small font-semibold">{validation.levelInfo.attribute_points}</div>
                </div>
                <div className="text-center">
                    <div className="text-small text-muted mb-1">Perícias</div>
                    <div className="text-small font-semibold">{validation.levelInfo.skill_points}</div>
                </div>
            </div>

            {/* Erros */}
            {validation.errors.length > 0 && (
                <div className="mb-3">
                    <h4 className="text-small font-semibold text-red-700 mb-2">Erros:</h4>
                    <ul className="space-y-1">
                        {validation.errors.map((error, index) => (
                            <li key={index} className="text-small text-red-600 flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Avisos */}
            {validation.warnings.length > 0 && (
                <div>
                    <h4 className="text-small font-semibold text-orange-700 mb-2">Avisos:</h4>
                    <ul className="space-y-1">
                        {validation.warnings.map((warning, index) => (
                            <li key={index} className="text-small text-orange-600 flex items-start">
                                <span className="text-orange-500 mr-2">•</span>
                                {warning}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Status de Validação */}
            {validation.isValid && validation.errors.length === 0 && validation.warnings.length === 0 && (
                <div className="text-center py-2">
                    <div className="text-small text-green-700 font-medium">
                        ✅ Personagem válido para o nível {validation.levelInfo.level}
                    </div>
                </div>
            )}
        </Card>
    );
};


