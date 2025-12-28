import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LevelProgressionService, LevelProgression } from '@/lib/api/levelProgression';

export const LEVEL_PROGRESSION_QUERY_KEY = ['level-progression'];

export function useLevelProgression() {
    return useQuery({
        queryKey: LEVEL_PROGRESSION_QUERY_KEY,
        queryFn: LevelProgressionService.getAllLevels,
    });
}

export function useLevelProgressionMutations() {
    const queryClient = useQueryClient();

    const createLevel = useMutation({
        mutationFn: LevelProgressionService.createLevel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LEVEL_PROGRESSION_QUERY_KEY });
        },
    });

    const updateLevel = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<LevelProgression> }) =>
            LevelProgressionService.updateLevel(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LEVEL_PROGRESSION_QUERY_KEY });
        },
    });

    const deleteLevel = useMutation({
        mutationFn: LevelProgressionService.deleteLevel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LEVEL_PROGRESSION_QUERY_KEY });
        },
    });

    return {
        createLevel,
        updateLevel,
        deleteLevel,
    };
}
