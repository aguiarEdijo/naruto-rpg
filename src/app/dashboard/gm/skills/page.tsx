'use client';

import React, { useState } from 'react';
import { Container, Button, Input, Textarea, Select } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { DataTable, Column } from '@/components/gm/DataTable';
import { FormModal } from '@/components/gm/FormModal';
import { SkillsService, Skill } from '@/lib/api/skills';
import { useSkills, useSkillMutations } from '@/hooks/queries/useSkills';

const attributes = [
    { value: 'FOR', label: 'Força (FOR)' },
    { value: 'VIG', label: 'Vigor (VIG)' },
    { value: 'AGI', label: 'Agilidade (AGI)' },
    { value: 'INT', label: 'Inteligência (INT)' },
    { value: 'PER', label: 'Percepção (PER)' },
    { value: 'ESS', label: 'Essência (ESS)' },
    { value: 'INF', label: 'Influência (INF)' }
];

export default function SkillsManagementPage() {
    const { data: skills = [], isLoading: loading } = useSkills();
    const { createSkill, updateSkill, deleteSkill } = useSkillMutations();

    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        atributo_base: '',
        descricao: ''
    });

    const handleCreate = () => {
        setEditingSkill(null);
        setFormData({
            nome: '',
            atributo_base: '',
            descricao: ''
        });
        setShowModal(true);
    };

    const handleEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setFormData({
            nome: skill.nome,
            atributo_base: skill.atributo_base,
            descricao: skill.descricao
        });
        setShowModal(true);
    };

    const handleDelete = async (skill: Skill) => {
        if (!confirm(`Tem certeza que deseja excluir a perícia "${skill.nome}"?`)) {
            return;
        }

        try {
            await deleteSkill.mutateAsync(skill.id);
        } catch (error) {
            console.error('Erro ao excluir perícia:', error);
            alert('Erro ao excluir perícia. Verifique o console para mais detalhes.');
        }
    };

    const handleSubmit = async () => {
        if (submitting) {
            return;
        }

        try {
            setSubmitting(true);

            if (editingSkill) {
                await updateSkill.mutateAsync({ id: editingSkill.id, data: formData });
            } else {
                await createSkill.mutateAsync(formData);
            }

            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar perícia:', error);
            alert('Erro ao salvar perícia. Verifique o console para mais detalhes.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredSkills = skills.filter(skill =>
        skill.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.atributo_base.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns: Column<Skill>[] = [
        {
            key: 'nome',
            label: 'Nome',
            render: (value) => <span className="font-semibold text-gray-900">{value}</span>
        },
        {
            key: 'atributo_base',
            label: 'Atributo Base',
            render: (value) => <span className="text-sm font-medium text-blue-600">{value}</span>
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
                title="Gerenciar Perícias"
                count={skills.length}
                countLabel="perícia"
                onAction={handleCreate}
                actionLabel="+ Nova Perícia"
            />

            <Container className="py-8">
                <DataTable
                    data={filteredSkills}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    searchable
                    onSearch={setSearchQuery}
                    searchPlaceholder="Buscar perícias por nome, atributo ou descrição..."
                    emptyMessage="Nenhuma perícia encontrada"
                />
            </Container>

            <FormModal
                isOpen={showModal}
                onClose={() => {
                    if (!submitting) {
                        setShowModal(false);
                    }
                }}
                title={editingSkill ? 'Editar Perícia' : 'Nova Perícia'}
                onSubmit={handleSubmit}
                loading={submitting}
            >
                <div className="space-y-4">
                    <Input
                        label="Nome da Perícia"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        required
                    />

                    <Select
                        label="Atributo Base"
                        value={formData.atributo_base}
                        onChange={(e) => setFormData({ ...formData, atributo_base: e.target.value })}
                        options={attributes}
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
