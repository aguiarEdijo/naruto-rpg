'use client';

import React from 'react';
import { Card, Button, Input, Badge } from '@/components/ui';

export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    loading?: boolean;
    searchable?: boolean;
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    emptyMessage?: string;
}

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    onEdit,
    onDelete,
    loading = false,
    searchable = false,
    onSearch,
    searchPlaceholder = 'Buscar...',
    emptyMessage = 'Nenhum item encontrado'
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    };

    return (
        <Card>
            {searchable && (
                <div className="mb-4">
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        variant="filled"
                    />
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted">Carregando...</p>
                </div>
            ) : data.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted text-lg">{emptyMessage}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                {columns.map((column) => (
                                    <th
                                        key={String(column.key)}
                                        className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${column.className || ''}`}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                                {(onEdit || onDelete) && (
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        Ações
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={String(column.key)}
                                            className={`px-4 py-3 text-sm text-gray-600 ${column.className || ''}`}
                                        >
                                            {column.render
                                                ? column.render(
                                                      typeof column.key === 'string'
                                                          ? (item as any)[column.key]
                                                          : item[column.key],
                                                      item
                                                  )
                                                : typeof column.key === 'string'
                                                ? (item as any)[column.key]?.toString() || '-'
                                                : item[column.key]?.toString() || '-'}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {onEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEdit(item)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        Editar
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDelete(item)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        Excluir
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
}

