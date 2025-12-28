'use client';

import React, { useState } from 'react';
import { Container, Button, Input, Select } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { DataTable, Column } from '@/components/gm/DataTable';
import { FormModal } from '@/components/gm/FormModal';
import { LevelProgressionService, LevelProgression } from '@/lib/api/levelProgression';
import { useLevelProgression, useLevelProgressionMutations } from '@/hooks/queries/useLevelProgression';

const ranks = ['Genin', 'Chunnin', 'Jounin', 'Hokage'];

export default function LevelProgressionManagementPage() {
    const { data: levels = [], isLoading: loading, error } = useLevelProgression();
    const { createLevel, updateLevel, deleteLevel } = useLevelProgressionMutations();

    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingLevel, setEditingLevel] = useState<LevelProgression | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        level: 1,
        rank: 'Genin',
        dice_evolution: '',
        attribute_points: '',
        skill_points: '',
        total_skill_gain: 0
    });

    const handleCreate = () => {
        setEditingLevel(null);
        setFormData({
            level: 1,
            rank: 'Genin',
            dice_evolution: '',
            attribute_points: '',
            skill_points: '',
            total_skill_gain: 0
        });
        setShowModal(true);
    };

    const handleEdit = (level: LevelProgression) => {
        setEditingLevel(level);
        setFormData({
            level: level.level,
            rank: level.rank,
            dice_evolution: level.dice_evolution,
            attribute_points: level.attribute_points,
            skill_points: level.skill_points,
            total_skill_gain: level.total_skill_gain
        });
        setShowModal(true);
    };

    const handleDelete = async (level: LevelProgression) => {
        if (!confirm(`Tem certeza que deseja excluir o nível ${level.level} (${level.rank})?`)) {
            return;
        }

        try {
            await deleteLevel.mutateAsync(level.id);
        } catch (error) {
            console.error('Erro ao excluir nível:', error);
            alert('Erro ao excluir nível. Verifique o console para mais detalhes.');
        }
    };

    const handleSubmit = async () => {
        if (submitting) {
            return;
        }

        try {
            setSubmitting(true);

            if (editingLevel) {
                await updateLevel.mutateAsync({ id: editingLevel.id, data: formData });
            } else {
                await createLevel.mutateAsync(formData);
            }

            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar nível:', error);
            alert('Erro ao salvar nível. Verifique o console para mais detalhes.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredLevels = levels.filter(level =>
        level.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
        level.level.toString().includes(searchQuery)
    );

    const columns: Column<LevelProgression>[] = [
        {
            key: 'level',
            label: 'Nível',
            render: (value) => <span className="font-semibold text-gray-900">{value}</span>
        },
        {
            key: 'rank',
            label: 'Patente',
            render: (value) => <span className="text-sm font-medium text-blue-600">{value}</span>
        },
        {
            key: 'dice_evolution',
            label: 'Evolução de Dados',
            render: (value) => <span className="text-sm text-gray-600">{value}</span>
        },
        {
            key: 'attribute_points',
            label: 'Pontos de Atributo',
            render: (value) => <span className="text-sm text-gray-600">{value}</span>
        },
        {
            key: 'skill_points',
            label: 'Pontos de Perícia',
            render: (value) => <span className="text-sm text-gray-600">{value}</span>
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Progressão de Níveis"
                count={levels.length}
                countLabel="nível"
                onAction={handleCreate}
                actionLabel="+ Novo Nível"
            />

            <Container className="py-8">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-semibold">Erro ao carregar progressão de níveis:</p>
                        <p className="text-red-600 text-sm mt-1">{error.message}</p>
                    </div>
                )}

                <DataTable
                    data={filteredLevels}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    searchable
                    onSearch={setSearchQuery}
                    searchPlaceholder="Buscar por nível ou patente..."
                    emptyMessage="Nenhum nível encontrado"
                />
            </Container>

            <FormModal
                isOpen={showModal}
                onClose={() => {
                    if (!submitting) {
                        setShowModal(false);
                    }
                }}
                title={editingLevel ? 'Editar Nível' : 'Novo Nível'}
                onSubmit={handleSubmit}
                loading={submitting}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nível"
                            type="number"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                            required
                        />

                        <Select
                            label="Patente"
                            value={formData.rank}
                            onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                            options={ranks.map(r => ({ value: r, label: r }))}
                            required
                        />
                    </div>

                    <Input
                        label="Evolução de Dados"
                        value={formData.dice_evolution}
                        onChange={(e) => setFormData({ ...formData, dice_evolution: e.target.value })}
                        placeholder="Ex: 1d6"
                        required
                    />

                    <Input
                        label="Pontos de Atributo"
                        value={formData.attribute_points}
                        onChange={(e) => setFormData({ ...formData, attribute_points: e.target.value })}
                        placeholder="Ex: +2"
                        required
                    />

                    <Input
                        label="Pontos de Perícia"
                        value={formData.skill_points}
                        onChange={(e) => setFormData({ ...formData, skill_points: e.target.value })}
                        placeholder="Ex: +5"
                        required
                    />

                    <Input
                        label="Ganho Total de Perícia"
                        type="number"
                        value={formData.total_skill_gain}
                        onChange={(e) => setFormData({ ...formData, total_skill_gain: parseInt(e.target.value) || 0 })}
                        required
                    />
                </div>
            </FormModal>
        </div>
    );
}
