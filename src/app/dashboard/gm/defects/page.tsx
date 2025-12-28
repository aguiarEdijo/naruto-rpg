'use client';

import React, { useState } from 'react';
import { Container, Button, Input, Textarea } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { DataTable, Column } from '@/components/gm/DataTable';
import { FormModal } from '@/components/gm/FormModal';
import { DefectsService, Defect } from '@/lib/api/defects';
import { useDefects, useDefectMutations } from '@/hooks/queries/useDefects';

export default function DefectsManagementPage() {
    const { data: defects = [], isLoading: loading } = useDefects();
    const { createDefect, updateDefect, deleteDefect } = useDefectMutations();

    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingDefect, setEditingDefect] = useState<Defect | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        tipo: '',
        descricao: ''
    });

    const handleCreate = () => {
        setEditingDefect(null);
        setFormData({
            nome: '',
            tipo: '',
            descricao: ''
        });
        setShowModal(true);
    };

    const handleEdit = (defect: Defect) => {
        setEditingDefect(defect);
        setFormData({
            nome: defect.nome,
            tipo: defect.tipo,
            descricao: defect.descricao
        });
        setShowModal(true);
    };

    const handleDelete = async (defect: Defect) => {
        if (!confirm(`Tem certeza que deseja excluir o defeito "${defect.nome}"?`)) {
            return;
        }

        try {
            await deleteDefect.mutateAsync(defect.id);
        } catch (error) {
            console.error('Erro ao excluir defeito:', error);
            alert('Erro ao excluir defeito. Verifique o console para mais detalhes.');
        }
    };

    const handleSubmit = async () => {
        if (submitting) {
            return;
        }

        try {
            setSubmitting(true);

            if (editingDefect) {
                await updateDefect.mutateAsync({ id: editingDefect.id, data: formData });
            } else {
                await createDefect.mutateAsync(formData);
            }

            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar defeito:', error);
            alert('Erro ao salvar defeito. Verifique o console para mais detalhes.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredDefects = defects.filter(defect =>
        defect.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        defect.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        defect.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns: Column<Defect>[] = [
        {
            key: 'nome',
            label: 'Nome',
            render: (value) => <span className="font-semibold text-gray-900">{value}</span>
        },
        {
            key: 'tipo',
            label: 'Tipo',
            render: (value) => <span className="text-sm text-gray-600">{value}</span>
        },
        {
            key: 'descricao',
            label: 'Descrição',
            render: (value) => <span className="text-sm text-gray-600">{value}</span>
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Gerenciar Defeitos"
                count={defects.length}
                countLabel="defeito"
                onAction={handleCreate}
                actionLabel="+ Novo Defeito"
            />

            <Container className="py-8">
                <DataTable
                    data={filteredDefects}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    searchable
                    onSearch={setSearchQuery}
                    searchPlaceholder="Buscar defeitos por nome, tipo ou descrição..."
                    emptyMessage="Nenhum defeito encontrado"
                />
            </Container>

            <FormModal
                isOpen={showModal}
                onClose={() => {
                    if (!submitting) {
                        setShowModal(false);
                    }
                }}
                title={editingDefect ? 'Editar Defeito' : 'Novo Defeito'}
                onSubmit={handleSubmit}
                loading={submitting}
            >
                <div className="space-y-4">
                    <Input
                        label="Nome do Defeito"
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
