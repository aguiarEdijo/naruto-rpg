import React from 'react';
import { DefectsDisplay } from './DefectsDisplay';
import { EnhancementsDisplay } from './EnhancementsDisplay';

export const EnhancementsRules: React.FC = () => {
    return (
        <div className="space-y-6">
            <EnhancementsDisplay />
            <DefectsDisplay showDescriptions={true} />
        </div>
    );
};
