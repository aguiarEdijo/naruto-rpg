'use client';

import React from 'react';
import { Modal, Button } from '@/components/ui';

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function FormModal({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    submitLabel = 'Salvar',
    cancelLabel = 'Cancelar',
    loading = false,
    size = 'md'
}: FormModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size={size}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit?.();
                }}
                className="space-y-6"
            >
                {children}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    {onSubmit && (
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                        >
                            {submitLabel}
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
}

