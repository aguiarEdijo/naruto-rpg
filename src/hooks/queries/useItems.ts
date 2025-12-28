import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ItemsService, Item } from '@/lib/api/items';

export const ITEMS_QUERY_KEY = ['items'];

export function useItems() {
    return useQuery({
        queryKey: ITEMS_QUERY_KEY,
        queryFn: ItemsService.getAllItems,
    });
}

export function useItemMutations() {
    const queryClient = useQueryClient();

    const createItem = useMutation({
        mutationFn: ItemsService.createItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
        },
    });

    const updateItem = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Item> }) =>
            ItemsService.updateItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
        },
    });

    const deleteItem = useMutation({
        mutationFn: ItemsService.deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
        },
    });

    return {
        createItem,
        updateItem,
        deleteItem,
    };
}
