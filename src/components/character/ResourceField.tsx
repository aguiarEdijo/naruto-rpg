import React from 'react';
import { Card, Grid, Button } from '@/components/ui';

interface ResourceFieldProps {
    label: string;
    base: number;
    additional: number;
    temporary: number;
    total: number;
    isEditable: boolean;
    baseEditable?: boolean;
    onBaseChange?: (value: number) => void;
    onAdditionalChange?: (value: number) => void;
    onTemporaryChange?: (value: number) => void;
    onResetTemporary?: () => void;
}

export const ResourceField: React.FC<ResourceFieldProps> = ({
    label,
    base,
    additional,
    temporary,
    total,
    isEditable,
    baseEditable = true,
    onBaseChange,
    onAdditionalChange,
    onTemporaryChange,
    onResetTemporary
}) => {
    return (
        <Card variant="outlined" className="bg-white/70">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
                {label}
            </label>

            <Grid cols={4} gap="sm">
                <div>
                    <label className="text-xs text-gray-500">Base</label>
                    <input
                        type="number"
                        min="0"
                        max="999"
                        value={base}
                        disabled={!isEditable || !baseEditable}
                        onChange={(e) => onBaseChange?.(parseInt(e.target.value) || 0)}
                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-gray-100 text-center font-semibold"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500">Adicional</label>
                    <input
                        type="number"
                        min="0"
                        max="999"
                        value={additional}
                        disabled={!isEditable}
                        onChange={(e) => onAdditionalChange?.(parseInt(e.target.value) || 0)}
                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-gray-100 text-center font-semibold"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500">Temporário</label>
                    <div className="flex gap-1">
                        <input
                            type="number"
                            min="0"
                            max="999"
                            value={temporary}
                            disabled={!isEditable}
                            onChange={(e) => onTemporaryChange?.(parseInt(e.target.value) || 0)}
                            className="flex-1 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-gray-100 text-center font-semibold"
                        />
                        {isEditable && onResetTemporary && temporary > 0 && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={onResetTemporary}
                                className="text-xs px-1 py-1"
                            >
                                ×
                            </Button>
                        )}
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-500">Total</label>
                    <div className="w-full px-1 py-1 text-xs bg-green-100 border border-gray-300 rounded text-center font-semibold text-green-800">
                        {total}
                    </div>
                </div>
            </Grid>
        </Card>
    );
};
