'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Card, Button, Flex, Input, Textarea, Select } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { DataTable, Column } from '@/components/gm/DataTable';
import { FormModal } from '@/components/gm/FormModal';
import { ClansService, Clan } from '@/lib/api/clans';
import { useClans, useClanMutations } from '@/hooks/queries/useClans';


export default function ClansManagementPage() {
    const { data: clans = [], isLoading: loading } = useClans();
    const { createClan, updateClan, deleteClan } = useClanMutations();

    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingClan, setEditingClan] = useState<Clan | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        modificador_for: 0,
        modificador_vig: 0,
        modificador_agi: 0,
        modificador_int: 0,
        modificador_per: 0,
        modificador_ess: 0,
        modificador_inf: 0,
        qualidade_inicial: '',
        defeitos_iniciais: '',
        bonus_iniciais: '',
        foco_atributos: ''
    });

    const handleCreate = () => {
        setEditingClan(null);
        setFormData({
            nome: '',
            descricao: '',
            modificador_for: 0,
            modificador_vig: 0,
            modificador_agi: 0,
            modificador_int: 0,
            modificador_per: 0,
            modificador_ess: 0,
            modificador_inf: 0,
            qualidade_inicial: '',
            defeitos_iniciais: '',
            bonus_iniciais: '',
            foco_atributos: ''
        });
        setShowModal(true);
    };

    const handleEdit = (clan: Clan) => {
        setEditingClan(clan);
        setFormData({
            nome: clan.nome,
            descricao: clan.descricao,
            modificador_for: clan.modificador_for,
            modificador_vig: clan.modificador_vig,
            modificador_agi: clan.modificador_agi,
            modificador_int: clan.modificador_int,
            modificador_per: clan.modificador_per,
            modificador_ess: clan.modificador_ess,
            modificador_inf: clan.modificador_inf,
            qualidade_inicial: clan.qualidade_inicial || '',
            defeitos_iniciais: clan.defeitos_iniciais || '',
            bonus_iniciais: clan.bonus_iniciais || '',
            foco_atributos: clan.foco_atributos
        });
        setShowModal(true);
    };

    const handleDelete = async (clan: Clan) => {
        if (!confirm(`Tem certeza que deseja excluir o clã "${clan.nome}"?`)) {
            return;
        }

        try {
            await deleteClan.mutateAsync(clan.id);
        } catch (error) {
            console.error('Erro ao excluir clã:', error);
            alert('Erro ao excluir clã. Verifique o console para mais detalhes.');
        }
    };

    const handleSubmit = async () => {
        // Prevenir múltiplos cliques
        if (submitting) {
            return;
        }

        try {
            setSubmitting(true);

            if (editingClan) {
                await updateClan.mutateAsync({ id: editingClan.id, data: formData });
            } else {
                await createClan.mutateAsync(formData);
            }

            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar clã:', error);
            alert('Erro ao salvar clã. Verifique o console para mais detalhes.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredClans = clans.filter(clan =>
        clan.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clan.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns: Column<Clan>[] = [
        {
            key: 'nome',
            label: 'Nome',
            render: (value) => <span className="font-semibold text-gray-900">{value}</span>
        },
        {
            key: 'updated_at',
            label: 'Última Atualização',
            render: (value) => value ? (
                <span className="text-xs text-gray-500">
                    {new Date(value).toLocaleDateString('pt-BR')}
                </span>
            ) : (
                <span className="text-xs text-gray-400">-</span>
            ),
            className: 'hidden md:table-cell'
        },
        {
            key: 'descricao',
            label: 'Descrição',
            render: (value) => <span className="text-sm text-gray-600 line-clamp-2">{value || '-'}</span>,
            className: 'max-w-md'
        },
        {
            key: 'foco_atributos',
            label: 'Foco',
            render: (value) => <span className="text-sm">{value || '-'}</span>
        },
        {
            key: 'modificador_for',
            label: 'Modificadores',
            render: (_, item) => (
                <div className="text-xs space-y-1">
                    <div className="flex gap-2">
                        <span>FOR: {item.modificador_for > 0 ? '+' : ''}{item.modificador_for}</span>
                        <span>VIG: {item.modificador_vig > 0 ? '+' : ''}{item.modificador_vig}</span>
                        <span>AGI: {item.modificador_agi > 0 ? '+' : ''}{item.modificador_agi}</span>
                    </div>
                    <div className="flex gap-2">
                        <span>INT: {item.modificador_int > 0 ? '+' : ''}{item.modificador_int}</span>
                        <span>PER: {item.modificador_per > 0 ? '+' : ''}{item.modificador_per}</span>
                        <span>ESS: {item.modificador_ess > 0 ? '+' : ''}{item.modificador_ess}</span>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Gerenciar Clãs"
                count={clans.length}
                countLabel="clã"
                onAction={handleCreate}
                actionLabel="+ Novo Clã"
            />

            <Container className="py-8">
                <DataTable
                    data={filteredClans}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    searchable
                    onSearch={setSearchQuery}
                    searchPlaceholder="Buscar clãs por nome ou descrição..."
                    emptyMessage="Nenhum clã encontrado"
                />
            </Container>

            <FormModal
                isOpen={showModal}
                onClose={() => {
                    if (!submitting) {
                        setShowModal(false);
                    }
                }}
                title={editingClan ? 'Editar Clã' : 'Novo Clã'}
                onSubmit={handleSubmit}
                loading={submitting}
                size="lg"
            >
                <div className="space-y-4">
                    <Input
                        label="Nome do Clã"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Descrição"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={4}
                        required
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Input
                            label="FOR"
                            type="number"
                            value={formData.modificador_for}
                            onChange={(e) => setFormData({ ...formData, modificador_for: parseInt(e.target.value) || 0 })}
                        />
                        <Input
                            label="VIG"
                            type="number"
                            value={formData.modificador_vig}
                            onChange={(e) => setFormData({ ...formData, modificador_vig: parseInt(e.target.value) || 0 })}
                        />
                        <Input
                            label="AGI"
                            type="number"
                            value={formData.modificador_agi}
                            onChange={(e) => setFormData({ ...formData, modificador_agi: parseInt(e.target.value) || 0 })}
                        />
                        <Input
                            label="INT"
                            type="number"
                            value={formData.modificador_int}
                            onChange={(e) => setFormData({ ...formData, modificador_int: parseInt(e.target.value) || 0 })}
                        />
                        <Input
                            label="PER"
                            type="number"
                            value={formData.modificador_per}
                            onChange={(e) => setFormData({ ...formData, modificador_per: parseInt(e.target.value) || 0 })}
                        />
                        <Input
                            label="ESS"
                            type="number"
                            value={formData.modificador_ess}
                            onChange={(e) => setFormData({ ...formData, modificador_ess: parseInt(e.target.value) || 0 })}
                        />
                        <Input
                            label="INF"
                            type="number"
                            value={formData.modificador_inf}
                            onChange={(e) => setFormData({ ...formData, modificador_inf: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <Input
                        label="Foco de Atributos"
                        value={formData.foco_atributos}
                        onChange={(e) => setFormData({ ...formData, foco_atributos: e.target.value })}
                    />

                    <Input
                        label="Qualidade Inicial"
                        value={formData.qualidade_inicial}
                        onChange={(e) => setFormData({ ...formData, qualidade_inicial: e.target.value })}
                    />

                    <Textarea
                        label="Defeitos Iniciais"
                        value={formData.defeitos_iniciais}
                        onChange={(e) => setFormData({ ...formData, defeitos_iniciais: e.target.value })}
                        rows={2}
                    />

                    <Textarea
                        label="Bônus Iniciais"
                        value={formData.bonus_iniciais}
                        onChange={(e) => setFormData({ ...formData, bonus_iniciais: e.target.value })}
                        rows={2}
                    />
                </div>
            </FormModal>
        </div>
    );
}

