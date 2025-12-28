import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClansService, Clan } from '@/lib/api/clans';

export const CLANS_QUERY_KEY = ['clans'];

export function useClans() {
    return useQuery({
        queryKey: CLANS_QUERY_KEY,
        queryFn: ClansService.getAllClans,
    });
}

export function useClanMutations() {
    const queryClient = useQueryClient();

    const createClan = useMutation({
        mutationFn: ClansService.createClan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLANS_QUERY_KEY });
        },
    });

    const updateClan = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Clan> }) =>
            ClansService.updateClan(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLANS_QUERY_KEY });
        },
    });

    const deleteClan = useMutation({
        mutationFn: ClansService.deleteClan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLANS_QUERY_KEY });
        },
    });

    return {
        createClan,
        updateClan,
        deleteClan,
    };
}
