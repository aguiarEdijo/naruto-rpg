'use client';

import React, { useState } from 'react';
import { Container, Button, Input, Textarea } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { DataTable, Column } from '@/components/gm/DataTable';
import { FormModal } from '@/components/gm/FormModal';
import { useJutsuEffects, useJutsuEffectMutations } from '@/hooks/queries/useGameRules';
import type { JutsuEffect } from '@/types/gameRules';

export default function JutsuEffectsPage() {
    const { data: effects = [], isLoading: loading } = useJutsuEffects();
    const { createJutsuEffect, updateJutsuEffect, deleteJutsuEffect } = useJutsuEffectMutations();

    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingEffect, setEditingEffect] = useState<JutsuEffect | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        custo: 0,
        requisito: '',
        descricao: '',
        categoria: ''
    });

    const handleCreate = () => {
        setEditingEffect(null);
        setFormData({
            name: '',
            custo: 0,
            requisito: '',
            descricao: '',
            categoria: ''
        });
        setShowModal(true);
    };

    const handleEdit = (effect: JutsuEffect) => {
        setEditingEffect(effect);
        setFormData({
            name: effect.name,
            custo: effect.custo,
            requisito: effect.requisito || '',
            descricao: effect.descricao,
            categoria: effect.categoria || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (effect: JutsuEffect) => {
        if (!confirm(`Tem certeza que deseja excluir o efeito "${effect.name}"?`)) {
            return;
        }

        try {
            await deleteJutsuEffect.mutateAsync(effect.id);
        } catch (error) {
            console.error('Erro ao excluir efeito:', error);
            alert('Erro ao excluir efeito. Verifique o console para mais detalhes.');
        }
    };

    const handleSubmit = async () => {
        if (submitting) return;

        try {
            setSubmitting(true);

            if (editingEffect) {
                await updateJutsuEffect.mutateAsync({ id: editingEffect.id, updates: formData });
            } else {
                await createJutsuEffect.mutateAsync(formData);
            }

            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar efeito:', error);
            alert('Erro ao salvar efeito. Verifique o console para mais detalhes.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredEffects = effects.filter(effect =>
        effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        effect.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (effect.categoria && effect.categoria.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const columns: Column<JutsuEffect>[] = [
        {
            key: 'name',
            label: 'Nome',
            render: (value) => <span className="font-semibold text-gray-900">{value}</span>
        },
        {
            key: 'custo',
            label: 'Custo',
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value > 0 ? 'bg-green-100 text-green-700' : 
                    value < 0 ? 'bg-red-100 text-red-700' : 
                    'bg-gray-100 text-gray-700'
                }`}>
                    {value > 0 ? `+${value}` : value}
                </span>
            )
        },
        {
            key: 'requisito',
            label: 'Requisito',
            render: (value) => value ? (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {value}
                </span>
            ) : (
                <span className="text-gray-400 text-xs">Nenhum</span>
            )
        },
        {
            key: 'categoria',
            label: 'Categoria',
            render: (value) => value ? (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {value}
                </span>
            ) : (
                <span className="text-gray-400 text-xs">Geral</span>
            )
        },
        {
            key: 'descricao',
            label: 'Descrição',
            render: (value) => (
                <span className="text-sm text-gray-600 line-clamp-2">{value}</span>
            ),
            className: 'max-w-md'
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Efeitos de Jutsus"
                count={effects.length}
                countLabel="efeito"
                onAction={handleCreate}
                actionLabel="+ Novo Efeito"
                backLink="/dashboard/gm/game-rules"
            />

            <Container className="py-8">
                <DataTable
                    data={filteredEffects}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    searchable
                    onSearch={setSearchQuery}
                    searchPlaceholder="Buscar efeitos por nome, descrição ou categoria..."
                    emptyMessage="Nenhum efeito encontrado"
                />
            </Container>

            <FormModal
                isOpen={showModal}
                onClose={() => {
                    if (!submitting) {
                        setShowModal(false);
                    }
                }}
                title={editingEffect ? 'Editar Efeito' : 'Novo Efeito'}
                onSubmit={handleSubmit}
                loading={submitting}
                size="lg"
            >
                <div className="space-y-4">
                    <Input
                        label="Nome"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Ex: FA, FD, Ampliado..."
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Custo"
                            type="number"
                            value={formData.custo}
                            onChange={(e) => setFormData({ ...formData, custo: parseInt(e.target.value) || 0 })}
                            required
                            placeholder="1, 2, -1..."
                        />

                        <Input
                            label="Requisito"
                            value={formData.requisito}
                            onChange={(e) => setFormData({ ...formData, requisito: e.target.value })}
                            placeholder="Ex: Acerto, Crítico, Dano..."
                        />
                    </div>

                    <Input
                        label="Categoria"
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        placeholder="Ex: Estilo de Luta (ou deixe vazio para geral)"
                    />

                    <Textarea
                        label="Descrição"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={4}
                        required
                        placeholder="Descreva o efeito do jutsu..."
                    />
                </div>
            </FormModal>
        </div>
    );
}
