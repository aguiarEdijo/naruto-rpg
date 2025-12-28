'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Button, Flex, Input, Textarea } from '@/components/ui';
import { GMHeader } from '@/components/gm/GMHeader';
import { DataTable, Column } from '@/components/gm/DataTable';
import { FormModal } from '@/components/gm/FormModal';
import { ItemsService, Item } from '@/lib/api/items';
import { useItems, useItemMutations } from '@/hooks/queries/useItems';


export default function ItemsManagementPage() {
    const { data: items = [], isLoading: loading } = useItems();
    const { createItem, updateItem, deleteItem } = useItemMutations();

    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        tipo: '',
        preco: '',
        descricao: '',
        tempo_criacao: '',
        efeito_colateral: '',
        sistema_mecanico: '',
        duracao: '',
        detalhes: ''
    });

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({
            nome: '',
            tipo: '',
            preco: '',
            descricao: '',
            tempo_criacao: '',
            efeito_colateral: '',
            sistema_mecanico: '',
            duracao: '',
            detalhes: ''
        });
        setShowModal(true);
    };

    const handleEdit = (item: Item) => {
        setEditingItem(item);
        setFormData({
            nome: item.nome,
            tipo: item.tipo,
            preco: item.preco,
            descricao: item.descricao || '',
            tempo_criacao: item.tempo_criacao || '',
            efeito_colateral: item.efeito_colateral || '',
            sistema_mecanico: item.sistema_mecanico || '',
            duracao: item.duracao || '',
            detalhes: item.detalhes || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (item: Item) => {
        if (!confirm(`Tem certeza que deseja excluir o item "${item.nome}"?`)) {
            return;
        }

        try {
            await deleteItem.mutateAsync(item.id);
        } catch (error) {
            console.error('Erro ao excluir item:', error);
            alert('Erro ao excluir item. Verifique o console para mais detalhes.');
        }
    };

    const handleSubmit = async () => {
        // Prevenir múltiplos cliques
        if (submitting) {
            return;
        }

        try {
            setSubmitting(true);

            if (editingItem) {
                await updateItem.mutateAsync({ id: editingItem.id, data: formData });
            } else {
                await createItem.mutateAsync(formData);
            }

            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar item:', error);
            alert('Erro ao salvar item. Verifique o console para mais detalhes.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descricao?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns: Column<Item>[] = [
        {
            key: 'nome',
            label: 'Nome',
            render: (value) => <span className="font-semibold text-gray-900">{value}</span>
        },
        {
            key: 'tipo',
            label: 'Tipo',
            render: (value) => (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {value}
                </span>
            )
        },
        {
            key: 'preco',
            label: 'Preço',
            render: (value) => <span className="font-medium text-orange-600">{value}</span>
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
                title="Gerenciar Itens"
                count={items.length}
                countLabel="item"
                onAction={handleCreate}
                actionLabel="+ Novo Item"
            />

            <Container className="py-8">
                <DataTable
                    data={filteredItems}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    searchable
                    onSearch={setSearchQuery}
                    searchPlaceholder="Buscar itens por nome, tipo ou descrição..."
                    emptyMessage="Nenhum item encontrado"
                />
            </Container>

            <FormModal
                isOpen={showModal}
                onClose={() => {
                    if (!submitting) {
                        setShowModal(false);
                    }
                }}
                title={editingItem ? 'Editar Item' : 'Novo Item'}
                onSubmit={handleSubmit}
                loading={submitting}
                size="xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nome do Item"
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

                    <Input
                        label="Preço"
                        value={formData.preco}
                        onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                        placeholder="Ex: 100 ryo"
                        required
                    />

                    <Textarea
                        label="Descrição"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={4}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Tempo de Criação"
                            value={formData.tempo_criacao}
                            onChange={(e) => setFormData({ ...formData, tempo_criacao: e.target.value })}
                        />

                        <Input
                            label="Duração"
                            value={formData.duracao}
                            onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                        />
                    </div>

                    <Textarea
                        label="Sistema Mecânico"
                        value={formData.sistema_mecanico}
                        onChange={(e) => setFormData({ ...formData, sistema_mecanico: e.target.value })}
                        rows={3}
                        placeholder="Descreva os efeitos no sistema..."
                    />

                    <Textarea
                        label="Efeitos Colaterais"
                        value={formData.efeito_colateral}
                        onChange={(e) => setFormData({ ...formData, efeito_colateral: e.target.value })}
                        rows={2}
                        placeholder="Descreva os efeitos colaterais..."
                    />

                    <Textarea
                        label="Detalhes Adicionais"
                        value={formData.detalhes}
                        onChange={(e) => setFormData({ ...formData, detalhes: e.target.value })}
                        rows={2}
                    />
                </div>
            </FormModal>
        </div>
    );
}

