// Traduções para português do sistema Naruto RPG

export const translations = {
    // Atributos
    attributes: {
        strength: 'Força',
        agility: 'Agilidade',
        vigor: 'Vigor',
        intelligence: 'Inteligência',
        essence: 'Essência',
        perception: 'Percepção',
    },

    // Perícias
    skills: {
        athletics: 'Atléticas',
        stealth: 'Furtividade',
        nature: 'Natureza',
        sealing: 'Selamentos',
        society: 'Sociedade',
        chakraControl: 'Controle de Chakra',
        occultism: 'Ocultismo',
        performance: 'Performance',
    },

    // Recursos
    resources: {
        health: 'Vida',
        chakra: 'Chakra',
        fatigue: 'Fadiga',
        stress: 'Stress',
    },

    // Recursos auxiliares
    auxiliary: {
        mentalResistance: 'Resistência Mental',
        physicalResistance: 'Resistência Física',
    },

    // Patentes
    ranks: {
        Genin: 'Genin',
        Chunnin: 'Chunnin',
        Jounin: 'Jounin',
        Hokage: 'Hokage',
    },

    // Tipos de jutsu
    jutsuTypes: {
        Ninjutsu: 'Ninjutsu',
        Taijutsu: 'Taijutsu',
        Genjutsu: 'Genjutsu',
    },

    // Categorias de perícias customizadas
    skillCategories: {
        combat: 'Técnica de Combate',
        craft: 'Ofício',
    },

    // Raridades de itens
    itemRarities: {
        common: 'Comum',
        uncommon: 'Incomum',
        rare: 'Raro',
        epic: 'Épico',
        legendary: 'Lendário',
    },

    // Labels gerais
    labels: {
        base: 'Base',
        distributed: 'Dist.',
        bonus: 'Bônus',
        total: 'Total',
        level: 'Nível',
        rank: 'Patente',
        name: 'Nome',
        description: 'Descrição',
        effects: 'Efeitos',
        chakraCost: 'Custo de Chakra',
        damage: 'Dano',
        quantity: 'Quantidade',
        weight: 'Peso',
        rarity: 'Raridade',
        category: 'Categoria',
        attribute1: 'Atributo 1',
        attribute2: 'Atributo 2',
        addCustomSkill: 'Adicionar Perícia Customizada',
        addJutsu: 'Adicionar Jutsu',
        addItem: 'Adicionar Item',
        edit: 'Editar',
        delete: 'Excluir',
        save: 'Salvar',
        cancel: 'Cancelar',
        close: 'Fechar',
    },

    // Mensagens
    messages: {
        loading: 'Carregando...',
        saving: 'Salvando...',
        characterNotFound: 'Personagem não encontrado',
        errorSaving: 'Erro ao salvar personagem',
        errorLoading: 'Erro ao carregar personagem',
        confirmDelete: 'Tem certeza que deseja excluir este item?',
        noJutsus: 'Nenhum jutsu conhecido',
        noItems: 'Nenhum item possuído',
        noCustomSkills: 'Nenhuma perícia customizada',
    },
};

// Função helper para traduzir chaves
export function t(key: string): string {
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
        value = (value as Record<string, unknown>)[k];
        if (value === undefined) {
            return key; // Retorna a chave original se não encontrar tradução
        }
    }

    return value as string;
}

// Função helper para traduzir atributos
export function translateAttribute(attribute: string): string {
    return translations.attributes[attribute as keyof typeof translations.attributes] || attribute;
}

// Função helper para traduzir perícias
export function translateSkill(skill: string): string {
    return translations.skills[skill as keyof typeof translations.skills] || skill;
}

// Função helper para traduzir recursos
export function translateResource(resource: string): string {
    return translations.resources[resource as keyof typeof translations.resources] || resource;
}
