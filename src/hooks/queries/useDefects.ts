import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DefectsService, Defect } from '@/lib/api/defects';

export const DEFECTS_QUERY_KEY = ['defects'];

export function useDefects() {
    return useQuery({
        queryKey: DEFECTS_QUERY_KEY,
        queryFn: DefectsService.getAllDefects,
    });
}

export function useDefectMutations() {
    const queryClient = useQueryClient();

    const createDefect = useMutation({
        mutationFn: DefectsService.createDefect,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DEFECTS_QUERY_KEY });
        },
    });

    const updateDefect = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Defect> }) =>
            DefectsService.updateDefect(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DEFECTS_QUERY_KEY });
        },
    });

    const deleteDefect = useMutation({
        mutationFn: DefectsService.deleteDefect,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DEFECTS_QUERY_KEY });
        },
    });

    return {
        createDefect,
        updateDefect,
        deleteDefect,
    };
}
