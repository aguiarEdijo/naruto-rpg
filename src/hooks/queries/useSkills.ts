import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SkillsService, Skill } from '@/lib/api/skills';

export const SKILLS_QUERY_KEY = ['skills'];

export function useSkills() {
    return useQuery({
        queryKey: SKILLS_QUERY_KEY,
        queryFn: SkillsService.getAllSkills,
    });
}

export function useSkillMutations() {
    const queryClient = useQueryClient();

    const createSkill = useMutation({
        mutationFn: SkillsService.createSkill,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
        },
    });

    const updateSkill = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Skill> }) =>
            SkillsService.updateSkill(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
        },
    });

    const deleteSkill = useMutation({
        mutationFn: SkillsService.deleteSkill,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
        },
    });

    return {
        createSkill,
        updateSkill,
        deleteSkill,
    };
}
