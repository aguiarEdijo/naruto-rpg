// Sistema de Aprimoramentos do Jogo

import { Enhancement, Character, Attributes, Skills, Defect } from '@/types/game';

// Aprimoramentos Gerais (incluindo aprimoramentos de clã)
export const GENERAL_ENHANCEMENTS: Enhancement[] = [
    {
        id: 'aceleracao',
        name: 'Aceleração',
        description: 'O usuário move-se em velocidades sobre-humanas, permitindo um movimento extra de 3 metros e dividir seu movimento durante uma ação de mover-se e atacar, permitindo atacar alvos diferentes no mesmo turno. Não pode ser usado com carga acima do normal ou equipamentos pesados.',
        effects: ['Movimento extra de 3 metros', 'Dividir movimento e ataque', 'Atacar múltiplos alvos'],
        requirements: {
            attributes: { agility: 4 }
        }
    },
    {
        id: 'ambidestria',
        name: 'Ambidestria',
        description: 'Habilidade de usar ambas as mãos com igual precisão, sem receber os redutores de 50% nos testes com a mão inábil.',
        effects: ['Sem penalidade na mão inábil', 'Precisão igual em ambas as mãos'],
        requirements: {
            attributes: { agility: 5 }
        }
    },
    {
        id: 'aparar_geral',
        name: 'Aparar Geral',
        description: 'Domínio técnico para defender contra diversos tipos de ataques. Não recebe mais a redução de um dado por usar essa manobra contra categorias diferentes de ataque.',
        effects: ['Defesa contra múltiplos tipos de ataque', 'Sem redução de dados'],
        requirements: {
            skills: { combatTechnique: 5 }
        }
    },
    {
        id: 'concentracao_ferro',
        name: 'Concentração de Ferro',
        description: 'Foco mental absoluto. Testes de Memória, Conjuração e habilidades psíquicas têm melhoria de um dado. O personagem recebe +1 em RM.',
        effects: ['Melhoria de um dado em testes mentais', '+1 em Resistência Mental'],
        requirements: {
            attributes: { intelligence: 4 }
        }
    },
    {
        id: 'aptidao_elemental',
        name: 'Aptidão Elemental',
        description: 'Afinação natural com um dos elementos básicos, concedendo acesso à lista de jutsus elementais do elemento escolhido.',
        effects: ['Acesso a jutsus elementais', 'Elemento básico escolhido'],
        requirements: {
            skills: { nature: 5 },
            level: 5 // Níveis de Patamar
        }
    },
    {
        id: 'elo_objeto_familiar',
        name: 'Elo com Objeto Familiar',
        description: 'Vínculo espiritual com objeto significativo que concede +1 nos testes do personagem que o utilize. Se destruído, o ponto de aprimoramento retorna na próxima lua esplendor e o personagem sofre trauma (perdendo 1 ponto em Emoções).',
        effects: ['+1 em testes com objeto', 'Vínculo espiritual'],
        requirements: {
            attributes: { essence: 4 }
        }
    },
    {
        id: 'chakra_elemental_secundario',
        name: 'Chakra Elemental Secundário',
        description: 'Domínio avançado que concede acesso à lista de jutsus elementais de um segundo elemento escolhido.',
        effects: ['Segundo elemento elemental', 'Acesso a jutsus avançados'],
        requirements: {
            skills: { nature: 8 },
            level: 10 // Níveis de Patamar
        }
    },
    {
        id: 'tolerancia_ferro',
        name: 'Tolerância de Ferro',
        description: 'Constituição física excepcional que concede +1 em RF. O personagem é capaz de suportar mais desgaste, recebendo +1 de Fadiga para cada nível de patamar.',
        effects: ['+1 em Resistência Física', '+1 Fadiga por nível de patamar'],
        requirements: {
            attributes: { vigor: 4 }
        }
    },
    {
        id: 'familia_nobre',
        name: 'Família Nobre',
        description: 'Pertence a família nobre influente. Recebe +100 de ouro inicial, contatos familiares na cidade natal, mas deve cumprir metas designadas. Pode receber auxílio de 1d10 x10 moedas de ouro por mês.',
        effects: ['+100 ouro inicial', 'Contatos familiares', 'Auxílio mensal'],
        requirements: {
            skills: { society: 4 }
        },
        restricted: 'Origem'
    },
    {
        id: 'leve_pluma',
        name: 'Leve como uma Pluma',
        description: 'Concede melhoria de um dado em testes de Furtividade e na manobra de Esquivar. O personagem não afunda em areia, neve ou terreno frágil. Não concede bônus se estiver carregando peso acima do normal.',
        effects: ['Melhoria em Furtividade e Esquivar', 'Não afunda em terrenos frágeis'],
        requirements: {
            attributes: { agility: 5 }
        }
    },
    {
        id: 'prontidao',
        name: 'Prontidão',
        description: 'Estado de alerta constante. Mesmo quando surpreendido, a esquiva natural é 12 em vez de 10. Recebe melhoria de um dado em testes de Percepção e pode refazer teste de Percepção com resultado menor que 7.',
        effects: ['Esquiva 12 quando surpreendido', 'Melhoria em Percepção', 'Refazer testes de Percepção'],
        requirements: {
            attributes: { perception: 4, vigor: 4 }
        }
    },
    {
        id: 'recuperacao_aprimorada',
        name: 'Recuperação Aprimorada',
        description: 'Recupera 50% mais Vida com efeitos de cura e pode dormir com equipamentos de combate sem prejudicar o descanso. Em locais inseguros, recupera 50% em vez de 25% de Vida e Mana totais.',
        effects: ['50% mais cura', 'Dormir com equipamentos', 'Melhor recuperação em locais inseguros'],
        requirements: {
            attributes: { essence: 4, vigor: 4 }
        }
    },
    {
        id: 'vontade_fogo',
        name: 'Vontade do Fogo',
        description: 'Custo: 1 de Fadiga. Duração: todo o combate. Durante o combate, recebe bônus de moral de +1 em Atacar, Bloquear, Aparar e Resistência Física.',
        effects: ['+1 em Atacar, Bloquear, Aparar e RF', 'Custo: 1 Fadiga por combate'],
        requirements: {}
    },
    {
        id: 'aptidao_ninjutsu',
        name: 'Aptidão Ninjutsu',
        description: 'Concede acesso à lista de Ninjutsus de uma vila oculta específica.',
        effects: ['Acesso a Ninjutsus da vila'],
        requirements: {
            skills: { chakraControl: 5 }
        }
    },
    {
        id: 'aptidao_genjutsu',
        name: 'Aptidão Genjutsu',
        description: 'Concede acesso à lista de Genjutsus de uma vila oculta específica.',
        effects: ['Acesso a Genjutsus da vila'],
        requirements: {
            skills: { chakraControl: 5 }
        }
    },
    {
        id: 'aptidao_taijutsu',
        name: 'Aptidão Taijutsu',
        description: 'Concede acesso à lista de Taijutsus de uma vila oculta específica.',
        effects: ['Acesso a Taijutsus da vila'],
        requirements: {
            skills: { chakraControl: 5 }
        }
    },
    // Aprimoramentos de Clã (agora em gerais)
    {
        id: 'clan_hyuuga',
        name: 'Clã Hyuuga',
        description: 'O Byakugan do clã Hyuuga foi despertado através de treinamento intensivo. Concede visão de 360 graus, capacidade de ver através de objetos e detectar pontos de chakra.',
        effects: ['Visão 360 graus', 'Ver através de objetos', 'Detectar pontos de chakra'],
        requirements: {},
        clan: 'hyuga'
    },
    {
        id: 'clan_uchiha',
        name: 'Clã Uchiha',
        description: 'O Sharingan do clã Uchiha foi despertado através de trauma emocional ou treinamento. Concede capacidade de copiar técnicas, prever movimentos e resistir a genjutsus.',
        effects: ['Copiar técnicas', 'Prever movimentos', 'Resistir a genjutsus'],
        requirements: {},
        clan: 'uchiha'
    },
    {
        id: 'clan_akimichi',
        name: 'Clã Akimichi',
        description: 'A habilidade especial do clã Akimichi foi desenvolvida. Permite aumentar drasticamente o tamanho e força física através de técnicas de expansão corporal.',
        effects: ['Expansão corporal', 'Aumento de força', 'Técnicas de tamanho'],
        requirements: {},
        clan: 'akimichi'
    },
    {
        id: 'clan_aburame',
        name: 'Clã Aburame',
        description: 'A simbiose com insetos do clã Aburame foi estabelecida. Permite controlar insetos especiais e usar técnicas únicas de infestação.',
        effects: ['Controle de insetos', 'Técnicas de infestação', 'Simbiose especial'],
        requirements: {},
        clan: 'aburume'
    },
    {
        id: 'clan_nara',
        name: 'Clã Nara',
        description: 'A habilidade de manipulação de sombras do clã Nara foi desenvolvida. Permite controlar sombras e usar técnicas de imobilização.',
        effects: ['Manipulação de sombras', 'Técnicas de imobilização', 'Controle de sombras'],
        requirements: {},
        clan: 'nara'
    },
    {
        id: 'clan_yamanaka',
        name: 'Clã Yamanaka',
        description: 'A habilidade de transferência de mente do clã Yamanaka foi desenvolvida. Permite transferir consciência e usar técnicas de controle mental.',
        effects: ['Transferência de mente', 'Técnicas de controle mental', 'Manipulação de consciência'],
        requirements: {},
        clan: 'yamanaka'
    },
    {
        id: 'clan_inuzuka',
        name: 'Clã Inuzuka',
        description: 'A parceria com cães ninja do clã Inuzuka foi estabelecida. Permite comunicação com animais e técnicas de combate conjunto.',
        effects: ['Comunicação com animais', 'Técnicas de combate conjunto', 'Parceria com cães ninja'],
        requirements: {},
        clan: 'inuzuka'
    },
    {
        id: 'mutacao',
        name: 'Mutação',
        description: 'A mutação única do personagem foi desenvolvida através de experimentos ou origem misteriosa. Concede habilidades especiais únicas e adaptação a situações extremas.',
        effects: ['Habilidades únicas', 'Adaptação extrema', 'Poderes especiais'],
        requirements: {},
        clan: 'mutation'
    },
];

// Função para obter aprimoramentos disponíveis para um clã
export const getClanEnhancements = (clan: string): Enhancement[] => {
    return GENERAL_ENHANCEMENTS.filter(enhancement => enhancement.clan === clan);
};

// Função para calcular aprimoramentos disponíveis baseado em defeitos
export const calculateAvailableEnhancements = (defects: Defect[]): number => {
    // Cada defeito concede +1 aprimoramento
    return defects.length;
};

// Função para verificar se um aprimoramento pode ser comprado
export const canPurchaseEnhancement = (
    enhancement: Enhancement,
    character: Character
): { canPurchase: boolean; reason?: string } => {
    // Verificar pré-requisitos de nível
    if (enhancement.requirements?.level && character.level < enhancement.requirements.level) {
        return { canPurchase: false, reason: `Nível ${enhancement.requirements.level} necessário` };
    }

    // Verificar pré-requisitos de atributos
    if (enhancement.requirements?.attributes) {
        for (const [attr, minValue] of Object.entries(enhancement.requirements.attributes)) {
            const attrKey = attr as keyof Attributes;
            const totalAttr = character.baseAttributes[attrKey] +
                character.distributedAttributes[attrKey] +
                character.attributeBonuses[attrKey];
            if (totalAttr < minValue) {
                return { canPurchase: false, reason: `${attr} ${minValue}+ necessário` };
            }
        }
    }

    // Verificar pré-requisitos de perícias
    if (enhancement.requirements?.skills) {
        for (const [skill, minValue] of Object.entries(enhancement.requirements.skills)) {
            const skillKey = skill as keyof Skills;
            const totalSkills = calculateSkills({
                strength: character.baseAttributes.strength + character.distributedAttributes.strength + character.attributeBonuses.strength,
                agility: character.baseAttributes.agility + character.distributedAttributes.agility + character.attributeBonuses.agility,
                vigor: character.baseAttributes.vigor + character.distributedAttributes.vigor + character.attributeBonuses.vigor,
                intelligence: character.baseAttributes.intelligence + character.distributedAttributes.intelligence + character.attributeBonuses.intelligence,
                essence: character.baseAttributes.essence + character.distributedAttributes.essence + character.attributeBonuses.essence,
                perception: character.baseAttributes.perception + character.distributedAttributes.perception + character.attributeBonuses.perception,
            });
            const totalSkill = totalSkills[skillKey] + character.skills[skillKey] + character.skillBonuses[skillKey];
            if (totalSkill < minValue) {
                return { canPurchase: false, reason: `${skill} ${minValue}+ necessário` };
            }
        }
    }

    return { canPurchase: true };
};

// Função auxiliar para calcular perícias (importada do gameConstants)
const calculateSkills = (attributes: Attributes) => {
    return {
        athletics: attributes.strength + attributes.agility,
        stealth: attributes.agility + attributes.perception,
        nature: attributes.vigor + attributes.perception,
        sealing: attributes.intelligence + attributes.essence,
        society: attributes.intelligence + attributes.perception,
        chakraControl: attributes.essence + attributes.intelligence,
        occultism: attributes.essence + attributes.perception,
        performance: attributes.intelligence + attributes.agility,
        crafts: attributes.strength + attributes.intelligence,
        combatTechnique: attributes.strength + attributes.vigor,
    };
};
