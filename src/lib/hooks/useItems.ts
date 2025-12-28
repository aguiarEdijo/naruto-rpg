import { useState, useEffect } from 'react';
import { ItemsService, Item } from '@/lib/api/items';
import { simpleCache } from '@/lib/cache';

export const useItems = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async (forceReload = false) => {
            try {
                // Verificar cache (pode ser bypassado)
                const cached = simpleCache.get<Item[]>('items', forceReload);
                if (cached && !forceReload) {
                    setItems(cached);
                    setLoading(false);
                    return;
                }

                setLoading(true);
                const data = await ItemsService.getAllItems();

                // Armazenar no cache
                simpleCache.set('items', data);

                setItems(data);
            } catch (err) {
                console.error('Failed to fetch items:', err);
                setError('Failed to load items data.');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    // Função para forçar reload (pode ser chamada externamente)
    const reload = () => {
        simpleCache.invalidate('items');
        setLoading(true);
        ItemsService.getAllItems()
            .then(data => {
                simpleCache.set('items', data);
                setItems(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to reload items:', err);
                setError('Failed to reload items data.');
                setLoading(false);
            });
    };

    // Obter itens utilitários (excluindo armas)
    const getUtilityItems = (): Item[] => {
        return items.filter(item =>
            !item.tipo.includes('Arma') &&
            !item.tipo.includes('arma')
        );
    };

    // Obter itens por categoria
    const getItemsByCategory = (category: string): Item[] => {
        return items.filter(item => item.tipo === category);
    };

    // Obter categorias de itens
    const getCategories = (): string[] => {
        const categories = new Set<string>();
        items.forEach(item => categories.add(item.tipo));
        return Array.from(categories);
    };

    return {
        items,
        utilityItems: getUtilityItems(),
        loading,
        error,
        getItemsByCategory,
        getCategories,
        reload, // Exportar função de reload
    };
};



