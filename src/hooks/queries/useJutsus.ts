import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JutsusService, Jutsu } from '@/lib/api/jutsus';

export const JUTSUS_QUERY_KEY = ['jutsus'];

export function useJutsus() {
    return useQuery({
        queryKey: JUTSUS_QUERY_KEY,
        queryFn: JutsusService.getAllJutsus,
    });
}

export function useJutsuMutations() {
    const queryClient = useQueryClient();

    const createJutsu = useMutation({
        mutationFn: JutsusService.createJutsu,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JUTSUS_QUERY_KEY });
        },
    });

    const updateJutsu = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Jutsu> }) =>
            JutsusService.updateJutsu(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JUTSUS_QUERY_KEY });
        },
    });

    const deleteJutsu = useMutation({
        mutationFn: JutsusService.deleteJutsu,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JUTSUS_QUERY_KEY });
        },
    });

    return {
        createJutsu,
        updateJutsu,
        deleteJutsu,
    };
}
