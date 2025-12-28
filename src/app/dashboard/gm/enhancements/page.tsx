'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Button, Flex, Input, Textarea } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { DataTable, Column } from '@/components/gm/DataTable';
import { FormModal } from '@/components/gm/FormModal';
import { EnhancementsService, Enhancement } from '@/lib/api/enhancements';
import { useEnhancements, useEnhancementMutations } from '@/hooks/queries/useEnhancements';


export default function EnhancementsManagementPage() {
    const { data: enhancements = [], isLoading: loading } = useEnhancements();
    const { createEnhancement, updateEnhancement, deleteEnhancement } = useEnhancementMutations();

    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingEnhancement, setEditingEnhancement] = useState<Enhancement | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        tipo: '',
        clan_restricao: '',
        rank_restricao: '',
        requisitos: {},
        custo: '',
        acoes: '',
        duracao: '',
        descricao: ''
    });

    const handleCreate = () => {
        setEditingEnhancement(null);
        setFormData({
            nome: '',
            tipo: '',
            clan_restricao: '',
            rank_restricao: '',
            requisitos: {},
            custo: '',
            acoes: '',
            duracao: '',
            descricao: ''
        });
        setShowModal(true);
    };

    const handleEdit = (enhancement: Enhancement) => {
        setEditingEnhancement(enhancement);
        setFormData({
            nome: enhancement.nome,
            tipo: enhancement.tipo,
            clan_restricao: enhancement.clan_restricao || '',
            rank_restricao: enhancement.rank_restricao || '',
            requisitos: enhancement.requisitos || {},
            custo: enhancement.custo || '',
            acoes: enhancement.acoes || '',
            duracao: enhancement.duracao || '',
            descricao: enhancement.descricao
        });
        setShowModal(true);
    };

    const handleDelete = async (enhancement: Enhancement) => {
        if (!confirm(`Tem certeza que deseja excluir o aprimoramento "${enhancement.nome}"?`)) {
            return;
        }

        try {
            await deleteEnhancement.mutateAsync(enhancement.id);
        } catch (error) {
            console.error('Erro ao excluir aprimoramento:', error);
            alert('Erro ao excluir aprimoramento. Verifique o console para mais detalhes.');
        }
    };

    const handleSubmit = async () => {
        if (submitting) {
            return;
        }

        try {
            setSubmitting(true);

            if (editingEnhancement) {
                await updateEnhancement.mutateAsync({ id: editingEnhancement.id, data: formData });
            } else {
                await createEnhancement.mutateAsync(formData);
            }

            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar aprimoramento:', error);
            alert('Erro ao salvar aprimoramento. Verifique o console para mais detalhes.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredEnhancements = enhancements.filter(enhancement =>
        enhancement.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enhancement.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enhancement.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns: Column<Enhancement>[] = [
        {
            key: 'nome',
            label: 'Nome',
            render: (value) => <span className="font-semibold text-gray-900">{value}</span>
        },
        {
            key: 'tipo',
            label: 'Tipo',
            render: (value) => (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    {value}
                </span>
            )
        },
        {
            key: 'clan_restricao',
            label: 'Restrição',
            render: (_, item) => (
                <div className="text-xs space-y-1">
                    {item.clan_restricao && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full inline-block">
                            {item.clan_restricao}
                        </span>
                    )}
                    {item.rank_restricao && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full inline-block ml-1">
                            {item.rank_restricao}
                        </span>
                    )}
                    {!item.clan_restricao && !item.rank_restricao && (
                        <span className="text-gray-400">Geral</span>
                    )}
                </div>
            )
        },
        {
            key: 'custo',
            label: 'Custo',
            render: (value) => <span className="text-sm">{value || '-'}</span>
        },
        {
            key: 'descricao',
            label: 'Descrição',
            render: (value) => (
                <span className="text-sm text-gray-600 line-clamp-2">{value || '-'}</span>
            ),
            className: 'max-w-md'
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Gerenciar Aprimoramentos"
                count={enhancements.length}
                countLabel="aprimoramento"
                onAction={handleCreate}
                actionLabel="+ Novo Aprimoramento"
            />

            <Container className="py-8">
                <DataTable
                    data={filteredEnhancements}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    searchable
                    onSearch={setSearchQuery}
                    searchPlaceholder="Buscar aprimoramentos por nome, tipo ou descrição..."
                    emptyMessage="Nenhum aprimoramento encontrado"
                />
            </Container>

            <FormModal
                isOpen={showModal}
                onClose={() => {
                    if (!submitting) {
                        setShowModal(false);
                    }
                }}
                title={editingEnhancement ? 'Editar Aprimoramento' : 'Novo Aprimoramento'}
                onSubmit={handleSubmit}
                loading={submitting}
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            required
                        />

                        <Input
                            label="Tipo"
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Restrição de Clã"
                            value={formData.clan_restricao}
                            onChange={(e) => setFormData({ ...formData, clan_restricao: e.target.value })}
                            placeholder="Deixe vazio para geral"
                        />

                        <Input
                            label="Restrição de Rank"
                            value={formData.rank_restricao}
                            onChange={(e) => setFormData({ ...formData, rank_restricao: e.target.value })}
                            placeholder="Ex: Genin, Chunnin..."
                        />
                    </div>

                    <Input
                        label="Custo"
                        value={formData.custo}
                        onChange={(e) => setFormData({ ...formData, custo: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Ações"
                            value={formData.acoes}
                            onChange={(e) => setFormData({ ...formData, acoes: e.target.value })}
                        />

                        <Input
                            label="Duração"
                            value={formData.duracao}
                            onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                        />
                    </div>

                    <Textarea
                        label="Descrição"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={4}
                        required
                    />
                </div>
            </FormModal>
        </div>
    );
}

