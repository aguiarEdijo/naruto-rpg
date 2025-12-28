import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EnhancementsService, Enhancement } from '@/lib/api/enhancements';

export const ENHANCEMENTS_QUERY_KEY = ['enhancements'];

export function useEnhancements() {
    return useQuery({
        queryKey: ENHANCEMENTS_QUERY_KEY,
        queryFn: EnhancementsService.getAllEnhancements,
    });
}

export function useEnhancementMutations() {
    const queryClient = useQueryClient();

    const createEnhancement = useMutation({
        mutationFn: EnhancementsService.createEnhancement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ENHANCEMENTS_QUERY_KEY });
        },
    });

    const updateEnhancement = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Enhancement> }) =>
            EnhancementsService.updateEnhancement(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ENHANCEMENTS_QUERY_KEY });
        },
    });

    const deleteEnhancement = useMutation({
        mutationFn: EnhancementsService.deleteEnhancement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ENHANCEMENTS_QUERY_KEY });
        },
    });

    return {
        createEnhancement,
        updateEnhancement,
        deleteEnhancement,
    };
}
