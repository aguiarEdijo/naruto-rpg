import React from 'react';
import { Card } from '@/components/ui';
import { AttributesDisplay } from './AttributesDisplay';

export const AttributesRules: React.FC = () => {
    return (
        <div className="space-y-6">
            <AttributesDisplay showDescriptions={true} />

            <Card className="p-6">
                <h2 className="heading-3 mb-4">Recursos do Personagem</h2>
                <div className="mb-6">
                    <h3 className="heading-4 mb-3">Recursos Principais:</h3>
                    <div className="space-y-2 text-small">
                        <div className="flex justify-between">
                            <span className="text-body">Vida</span>
                            <span className="text-muted">VIG × 3 + FOR</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body">Chakra</span>
                            <span className="text-muted">ESS × 4 + INT</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body">Fadiga</span>
                            <span className="text-muted">VIG × 2 + FOR (desgaste físico)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body">Stress</span>
                            <span className="text-muted">INT × 2 + PER (desgaste mental)</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="heading-4 mb-3">Recursos Auxiliares:</h3>
                    <div className="space-y-2 text-small">
                        <div className="flex justify-between">
                            <span className="text-body">Sabedoria</span>
                            <span className="text-muted">Controle emocional, resistência a manipulação</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body">Paixão</span>
                            <span className="text-muted">Intensidade emocional, poder em artes expressivas</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
