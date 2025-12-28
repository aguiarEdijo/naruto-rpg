// API functions para Supabase - Naruto RPG
import { supabase } from '@/lib/supabase';
import { Character, CustomSkill, Jutsu, Item, Enhancement, Defect } from '@/types/game';

// Interfaces para dados do Supabase
interface SupabaseEnhancementData {
    enhancement_id: string;
    enhancements: {
        id: string;
        name: string;
        description: string;
        effects: string;
        requirements: string;
        clan: string;
        restricted: string;
    }[];
}

interface SupabaseDefectData {
    defect_id: string;
    defects: {
        id: string;
        name: string;
        description: string;
        penalties: string;
        restrictions: string;
        clan: string;
        restricted: string;
        points: number;
    }[];
}

// ===== PERSONAGENS =====

export async function fetchAllCharacters(forGM: boolean = false): Promise<Character[]> {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error('Erro ao obter usuário:', userError);
            return [];
        }

        let query = supabase
            .from('characters')
            .select('*');

        if (!forGM) {
            // Buscar apenas fichas do usuário logado
            query = query.eq('user_id', user.id);
        } else {
            // Para GM, verificar se realmente é GM
            const { data: userData, error: userDataError } = await supabase
                .from('users')
                .select('is_gm')
                .eq('id', user.id)
                .single();

            if (userDataError || !userData || !userData.is_gm) {
                console.error('Usuário não é GM ou erro ao verificar permissões');
                return [];
            }
            // Se for GM, buscar todas as fichas (sem filtro)
        }

        const { data: charactersData, error: charactersError } = await query.order('created_at', { ascending: false });

        if (charactersError) {
            console.error('Erro ao buscar personagens:', charactersError);
            console.error('Detalhes do erro:', JSON.stringify(charactersError, null, 2));
            return [];
        }

        if (!charactersData || charactersData.length === 0) {
            return [];
        }

        // Converter todos os personagens para o formato Character
        const characters: Character[] = await Promise.all(
            charactersData.map(async (characterData) => {
                const [customSkills, jutsus, items, enhancements, defects] = await Promise.all([
                    fetchCustomSkills(characterData.id),
                    fetchJutsus(characterData.id),
                    fetchItems(characterData.id),
                    fetchCharacterEnhancements(characterData.id),
                    fetchCharacterDefects(characterData.id),
                ]);

                return {
                    id: characterData.id,
                    userId: characterData.user_id,
                    name: characterData.name,
                    clan: characterData.clan,
                    age: characterData.age,
                    rank: characterData.rank as Character['rank'],
                    level: characterData.level,
                    availableAttributePoints: characterData.available_attribute_points,
                    availableSkillPoints: characterData.available_skill_points,
                    baseAttributes: characterData.base_attributes,
                    distributedAttributes: characterData.distributed_attributes,
                    attributeBonuses: characterData.attribute_bonuses,
                    resources: characterData.resources,
                    auxiliary: characterData.auxiliary,
                    emotions: characterData.emotions,
                    skills: characterData.skills,
                    skillBonuses: characterData.skill_bonuses,
                    customSkills,
                    jutsus,
                    items,
                    enhancements,
                    defects,
                    isEditable: characterData.is_editable,
                    createdAt: new Date(characterData.created_at),
                    updatedAt: new Date(characterData.updated_at),
                };
            })
        );

        return characters;
    } catch (error) {
        console.error('Erro ao buscar personagens:', error);
        return [];
    }
}

export async function fetchCharacterById(characterId: string): Promise<Character | null> {
    try {
        const { data: characterData, error: characterError } = await supabase
            .from('characters')
            .select('*')
            .eq('id', characterId)
            .single();

        if (characterError) {
            console.error('Erro ao buscar personagem:', characterError);
            return null;
        }

        if (!characterData) return null;

        // Buscar dados relacionados
        const [customSkills, jutsus, items, enhancements, defects] = await Promise.all([
            fetchCustomSkills(characterData.id),
            fetchJutsus(characterData.id),
            fetchItems(characterData.id),
            fetchCharacterEnhancements(characterData.id),
            fetchCharacterDefects(characterData.id),
        ]);

        // Converter para formato Character
        const character: Character = {
            id: characterData.id,
            userId: characterData.user_id,
            name: characterData.name,
            clan: characterData.clan,
            age: characterData.age,
            rank: characterData.rank as Character['rank'],
            level: characterData.level,
            availableAttributePoints: characterData.available_attribute_points,
            availableSkillPoints: characterData.available_skill_points,
            baseAttributes: characterData.base_attributes,
            distributedAttributes: characterData.distributed_attributes,
            attributeBonuses: characterData.attribute_bonuses,
            resources: characterData.resources,
            auxiliary: characterData.auxiliary,
            emotions: characterData.emotions,
            skills: characterData.skills,
            skillBonuses: characterData.skill_bonuses,
            customSkills,
            jutsus,
            items,
            enhancements,
            defects,
            isEditable: characterData.is_editable,
            createdAt: new Date(characterData.created_at),
            updatedAt: new Date(characterData.updated_at),
        };

        return character;
    } catch (error) {
        console.error('Erro ao buscar personagem:', error);
        return null;
    }
}

export async function fetchCharacter(userId?: string): Promise<Character | null> {
    try {
        // Se não fornecido userId, buscar do usuário logado
        if (!userId) {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                console.error('Erro ao obter usuário:', userError);
                return null;
            }
            userId = user.id;
        }
        const { data: characterData, error: characterError } = await supabase
            .from('characters')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (characterError) {
            console.error('Erro ao buscar personagem:', characterError);
            return null;
        }

        if (!characterData) return null;

        // Buscar dados relacionados
        const [customSkills, jutsus, items, enhancements, defects] = await Promise.all([
            fetchCustomSkills(characterData.id),
            fetchJutsus(characterData.id),
            fetchItems(characterData.id),
            fetchCharacterEnhancements(characterData.id),
            fetchCharacterDefects(characterData.id),
        ]);

        // Converter para formato Character
        const character: Character = {
            id: characterData.id,
            userId: characterData.user_id,
            name: characterData.name,
            clan: characterData.clan,
            age: characterData.age,
            rank: characterData.rank as Character['rank'],
            level: characterData.level,
            availableAttributePoints: characterData.available_attribute_points,
            availableSkillPoints: characterData.available_skill_points,
            baseAttributes: characterData.base_attributes,
            distributedAttributes: characterData.distributed_attributes,
            attributeBonuses: characterData.attribute_bonuses,
            resources: characterData.resources,
            auxiliary: characterData.auxiliary,
            emotions: characterData.emotions,
            skills: characterData.skills,
            skillBonuses: characterData.skill_bonuses,
            customSkills,
            jutsus,
            items,
            enhancements,
            defects,
            isEditable: characterData.is_editable,
            createdAt: new Date(characterData.created_at),
            updatedAt: new Date(characterData.updated_at),
        };

        return character;
    } catch (error) {
        console.error('Erro ao buscar personagem:', error);
        return null;
    }
}

export async function saveCharacter(character: Character): Promise<boolean> {
    try {
        const characterData = {
            user_id: character.userId,
            name: character.name,
            clan: character.clan,
            age: character.age,
            rank: character.rank,
            level: character.level,
            available_attribute_points: character.availableAttributePoints,
            available_skill_points: character.availableSkillPoints,
            base_attributes: character.baseAttributes,
            distributed_attributes: character.distributedAttributes,
            attribute_bonuses: character.attributeBonuses,
            resources: character.resources,
            auxiliary: character.auxiliary,
            emotions: character.emotions,
            skills: character.skills,
            skill_bonuses: character.skillBonuses,
            is_editable: character.isEditable,
            updated_at: new Date().toISOString(),
        };

        let result;
        if (character.id) {
            // Atualizar personagem existente
            result = await supabase
                .from('characters')
                .update(characterData)
                .eq('id', character.id);
        } else {
            // Criar novo personagem
            result = await supabase
                .from('characters')
                .insert(characterData)
                .select()
                .single();

            if (result.data) {
                character.id = result.data.id;
            }
        }

        if (result.error) {
            console.error('Erro ao salvar personagem:', result.error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao salvar personagem:', error);
        return false;
    }
}

// ===== PERÍCIAS CUSTOMIZADAS =====

export async function fetchCustomSkills(characterId: string): Promise<CustomSkill[]> {
    try {
        const { data, error } = await supabase
            .from('custom_skills')
            .select('*')
            .eq('character_id', characterId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Erro ao buscar perícias customizadas:', error);
            return [];
        }

        return data.map(skill => ({
            id: skill.id,
            name: skill.name,
            category: skill.category as 'combat' | 'craft',
            attribute1: skill.attribute1 as keyof Character['baseAttributes'],
            attribute2: skill.attribute2 as keyof Character['baseAttributes'],
            distributed: skill.distributed,
            bonus: skill.bonus,
        }));
    } catch (error) {
        console.error('Erro ao buscar perícias customizadas:', error);
        return [];
    }
}

export async function addCustomSkill(characterId: string, skill: Omit<CustomSkill, 'id'>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('custom_skills')
            .insert({
                character_id: characterId,
                name: skill.name,
                category: skill.category,
                attribute1: skill.attribute1,
                attribute2: skill.attribute2,
                distributed: skill.distributed,
                bonus: skill.bonus,
            });

        if (error) {
            console.error('Erro ao adicionar perícia customizada:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao adicionar perícia customizada:', error);
        return false;
    }
}

export async function updateCustomSkill(skillId: string, updates: Partial<CustomSkill>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('custom_skills')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', skillId);

        if (error) {
            console.error('Erro ao atualizar perícia customizada:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao atualizar perícia customizada:', error);
        return false;
    }
}

export async function deleteCustomSkill(skillId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('custom_skills')
            .delete()
            .eq('id', skillId);

        if (error) {
            console.error('Erro ao deletar perícia customizada:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao deletar perícia customizada:', error);
        return false;
    }
}

// ===== JUTSUS =====

export async function fetchJutsus(characterId: string): Promise<Jutsu[]> {
    try {
        const { data, error } = await supabase
            .from('jutsus')
            .select('*')
            .eq('character_id', characterId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Erro ao buscar jutsus:', error);
            return [];
        }

        return data.map(jutsu => ({
            id: jutsu.id,
            name: jutsu.name,
            type: jutsu.type as 'Ninjutsu' | 'Taijutsu' | 'Genjutsu',
            description: jutsu.description,
            rank: jutsu.rank,
            chakraCost: jutsu.chakra_cost,
            damage: jutsu.damage,
            effects: jutsu.effects,
        }));
    } catch (error) {
        console.error('Erro ao buscar jutsus:', error);
        return [];
    }
}

export async function addJutsu(characterId: string, jutsu: Omit<Jutsu, 'id'>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('jutsus')
            .insert({
                character_id: characterId,
                name: jutsu.name,
                type: jutsu.type,
                description: jutsu.description,
                rank: jutsu.rank,
                chakra_cost: jutsu.chakraCost,
                damage: jutsu.damage,
                effects: jutsu.effects,
            });

        if (error) {
            console.error('Erro ao adicionar jutsu:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao adicionar jutsu:', error);
        return false;
    }
}

export async function updateJutsu(jutsuId: string, updates: Partial<Jutsu>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('jutsus')
            .update({
                name: updates.name,
                type: updates.type,
                description: updates.description,
                rank: updates.rank,
                chakra_cost: updates.chakraCost,
                damage: updates.damage,
                effects: updates.effects,
                updated_at: new Date().toISOString(),
            })
            .eq('id', jutsuId);

        if (error) {
            console.error('Erro ao atualizar jutsu:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao atualizar jutsu:', error);
        return false;
    }
}

export async function deleteJutsu(jutsuId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('jutsus')
            .delete()
            .eq('id', jutsuId);

        if (error) {
            console.error('Erro ao deletar jutsu:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao deletar jutsu:', error);
        return false;
    }
}

// ===== ITENS =====

export async function fetchItems(characterId: string): Promise<Item[]> {
    try {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('character_id', characterId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Erro ao buscar itens:', error);
            return [];
        }

        return data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            weight: item.weight,
            effects: item.effects,
            rarity: item.rarity as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
        }));
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        return [];
    }
}

export async function addItem(characterId: string, item: Omit<Item, 'id'>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('items')
            .insert({
                character_id: characterId,
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                weight: item.weight,
                effects: item.effects,
                rarity: item.rarity,
            });

        if (error) {
            console.error('Erro ao adicionar item:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        return false;
    }
}

export async function updateItem(itemId: string, updates: Partial<Item>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('items')
            .update({
                name: updates.name,
                description: updates.description,
                quantity: updates.quantity,
                weight: updates.weight,
                effects: updates.effects,
                rarity: updates.rarity,
                updated_at: new Date().toISOString(),
            })
            .eq('id', itemId);

        if (error) {
            console.error('Erro ao atualizar item:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        return false;
    }
}

export async function deleteItem(itemId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', itemId);

        if (error) {
            console.error('Erro ao deletar item:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao deletar item:', error);
        return false;
    }
}

// ===== APRIMORAMENTOS E DEFEITOS =====

export async function fetchCharacterEnhancements(characterId: string): Promise<Enhancement[]> {
    try {
        const { data, error } = await supabase
            .from('character_enhancements')
            .select(`
            enhancement_id,
            enhancements (
                id,
                name,
                description,
                effects,
                requirements,
                clan,
                restricted
            )
        `)
            .eq('character_id', characterId);

        if (error) {
            console.error('Erro ao buscar aprimoramentos:', error);
            return [];
        }

        return data.map((item: SupabaseEnhancementData) => {
            const enhancement = item.enhancements[0]; // Pegar o primeiro elemento do array
            return {
                id: enhancement.id,
                name: enhancement.name,
                description: enhancement.description,
                effects: enhancement.effects ? enhancement.effects.split(';').filter(e => e.trim()) : [],
                requirements: enhancement.requirements ? JSON.parse(enhancement.requirements) : undefined,
                clan: enhancement.clan || undefined,
                restricted: enhancement.restricted || undefined,
            };
        });
    } catch (error) {
        console.error('Erro ao buscar aprimoramentos:', error);
        return [];
    }
}

export async function fetchCharacterDefects(characterId: string): Promise<Defect[]> {
    try {
        const { data, error } = await supabase
            .from('character_defects')
            .select(`
            defect_id,
            defects (
                id,
                name,
                description,
                penalties,
                restrictions,
                clan,
                restricted,
                points
            )
        `)
            .eq('character_id', characterId);

        if (error) {
            console.error('Erro ao buscar defeitos:', error);
            return [];
        }

        return data.map((item: SupabaseDefectData) => {
            const defect = item.defects[0]; // Pegar o primeiro elemento do array
            return {
                id: defect.id,
                name: defect.name,
                description: defect.description,
                penalties: defect.penalties ? defect.penalties.split(';').filter(p => p.trim()) : [],
                restrictions: defect.restrictions ? JSON.parse(defect.restrictions) : undefined,
                clan: defect.clan || undefined,
                restricted: defect.restricted || undefined,
                points: defect.points || undefined,
            };
        });
    } catch (error) {
        console.error('Erro ao buscar defeitos:', error);
        return [];
    }
}

// ===== FUNÇÕES PARA APRIMORAMENTOS E DEFEITOS =====

export async function addCharacterEnhancement(characterId: string, enhancementId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('character_enhancements')
            .insert({
                character_id: characterId,
                enhancement_id: enhancementId,
            });

        if (error) {
            console.error('Erro ao adicionar aprimoramento ao personagem:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao adicionar aprimoramento ao personagem:', error);
        return false;
    }
}

export async function removeCharacterEnhancement(characterId: string, enhancementId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('character_enhancements')
            .delete()
            .eq('character_id', characterId)
            .eq('enhancement_id', enhancementId);

        if (error) {
            console.error('Erro ao remover aprimoramento do personagem:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao remover aprimoramento do personagem:', error);
        return false;
    }
}

export async function addCharacterDefect(characterId: string, defectId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('character_defects')
            .insert({
                character_id: characterId,
                defect_id: defectId,
            });

        if (error) {
            console.error('Erro ao adicionar defeito ao personagem:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao adicionar defeito ao personagem:', error);
        return false;
    }
}

export async function removeCharacterDefect(characterId: string, defectId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('character_defects')
            .delete()
            .eq('character_id', characterId)
            .eq('defect_id', defectId);

        if (error) {
            console.error('Erro ao remover defeito do personagem:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao remover defeito do personagem:', error);
        return false;
    }
}

// ===== FUNÇÕES AUXILIARES =====

export async function syncCharacterData(character: Character): Promise<boolean> {
    try {
        // Salvar personagem principal
        const characterSaved = await saveCharacter(character);
        if (!characterSaved) return false;

        // Sincronizar perícias customizadas
        for (const skill of character.customSkills) {
            if (skill.id.startsWith('temp_')) {
                // Nova perícia
                await addCustomSkill(character.id, skill);
            } else {
                // Perícia existente - atualizar se necessário
                await updateCustomSkill(skill.id, skill);
            }
        }

        // Sincronizar jutsus
        for (const jutsu of character.jutsus) {
            if (jutsu.id.startsWith('temp_')) {
                // Novo jutsu
                await addJutsu(character.id, jutsu);
            } else {
                // Jutsu existente - atualizar se necessário
                await updateJutsu(jutsu.id, jutsu);
            }
        }

        // Sincronizar itens
        for (const item of character.items) {
            if (item.id.startsWith('temp_')) {
                // Novo item
                await addItem(character.id, item);
            } else {
                // Item existente - atualizar se necessário
                await updateItem(item.id, item);
            }
        }

        // Buscar aprimoramentos e defeitos atuais do personagem
        const [currentEnhancements, currentDefects] = await Promise.all([
            fetchCharacterEnhancements(character.id),
            fetchCharacterDefects(character.id),
        ]);

        // Sincronizar aprimoramentos
        const currentEnhancementIds = new Set(currentEnhancements.map(e => e.id));
        const newEnhancementIds = new Set(character.enhancements.map(e => e.id));

        // Remover aprimoramentos que não estão mais na lista
        for (const enhancement of currentEnhancements) {
            if (!newEnhancementIds.has(enhancement.id)) {
                await removeCharacterEnhancement(character.id, enhancement.id);
            }
        }

        // Adicionar novos aprimoramentos
        for (const enhancement of character.enhancements) {
            if (!currentEnhancementIds.has(enhancement.id)) {
                await addCharacterEnhancement(character.id, enhancement.id);
            }
        }

        // Sincronizar defeitos
        const currentDefectIds = new Set(currentDefects.map(d => d.id));
        const newDefectIds = new Set(character.defects.map(d => d.id));

        // Remover defeitos que não estão mais na lista
        for (const defect of currentDefects) {
            if (!newDefectIds.has(defect.id)) {
                await removeCharacterDefect(character.id, defect.id);
            }
        }

        // Adicionar novos defeitos
        for (const defect of character.defects) {
            if (!currentDefectIds.has(defect.id)) {
                await addCharacterDefect(character.id, defect.id);
            }
        }

        return true;
    } catch (error) {
        console.error('Erro ao sincronizar dados do personagem:', error);
        return false;
    }
}
