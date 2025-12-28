import React from 'react';
import { Card } from '@/components/ui';

export const ClansRules: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h2 className="heading-3 mb-4">Clãs de Konoha</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="border-l-4 border-red-500 pl-4">
                            <h3 className="heading-4">Uchiha</h3>
                            <p className="text-small text-muted">+1 INT, +1 ESS </p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="heading-4">Hyuga</h3>
                            <p className="text-small text-muted">+1 PER, +1 AGI </p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                            <h3 className="heading-4">Nara</h3>
                            <p className="text-small text-muted">+1 INT, +1 PER </p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="heading-4">Akimichi</h3>
                            <p className="text-small text-muted">+1 FOR, +1 VIG </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="border-l-4 border-primary pl-4">
                            <h3 className="heading-4">Uzumaki</h3>
                            <p className="text-small text-muted">+1 ESS, +1 VIG </p>
                        </div>
                        <div className="border-l-4 border-pink-500 pl-4">
                            <h3 className="heading-4">Yamanaka</h3>
                            <p className="text-small text-muted">+1 INT, +1 PER </p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <h3 className="heading-4">Aburame</h3>
                            <p className="text-small text-muted">+1 VIG, +1 PER </p>
                        </div>
                        <div className="border-l-4 border-indigo-500 pl-4">
                            <h3 className="heading-4">Inuzuka</h3>
                            <p className="text-small text-muted">+1 AGI, +1 FOR </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
