import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    RankMultipliersService,
    ResourceCalculationRulesService,
    JutsuCategoriesService,
    JutsuCategoryRanksService,
    JutsuEffectsService,
    ResistanceDifficultiesService
} from '@/lib/api/gameRules';
import type {
    RankMultiplier,
    ResourceCalculationRule,
    JutsuCategory,
    JutsuCategoryRank,
    JutsuEffect,
    ResistanceDifficulty,
    ResourceRuleType,
    JutsuRank
} from '@/types/gameRules';

// Query keys
export const RANK_MULTIPLIERS_QUERY_KEY = ['rank_multipliers'];
export const RESOURCE_RULES_QUERY_KEY = ['resource_calculation_rules'];
export const JUTSU_CATEGORIES_QUERY_KEY = ['jutsu_categories'];
export const JUTSU_CATEGORY_RANKS_QUERY_KEY = ['jutsu_category_ranks'];
export const JUTSU_EFFECTS_QUERY_KEY = ['jutsu_effects'];
export const RESISTANCE_DIFFICULTIES_QUERY_KEY = ['resistance_difficulties'];

// ============================================================
// Rank Multipliers
// ============================================================

export function useRankMultipliers() {
    return useQuery({
        queryKey: RANK_MULTIPLIERS_QUERY_KEY,
        queryFn: RankMultipliersService.getAll,
    });
}

export function useRankMultiplier(rank: JutsuRank) {
    return useQuery({
        queryKey: [...RANK_MULTIPLIERS_QUERY_KEY, rank],
        queryFn: () => RankMultipliersService.getByRank(rank),
        enabled: !!rank,
    });
}

export function useRankMultiplierMutations() {
    const queryClient = useQueryClient();

    const updateRankMultiplier = useMutation({
        mutationFn: ({ rank, multiplier }: { rank: JutsuRank; multiplier: number }) =>
            RankMultipliersService.update(rank, multiplier),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RANK_MULTIPLIERS_QUERY_KEY });
        },
    });

    return { updateRankMultiplier };
}

// ============================================================
// Resource Calculation Rules
// ============================================================

export function useResourceCalculationRules() {
    return useQuery({
        queryKey: RESOURCE_RULES_QUERY_KEY,
        queryFn: ResourceCalculationRulesService.getAll,
    });
}

export function useResourceCalculationRule(ruleType: ResourceRuleType) {
    return useQuery({
        queryKey: [...RESOURCE_RULES_QUERY_KEY, ruleType],
        queryFn: () => ResourceCalculationRulesService.getByType(ruleType),
        enabled: !!ruleType,
    });
}

export function useResourceCalculationRuleMutations() {
    const queryClient = useQueryClient();

    const updateResourceRule = useMutation({
        mutationFn: ({ ruleType, updates }: { ruleType: ResourceRuleType; updates: any }) =>
            ResourceCalculationRulesService.update(ruleType, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESOURCE_RULES_QUERY_KEY });
        },
    });

    return { updateResourceRule };
}

// ============================================================
// Jutsu Categories
// ============================================================

export function useJutsuCategories() {
    return useQuery({
        queryKey: JUTSU_CATEGORIES_QUERY_KEY,
        queryFn: JutsuCategoriesService.getAll,
    });
}

export function useJutsuCategory(id: string) {
    return useQuery({
        queryKey: [...JUTSU_CATEGORIES_QUERY_KEY, id],
        queryFn: () => JutsuCategoriesService.getById(id),
        enabled: !!id,
    });
}

export function useJutsuCategoryMutations() {
    const queryClient = useQueryClient();

    const updateJutsuCategory = useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            JutsuCategoriesService.update(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JUTSU_CATEGORIES_QUERY_KEY });
        },
    });

    return { updateJutsuCategory };
}

// ============================================================
// Jutsu Category Ranks
// ============================================================

export function useJutsuCategoryRanks() {
    return useQuery({
        queryKey: JUTSU_CATEGORY_RANKS_QUERY_KEY,
        queryFn: JutsuCategoryRanksService.getAll,
    });
}

export function useJutsuCategoryRanksByCategory(categoryId: string) {
    return useQuery({
        queryKey: [...JUTSU_CATEGORY_RANKS_QUERY_KEY, 'category', categoryId],
        queryFn: () => JutsuCategoryRanksService.getByCategory(categoryId),
        enabled: !!categoryId,
        retry: 1,
        retryDelay: 1000,
        staleTime: 30000, // Cache por 30 segundos
    });
}

export function useJutsuCategoryRankMutations() {
    const queryClient = useQueryClient();

    const updateJutsuCategoryRank = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            JutsuCategoryRanksService.update(id, updates),
        onSuccess: () => {
            // Invalida todas as queries de category ranks
            queryClient.invalidateQueries({ queryKey: JUTSU_CATEGORY_RANKS_QUERY_KEY });
        },
    });

    return { updateJutsuCategoryRank };
}

// ============================================================
// Jutsu Effects
// ============================================================

export function useJutsuEffects() {
    return useQuery({
        queryKey: JUTSU_EFFECTS_QUERY_KEY,
        queryFn: JutsuEffectsService.getAll,
    });
}

export function useJutsuEffect(id: string) {
    return useQuery({
        queryKey: [...JUTSU_EFFECTS_QUERY_KEY, id],
        queryFn: () => JutsuEffectsService.getById(id),
        enabled: !!id,
    });
}

export function useJutsuEffectMutations() {
    const queryClient = useQueryClient();

    const createJutsuEffect = useMutation({
        mutationFn: (effect: Omit<JutsuEffect, 'id' | 'created_at' | 'updated_at'>) =>
            JutsuEffectsService.create(effect),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JUTSU_EFFECTS_QUERY_KEY });
        },
    });

    const updateJutsuEffect = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            JutsuEffectsService.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JUTSU_EFFECTS_QUERY_KEY });
        },
    });

    const deleteJutsuEffect = useMutation({
        mutationFn: (id: string) => JutsuEffectsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JUTSU_EFFECTS_QUERY_KEY });
        },
    });

    return {
        createJutsuEffect,
        updateJutsuEffect,
        deleteJutsuEffect,
    };
}

// ============================================================
// Resistance Difficulties
// ============================================================

export function useResistanceDifficulties() {
    return useQuery({
        queryKey: RESISTANCE_DIFFICULTIES_QUERY_KEY,
        queryFn: ResistanceDifficultiesService.getAll,
    });
}

export function useResistanceDifficulty(rank: JutsuRank) {
    return useQuery({
        queryKey: [...RESISTANCE_DIFFICULTIES_QUERY_KEY, rank],
        queryFn: () => ResistanceDifficultiesService.getByRank(rank),
        enabled: !!rank,
    });
}

export function useResistanceDifficultyMutations() {
    const queryClient = useQueryClient();

    const updateResistanceDifficulty = useMutation({
        mutationFn: ({ rank, execucao, rmRf }: { rank: JutsuRank; execucao: number; rmRf: number }) =>
            ResistanceDifficultiesService.update(rank, execucao, rmRf),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESISTANCE_DIFFICULTIES_QUERY_KEY });
        },
    });

    return { updateResistanceDifficulty };
}

