// API functions para Supabase - Naruto RPG
import { supabase } from '@/lib/supabase';
import { Character, CustomSkill, Jutsu, Item, Enhancement, Defect } from '@/types/game';

// Interfaces para dados do Supabase (mantidas para referência futura, mas não usadas atualmente)

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
        if (character.id && character.id.trim() !== '') {
            // Atualizar personagem existente
            console.log('📝 Atualizando personagem existente:', character.id);
            result = await supabase
                .from('characters')
                .update(characterData)
                .eq('id', character.id)
                .select()
                .single();
        } else {
            // Criar novo personagem
            console.log('✨ Criando novo personagem...');
            result = await supabase
                .from('characters')
                .insert(characterData)
                .select()
                .single();

            if (result.data && result.data.id) {
                character.id = result.data.id;
                console.log('✅ Novo personagem criado com ID:', character.id);
            } else {
                console.error('❌ Personagem criado mas não retornou ID:', result);
            }
        }

        if (result.error) {
            console.error('❌ Erro ao salvar personagem:', result.error);
            return false;
        }

        if (!character.id) {
            console.error('❌ Personagem salvo mas não possui ID');
            return false;
        }

        return true;
    } catch (error) {
        console.error('❌ Erro ao salvar personagem:', error);
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
        if (!characterId) {
            console.warn('⚠️ fetchCharacterEnhancements chamado sem characterId');
            return [];
        }

        const { data, error } = await supabase
            .from('character_enhancements')
            .select(`
            enhancement_id,
            enhancements (
                id,
                nome,
                descricao,
                tipo,
                clan_restricao,
                rank_restricao,
                requisitos,
                custo,
                acoes,
                duracao
            )
        `)
            .eq('character_id', characterId);

        if (error) {
            console.error('❌ Erro ao buscar aprimoramentos:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        const enhancements: Enhancement[] = [];
        for (const item of data) {
            const enhancement = Array.isArray(item.enhancements) ? item.enhancements[0] : item.enhancements;
            if (enhancement) {
                enhancements.push({
                    id: String(enhancement.id),
                    name: enhancement.nome || '',
                    description: enhancement.descricao || '',
                    clan: enhancement.clan_restricao || undefined,
                    effects: [],
                    requirements: enhancement.requisitos || {}
                });
            }
        }
        return enhancements;
    } catch (error) {
        console.error('❌ Erro ao buscar aprimoramentos:', error);
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
                nome,
                descricao,
                tipo
            )
        `)
            .eq('character_id', characterId);

        if (error) {
            console.error('❌ Erro ao buscar defeitos:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        const defects: Defect[] = [];
        for (const item of data) {
            const defect = Array.isArray(item.defects) ? item.defects[0] : item.defects;
            if (defect) {
                defects.push({
                    id: String(defect.id),
                    name: defect.nome || '',
                    description: defect.descricao || '',
                    penalties: [],
                });
            }
        }
        return defects;
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
        if (!characterSaved) {
            console.error('❌ Falha ao salvar personagem principal');
            return false;
        }

        // Verificar se o character tem ID após salvar
        if (!character.id) {
            console.error('❌ Personagem não possui ID após salvar');
            return false;
        }

        console.log('✅ Personagem salvo com ID:', character.id);

        // Sincronizar perícias customizadas
        if (character.customSkills && character.customSkills.length > 0) {
            for (const skill of character.customSkills) {
                try {
                    if (skill.id.startsWith('temp_')) {
                        // Nova perícia
                        await addCustomSkill(character.id, skill);
                    } else {
                        // Perícia existente - atualizar se necessário
                        await updateCustomSkill(skill.id, skill);
                    }
                } catch (error) {
                    console.error('Erro ao sincronizar perícia customizada:', error);
                }
            }
        }

        // Sincronizar jutsus
        if (character.jutsus && character.jutsus.length > 0) {
            for (const jutsu of character.jutsus) {
                try {
                    if (jutsu.id.startsWith('temp_')) {
                        // Novo jutsu
                        await addJutsu(character.id, jutsu);
                    } else {
                        // Jutsu existente - atualizar se necessário
                        await updateJutsu(jutsu.id, jutsu);
                    }
                } catch (error) {
                    console.error('Erro ao sincronizar jutsu:', error);
                }
            }
        }

        // Sincronizar itens
        if (character.items && character.items.length > 0) {
            for (const item of character.items) {
                try {
                    if (item.id.startsWith('temp_')) {
                        // Novo item
                        await addItem(character.id, item);
                    } else {
                        // Item existente - atualizar se necessário
                        await updateItem(item.id, item);
                    }
                } catch (error) {
                    console.error('Erro ao sincronizar item:', error);
                }
            }
        }

        // Buscar aprimoramentos e defeitos atuais do personagem
        const [currentEnhancements, currentDefects] = await Promise.all([
            fetchCharacterEnhancements(character.id),
            fetchCharacterDefects(character.id),
        ]);

        // Sincronizar aprimoramentos
        if (character.enhancements && character.enhancements.length >= 0) {
            const currentEnhancementIds = new Set(currentEnhancements.map(e => String(e.id)));
            const newEnhancementIds = new Set(character.enhancements.map(e => String(e.id)));

            // Remover aprimoramentos que não estão mais na lista
            for (const enhancement of currentEnhancements) {
                const enhancementId = String(enhancement.id);
                if (!newEnhancementIds.has(enhancementId)) {
                    try {
                        await removeCharacterEnhancement(character.id, enhancementId);
                    } catch (error) {
                        console.error('Erro ao remover aprimoramento:', error);
                    }
                }
            }

            // Adicionar novos aprimoramentos
            for (const enhancement of character.enhancements) {
                const enhancementId = String(enhancement.id);
                if (!currentEnhancementIds.has(enhancementId)) {
                    try {
                        const success = await addCharacterEnhancement(character.id, enhancementId);
                        if (!success) {
                            console.error('❌ Falha ao adicionar aprimoramento:', enhancementId, enhancement);
                        }
                    } catch (error) {
                        console.error('Erro ao adicionar aprimoramento:', error, enhancement);
                    }
                }
            }
        }

        // Sincronizar defeitos
        if (character.defects && character.defects.length >= 0) {
            const currentDefectIds = new Set(currentDefects.map(d => String(d.id)));
            const newDefectIds = new Set(character.defects.map(d => String(d.id)));

            // Remover defeitos que não estão mais na lista
            for (const defect of currentDefects) {
                const defectId = String(defect.id);
                if (!newDefectIds.has(defectId)) {
                    try {
                        await removeCharacterDefect(character.id, defectId);
                    } catch (error) {
                        console.error('Erro ao remover defeito:', error);
                    }
                }
            }

            // Adicionar novos defeitos
            for (const defect of character.defects) {
                const defectId = String(defect.id);
                if (!currentDefectIds.has(defectId)) {
                    try {
                        const success = await addCharacterDefect(character.id, defectId);
                        if (!success) {
                            console.error('❌ Falha ao adicionar defeito:', defectId, defect);
                        }
                    } catch (error) {
                        console.error('Erro ao adicionar defeito:', error, defect);
                    }
                }
            }
        }

        console.log('✅ Sincronização completa');
        return true;
    } catch (error) {
        console.error('❌ Erro ao sincronizar dados do personagem:', error);
        return false;
    }
}
