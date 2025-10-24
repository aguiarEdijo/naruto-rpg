// Sistema de Defeitos do Jogo

import { Defect, Character, Attributes, Skills } from '@/types/game';

// Re-exportar tipos necessários
export type { Defect, Character, Attributes, Skills };

// Defeitos Gerais
export const GENERAL_DEFECTS: Defect[] = [
    {
        id: 'alergia',
        name: 'Alergia',
        description: 'O personagem tem alergia a alguma substância específica. Quando exposto ao alérgeno, fica com a condição Enjoado e perde 10 de Vida +1d6 de Vida por rodada até ser tratado. Pode afetar as Emoções do personagem em algumas situações.',
        penalties: ['Condição: Enjoado', 'Perda de Vida: 10 +1d6/rodada', 'Pode afetar Emoções'],
        points: 1
    },
    {
        id: 'almas_gemeas',
        name: 'Almas Gêmeas',
        description: 'O personagem nasceu com sua alma vinculada a outro ser, compartilhando um único destino. Se um dos dois morrer, o outro também morre instantaneamente.',
        penalties: ['Morte compartilhada'],
        points: 2
    },
    {
        id: 'amor_condicionado',
        name: 'Amor Condicionado',
        description: 'O personagem está permanentemente na condição Apaixonado. Se a fonte de seu amor morrer definitivamente, recebe o Defeito: Depressivo e não pode mais ganhar experiência ou evoluir níveis.',
        penalties: ['Condição permanente: Apaixonado', 'Ganha Depressivo se amado morrer', 'Impede evolução se amado morrer'],
        points: 2
    },
    {
        id: 'assombrado',
        name: 'Assombrado',
        description: 'O personagem pode ser assombrado por vozes ou visões. Quando possível ser assombrado, rola 1d100 com 50% de chance de ter Emoções afetadas e receber condição Amedrontado.',
        penalties: ['Teste 1d100 quando assombrado', '50% chance: Emoções afetadas + Amedrontado'],
        points: 1
    },
    {
        id: 'azar',
        name: 'Azar',
        description: 'O personagem tem grande azar em situações variadas. O mestre determina quando o azar ocorre, aplicando -1 em testes ou -10% em eventos. Pode afetar Emoções se o personagem tiver consciência do defeito.',
        penalties: ['-1 em testes ou -10% em eventos', 'Pode afetar Emoções'],
        points: 1
    },
    {
        id: 'cegueira',
        name: 'Cegueira',
        description: 'O personagem é cego. Sofre redutor de -6 nos testes de combate e -1 na Percepção.',
        penalties: ['-6 em testes de combate', '-1 em Percepção'],
        points: 3
    },
    {
        id: 'compulsivo',
        name: 'Compulsivo',
        description: 'O personagem não consegue passar mais de meia hora sem executar uma ação compulsiva específica. Deve gastar 1 Ação por turno para executá-la, mesmo em combate. Se privado, tem Emoções afetadas.',
        penalties: ['Compulsão a cada 30min', 'Gasta 1 Ação por turno', 'Emoções afetadas se privado'],
        points: 1
    },
    {
        id: 'corrompido',
        name: 'Corrompido',
        description: 'O personagem perde a capacidade de desejar e age apenas de acordo com Emoções profanadas. Torna-se um NPC controlado pelo mestre.',
        penalties: ['Perde controle do personagem', 'Torna-se NPC'],
        points: 5
    },
    {
        id: 'cleptomania',
        name: 'Cleptomania',
        description: 'O personagem tem impulso de roubar objetos brilhantes ou atraentes. Pode resistir com teste de RM (10 +1 por cada resistência anterior). Ao falhar, volta ao valor padrão. Pode afetar Emoções.',
        penalties: ['Impulso de roubar', 'Teste RM: 10 +1/resistência', 'Pode afetar Emoções'],
        points: 1
    },
    {
        id: 'dependencia',
        name: 'Dependência',
        description: 'O personagem depende de algo específico para sobreviver. Deve suprir a dependência diariamente ou sofre afetação de Emoções, níveis de exaustão, perda permanente de atributos e outros efeitos.',
        penalties: ['Dependência diária', 'Emoções afetadas se não suprida', 'Exaustão/perda de atributos'],
        points: 2
    },
    {
        id: 'depressivo',
        name: 'Depressivo',
        description: 'O personagem não tem grande amor pela própria vida. Quando tem Emoções afetadas, sempre conta como resultado 12, perdendo 1 ponto em Emoções.',
        penalties: ['Emoções afetadas = resultado 12', 'Perde 1 ponto em Emoções quando afetado'],
        points: 2
    },
    {
        id: 'difamado',
        name: 'Difamado',
        description: 'O personagem tem má fama em um reino e reinos vizinhos. Pode ser procurado por autoridades. Personagem e aliados têm dificuldades em situações sociais e eventos locais. Pode afetar Emoções do grupo.',
        penalties: ['Dificuldades sociais', 'Pode ser procurado', 'Afeta grupo inteiro'],
        points: 2
    },
    {
        id: 'disopia',
        name: 'Disopia',
        description: 'O personagem tem falhas na visão. Sofre redução de um dado em testes de Percepção e testes que necessitem noção de profundidade.',
        penalties: ['-1 dado em Percepção', '-1 dado em testes de profundidade'],
        points: 1
    },
    {
        id: 'disosmia',
        name: 'Disosmia',
        description: 'O personagem não tem sentido do olfato. É incapaz de perceber cheiros e sofre automaticamente efeitos de gases tóxicos. Tem redução de um dado em testes de Percepção.',
        penalties: ['Sem olfato', 'Vulnerável a gases', '-1 dado em Percepção'],
        points: 1
    },
    {
        id: 'emocoes_incompletas',
        name: 'Emoções Incompletas',
        description: 'O personagem perdeu ou não é capaz de receber todas as Emoções, sempre sentindo que não pertence a este mundo ou tempo.',
        penalties: ['Capacidade emocional reduzida'],
        points: 3
    },
    {
        id: 'esquizofrenia',
        name: 'Esquizofrenia',
        description: 'O personagem vê coisas além do mundo real. Pode atacar inimigos inexistentes, perdendo o turno. Quando possível ter crise, rola 1d100 com 50% de chance de ter Emoções afetadas e receber condição Alucinação.',
        penalties: ['Pode atacar ilusões', 'Teste 1d100 para crises', '50% chance: Emoções afetadas + Alucinação'],
        points: 2
    },
    {
        id: 'fobia',
        name: 'Fobia',
        description: 'O personagem tem medo incompreensível de algo específico. Fica com condição Amedrontado e tende a se afastar do objeto de seu medo.',
        penalties: ['Condição: Amedrontado por fobia', 'Fuga do objeto do medo'],
        points: 1
    },
    {
        id: 'furia',
        name: 'Fúria',
        description: 'Quando na condição Enfurecido, o efeito dura o dobro do tempo e afeta as Emoções do personagem.',
        penalties: ['Enfurecido dura 2x tempo', 'Afeta Emoções quando enfurecido'],
        points: 1
    },
    {
        id: 'habitos_detestaveis',
        name: 'Hábitos Detestáveis',
        description: 'O personagem não sabe se comportar educadamente nem tem bons hábitos de higiene. Recebe -1d4 em testes contra doenças e redutores percentuais em situações sociais.',
        penalties: ['-1d4 vs doenças', 'Redutores em situações sociais'],
        points: 1
    },
    {
        id: 'heroismo',
        name: 'Heroísmo',
        description: 'O personagem deve sempre cumprir sua palavra, proteger os mais fracos e jamais recusar pedidos de ajuda. Deve zelar para que companheiros também sigam esses princípios.',
        penalties: ['Código de conduta obrigatório', 'Deve impor código aos companheiros'],
        points: 1
    },
    {
        id: 'honestidade',
        name: 'Honestidade',
        description: 'O personagem nunca pode roubar, trapacear, mentir, atacar pelas costas ou desobedecer leis locais. Não pode permitir que companheiros façam essas ações.',
        penalties: ['Código de conduta restritivo', 'Deve impedir ações ilegais dos companheiros'],
        points: 1
    },
    {
        id: 'medroso',
        name: 'Medroso',
        description: 'Sempre que ficar na condição Amedrontado, esta condição dura o dobro do tempo e afeta as Emoções do personagem.',
        penalties: ['Amedrontado dura 2x tempo', 'Afeta Emoções quando amedrontado'],
        points: 1
    },
    {
        id: 'missao_shinobi',
        name: 'Missão Shinobi',
        description: 'O personagem tem uma grande missão para com sua vila. Qualquer evento que o desvie desta missão afeta suas Emoções.',
        penalties: ['Compromisso com missão', 'Emoções afetadas ao desviar'],
        points: 1
    },
    {
        id: 'pacto_servidao',
        name: 'Pacto de Servidão',
        description: 'O personagem tem um pacto atrelado à sua alma (selo amaldiçoado, fuinjutsu de clã, pacto espiritual). Qualquer evento que o desvie do pacto afeta suas Emoções.',
        penalties: ['Pacto espiritual obrigatório', 'Emoções afetadas ao desviar'],
        points: 1
    },
    {
        id: 'odio_racial',
        name: 'Ódio/Intolerância Racial',
        description: 'O personagem tem ódio intenso por uma raça específica. Ao ver indivíduos dessa raça, tem Emoções afetadas e busca prejudicá-los ao máximo, podendo chegar ao assassinato.',
        penalties: ['Emoções afetadas por raça específica', 'Comportamento agressivo/prejudicial'],
        points: 2
    },
    {
        id: 'orgulho_exacerbado',
        name: 'Orgulho Exacerbado',
        description: 'O personagem tem ego inflado e não se rebaixa para ninguém. Tem Emoções afetadas quando se sente rebaixado ou humilhado.',
        penalties: ['Emoções afetadas por humilhação'],
        points: 1
    },
    {
        id: 'paranoia',
        name: 'Paranoia',
        description: 'O personagem é extremamente desconfiado, faz poucas amizades e está sempre alerta. Recebe +1 em Percepção mas tem -1d4 em testes de RM e RF.',
        penalties: ['+1 em Percepção', '-1d4 em RM e RF'],
        points: 1
    },
    {
        id: 'restricao_ninjutsu',
        name: 'Restrição à Ninjutsu',
        description: 'O personagem é incapaz de executar ninjutsus e perde todos os pontos de Focus.',
        penalties: ['Incapaz de usar ninjutsu', 'Perde todos os pontos de Focus'],
        points: 3
    },
    {
        id: 'restricao_genjutsu',
        name: 'Restrição à Genjutsu',
        description: 'O personagem é incapaz de executar genjutsus e perde todos os pontos de Focus.',
        penalties: ['Incapaz de usar genjutsu', 'Perde todos os pontos de Focus'],
        points: 3
    },
    {
        id: 'surdez',
        name: 'Surdez',
        description: 'O personagem não tem audição. Sofre redutores de -1d4 em testes que necessitem equilíbrio e -1 na Percepção.',
        penalties: ['Sem audição', '-1d4 em testes de equilíbrio', '-1 em Percepção'],
        points: 2
    },
    {
        id: 'vicio',
        name: 'Vício',
        description: 'O personagem é viciado em algo específico. Pode resistir aos impulsos com teste de RM (12 +1 por cada resistência anterior). Ao falhar, volta ao valor padrão. Pode afetar Emoções.',
        penalties: ['Dependência química/comportamental', 'Teste RM: 12 +1/resistência', 'Pode afetar Emoções'],
        points: 1
    },
    {
        id: 'vulnerabilidade',
        name: 'Vulnerabilidade',
        description: 'O personagem é mais fraco contra certo tipo de dano. Quando recebe dano desse tipo, o dano final (após proteções) é multiplicado por 2. Pode afetar Emoções.',
        penalties: ['Dano específico x2 (após proteções)', 'Pode afetar Emoções'],
        points: 1
    }
];

// Função para obter defeitos por categoria
export const getDefectsByCategory = (category: string): Defect[] => {
    const categoryMap: { [key: string]: string[] } = {
        'Físico': ['alergia', 'cegueira', 'dependencia', 'disopia', 'disosmia', 'habitos_detestaveis', 'restricao_ninjutsu', 'restricao_genjutsu', 'surdez', 'vicio', 'vulnerabilidade'],
        'Mental': ['assombrado', 'compulsivo', 'cleptomania', 'esquizofrenia', 'paranoia'],
        'Emocional': ['amor_condicionado', 'depressivo', 'fobia', 'furia', 'medroso', 'orgulho_exacerbado'],
        'Espiritual': ['almas_gemeas', 'corrompido', 'pacto_servidao'],
        'Social': ['difamado', 'odio_racial'],
        'Moral': ['heroismo', 'honestidade'],
        'Profissional': ['missao_shinobi'],
        'Sobrenatural': ['azar', 'emocoes_incompletas']
    };

    const defectIds = categoryMap[category] || [];
    return GENERAL_DEFECTS.filter(defect => defectIds.includes(defect.id));
};

// Função para verificar se um defeito pode ser aplicado
export const canApplyDefect = (
    defect: Defect,
    character: Character
): { canApply: boolean; reason?: string } => {
    // Verificar se o personagem já tem o defeito
    if (character.defects?.some(d => d.id === defect.id)) {
        return { canApply: false, reason: 'Personagem já possui este defeito' };
    }

    // Verificar limite máximo de 2 defeitos
    if (character.defects && character.defects.length >= 2) {
        return { canApply: false, reason: 'Personagem já possui o máximo de 2 defeitos' };
    }

    // Verificar pré-requisitos de nível
    if (defect.restrictions?.level && character.level < defect.restrictions.level) {
        return { canApply: false, reason: `Nível ${defect.restrictions.level} necessário` };
    }

    // Verificar pré-requisitos de atributos
    if (defect.restrictions?.attributes) {
        for (const [attr, minValue] of Object.entries(defect.restrictions.attributes)) {
            const attrKey = attr as keyof Attributes;
            const totalAttr = character.baseAttributes[attrKey] +
                character.distributedAttributes[attrKey] +
                character.attributeBonuses[attrKey];
            if (totalAttr < minValue) {
                return { canApply: false, reason: `${attr} ${minValue}+ necessário` };
            }
        }
    }

    // Verificar pré-requisitos de perícias
    if (defect.restrictions?.skills) {
        for (const [skill, minValue] of Object.entries(defect.restrictions.skills)) {
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
                return { canApply: false, reason: `${skill} ${minValue}+ necessário` };
            }
        }
    }

    return { canApply: true };
};

// Função para calcular pontos totais de defeitos
export const calculateDefectPoints = (defects: Defect[]): number => {
    return defects.reduce((total, defect) => total + (defect.points || 0), 0);
};

// Função para calcular aprimoramentos disponíveis baseado em defeitos
export const calculateAvailableEnhancements = (defects: Defect[]): number => {
    // Cada defeito concede +1 aprimoramento
    return defects.length;
};

// Função para aplicar efeitos de defeitos nas Emoções
export const applyDefectEmotionEffects = (character: Character): number => {
    let emotionReduction = 0;

    if (character.defects) {
        character.defects.forEach(defect => {
            // Aplicar reduções específicas de emoções baseadas no defeito
            switch (defect.id) {
                case 'cegueira':
                case 'surdez':
                case 'habitos_detestaveis':
                case 'medroso':
                case 'furia':
                case 'orgulho_exacerbado':
                case 'paranoia':
                case 'restricao_ninjutsu':
                case 'restricao_genjutsu':
                    emotionReduction += 1;
                    break;
                case 'emocoes_incompletas':
                    emotionReduction += 3;
                    break;
                default:
                    // Outros defeitos não reduzem emoções diretamente
                    break;
            }
        });
    }

    return Math.max(0, 8 - emotionReduction); // Começa com 8, reduzido por defeitos
};

// Função auxiliar para calcular perícias (reutilizada do enhancements.ts)
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
