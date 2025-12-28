'use client';

import React, { useState } from 'react';
import { Container, Button, Input, Textarea, Select } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { DataTable, Column } from '@/components/gm/DataTable';
import { FormModal } from '@/components/gm/FormModal';
import { CreateJutsuModal } from '@/components/gm/CreateJutsuModal';
import { JutsusService, Jutsu } from '@/lib/api/jutsus';
import { useJutsus, useJutsuMutations } from '@/hooks/queries/useJutsus';

const tiposJutsu = [
    { value: 'Ninjutsu', label: 'Ninjutsu' },
    { value: 'Taijutsu', label: 'Taijutsu' },
    { value: 'Genjutsu', label: 'Genjutsu' }
];

const ranks = [
    { value: 'E', label: 'E' },
    { value: 'D', label: 'D' },
    { value: 'C', label: 'C' },
    { value: 'B', label: 'B' },
    { value: 'A', label: 'A' },
    { value: 'S', label: 'S' }
];

export default function JutsusManagementPage() {
    const { data: jutsus = [], isLoading: loading } = useJutsus();
    const { createJutsu, updateJutsu, deleteJutsu } = useJutsuMutations();

    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingJutsu, setEditingJutsu] = useState<Jutsu | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        tipo_jutsu: 'Ninjutsu' as 'Ninjutsu' | 'Taijutsu' | 'Genjutsu',
        subtipo: '',
        rank: 'E' as 'E' | 'D' | 'C' | 'B' | 'A' | 'S',
        custo_chakra: '',
        acao: '',
        duracao: '',
        restricao: '',
        descricao: ''
    });

    const handleCreate = () => {
        setShowCreateModal(true);
    };

    const handleEdit = (jutsu: Jutsu) => {
        setEditingJutsu(jutsu);
        setFormData({
            nome: jutsu.nome,
            tipo_jutsu: jutsu.tipo_jutsu,
            subtipo: jutsu.subtipo || '',
            rank: jutsu.rank,
            custo_chakra: jutsu.custo_chakra,
            acao: jutsu.acao,
            duracao: jutsu.duracao,
            restricao: jutsu.restricao || '',
            descricao: jutsu.descricao
        });
        setShowModal(true);
    };

    const handleDelete = async (jutsu: Jutsu) => {
        if (!confirm(`Tem certeza que deseja excluir o jutsu "${jutsu.nome}"?`)) {
            return;
        }

        try {
            await deleteJutsu.mutateAsync(jutsu.id);
        } catch (error) {
            console.error('Erro ao excluir jutsu:', error);
            alert('Erro ao excluir jutsu. Verifique o console para mais detalhes.');
        }
    };

    const handleSubmit = async () => {
        if (submitting) {
            return;
        }

        try {
            setSubmitting(true);

            const dataToSubmit = {
                ...formData,
                subtipo: formData.subtipo || null,
                restricao: formData.restricao || null
            };

            if (editingJutsu) {
                await updateJutsu.mutateAsync({ id: editingJutsu.id, data: dataToSubmit });
            } else {
                await createJutsu.mutateAsync(dataToSubmit);
            }

            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar jutsu:', error);
            alert('Erro ao salvar jutsu. Verifique o console para mais detalhes.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredJutsus = jutsus.filter(jutsu =>
        jutsu.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jutsu.tipo_jutsu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jutsu.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRankColor = (rank: string) => {
        const colors: Record<string, string> = {
            'E': 'text-gray-600',
            'D': 'text-green-600',
            'C': 'text-blue-600',
            'B': 'text-yellow-600',
            'A': 'text-orange-600',
            'S': 'text-red-600'
        };
        return colors[rank] || 'text-gray-600';
    };

    const columns: Column<Jutsu>[] = [
        {
            key: 'nome',
            label: 'Nome',
            render: (value) => <span className="font-semibold text-gray-900">{value}</span>
        },
        {
            key: 'tipo_jutsu',
            label: 'Tipo',
            render: (value) => <span className="text-sm font-medium text-blue-600">{value}</span>
        },
        {
            key: 'rank',
            label: 'Rank',
            render: (value, row) => (
                <span className={`text-sm font-bold ${getRankColor(value as string)}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'custo_chakra',
            label: 'Custo Chakra',
            render: (value) => <span className="text-sm text-gray-600">{value}</span>
        },
        {
            key: 'descricao',
            label: 'Descrição',
            render: (value) => (
                <span className="text-sm text-gray-600">
                    {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                </span>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Gerenciar Jutsus"
                count={jutsus.length}
                countLabel="jutsu"
                onAction={handleCreate}
                actionLabel="+ Novo Jutsu"
            />

            <Container className="py-8">
                <DataTable
                    data={filteredJutsus}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    searchable
                    onSearch={setSearchQuery}
                    searchPlaceholder="Buscar jutsus por nome, tipo ou descrição..."
                    emptyMessage="Nenhum jutsu encontrado"
                />
            </Container>

            {/* Modal de criação com sistema de PE e efeitos */}
            {!editingJutsu && (
                <CreateJutsuModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={async (jutsuData) => {
                        try {
                            setSubmitting(true);
                            await createJutsu.mutateAsync(jutsuData);
                            setShowCreateModal(false);
                        } catch (error) {
                            console.error('Erro ao criar jutsu:', error);
                            alert('Erro ao criar jutsu. Verifique o console para mais detalhes.');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                />
            )}

            {/* Modal de edição (mantém o formulário simples) */}
            {editingJutsu && (
                <FormModal
                    isOpen={showModal}
                    onClose={() => {
                        if (!submitting) {
                            setShowModal(false);
                            setEditingJutsu(null);
                        }
                    }}
                    title="Editar Jutsu"
                    onSubmit={handleSubmit}
                    loading={submitting}
                    size="xl"
                >
                    <div className="space-y-4">
                        <Input
                            label="Nome do Jutsu"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Tipo de Jutsu"
                                value={formData.tipo_jutsu}
                                onChange={(e) => setFormData({ ...formData, tipo_jutsu: e.target.value as any })}
                                options={tiposJutsu}
                                required
                            />

                            <Select
                                label="Rank"
                                value={formData.rank}
                                onChange={(e) => setFormData({ ...formData, rank: e.target.value as any })}
                                options={ranks}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Subtipo (opcional)"
                                value={formData.subtipo}
                                onChange={(e) => setFormData({ ...formData, subtipo: e.target.value })}
                                placeholder="Ex: Katon, Suiton..."
                            />

                            <Input
                                label="Custo de Chakra"
                                value={formData.custo_chakra}
                                onChange={(e) => setFormData({ ...formData, custo_chakra: e.target.value })}
                                placeholder="Ex: 10, Variável..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Ação"
                                value={formData.acao}
                                onChange={(e) => setFormData({ ...formData, acao: e.target.value })}
                                placeholder="Ex: Padrão, Movimento..."
                                required
                            />

                            <Input
                                label="Duração"
                                value={formData.duracao}
                                onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                                placeholder="Ex: Instantâneo, 1 rodada..."
                                required
                            />
                        </div>

                        <Input
                            label="Restrição (opcional)"
                            value={formData.restricao}
                            onChange={(e) => setFormData({ ...formData, restricao: e.target.value })}
                            placeholder="Ex: Apenas Uchiha, Requer Sharingan..."
                        />

                        <Textarea
                            label="Descrição"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            rows={4}
                            required
                        />
                    </div>
                </FormModal>
            )}
        </div>
    );
}
