require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente não configuradas!');
    console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados dos itens
const items = [
    // ====================================================================
    // BEBIDAS
    // ====================================================================
    {
        nome: "Sake da Bravura da Folha",
        tipo: "Bebida Alcoólica",
        preco: "200 Ryou",
        descricao: "Uma bebida alcóolica muito forte, que desperta a 'coragem'. Concede uma melhoria em testes contra Medo e faz com que o personagem passe para o Estágio 1 de Embriaguez. Ingerir em excesso pode levar rapidamente aos últimos estágios de embriaguez. Ao falhar no teste de RF, o personagem aumenta 2 níveis de embriaguez.",
        tempo_criacao: "1 mês (fermentação)",
        efeito_colateral: "Ingerir em excesso pode levar rapidamente aos últimos estágios de embriaguez. Ao falhar no teste de RF, o personagem aumenta 2 níveis de embriaguez.",
        sistema_mecanico: "Melhoria em testes contra Medo; Estágio 1 de Embriaguez; Falha no teste de RF aumenta 2 níveis de embriaguez"
    },
    {
        nome: "Cuspe de Dragão",
        tipo: "Bebida Alcoólica",
        preco: "10 Ryou (dose)",
        descricao: "Uma bebida alcóolica muito forte, ideal para disputas em tavernas. Retarda o cansaço e a exaustão por um período de tempo, concedendo Fadiga temporária.",
        tempo_criacao: "3 dias",
        sistema_mecanico: "Aumenta 5 pontos de Fadiga temporária por 2 horas"
    },
    {
        nome: "Néctar do Vale do Fim",
        tipo: "Bebida",
        preco: "250 Ryou",
        descricao: "Acelera a recuperação de feridas profundas e afasta pesadelos. Contudo, deixa o personagem com uma piora em todos os seus testes até que tenha descansado por um período adequado.",
        tempo_criacao: "1 mês",
        sistema_mecanico: "Acelera a recuperação em 25%; Piora em testes até 4 horas de descanso"
    },

    // ====================================================================
    // MEDICAÇÕES DE CURA E ENERGIA
    // ====================================================================
    {
        nome: "Medicação Revigorante Menor",
        tipo: "Medicação (Vida)",
        preco: "100 Ryou",
        descricao: "Recupera uma quantidade menor de Vida, baseada na vitalidade do personagem (Vigor).",
        tempo_criacao: "2 dias",
        efeito_colateral: "Quando ingerida em intervalos curtos (menores que 8 horas), reduz o atributo Força temporariamente em -1.",
        sistema_mecanico: "Recupera 1d6 + Vigor de Vida; Efeito colateral: -1 FOR por 24 horas"
    },
    {
        nome: "Medicação Revigorante",
        tipo: "Medicação (Vida)",
        preco: "300 Ryou",
        descricao: "Recupera uma quantidade significativa de Vida, baseada na vitalidade e energia espiritual do personagem (Vigor e Essência).",
        tempo_criacao: "2 dias",
        efeito_colateral: "Quando ingerida em intervalos curtos (menores que 4 horas), reduz o atributo Força temporariamente em -2.",
        sistema_mecanico: "Recupera 2d6 + Vigor + Essência de Vida; Efeito colateral: -2 FOR por 24 horas"
    },
    {
        nome: "Medicação Energética Menor",
        tipo: "Medicação (Mana/Chakra)",
        preco: "200 Ryou",
        descricao: "Recupera uma pequena quantidade de Mana (Chakra).",
        tempo_criacao: "4 dias",
        efeito_colateral: "Quando ingerida em intervalos curtos (menores que 8 horas), reduz o atributo Inteligência temporariamente em -1.",
        sistema_mecanico: "Recupera 1d6 de Mana; Efeito colateral: -1 INT por 24 horas"
    },
    {
        nome: "Medicação Energética",
        tipo: "Medicação (Mana/Chakra)",
        preco: "400 Ryou",
        descricao: "Recupera uma quantidade moderada de Mana (Chakra).",
        tempo_criacao: "1 hora",
        efeito_colateral: "Quando ingerida em intervalos curtos (menores que 4 horas), reduz o atributo Inteligência temporariamente em -2.",
        sistema_mecanico: "Recupera 2d6 de Mana; Efeito colateral: -2 INT por 24 horas"
    },
    {
        nome: "Medicação: Incansável",
        tipo: "Medicação (Fadiga)",
        preco: "5,000 Ryou",
        descricao: "Restaura os estados de fome, sede e sono, além de recuperar Fadiga ou um nível de exaustão.",
        tempo_criacao: "3 meses",
        efeito_colateral: "Só deve ser ingerida uma vez por semana, caso contrário o personagem sofrerá de grandes dores estomacais.",
        sistema_mecanico: "Restaura fome, sede e sono; Recupera 1d10 de Fadiga ou 1 nível de exaustão"
    },
    {
        nome: "Medicação: Êxtase",
        tipo: "Medicação (Melhoria Permanente)",
        preco: "150.000 Ryou",
        descricao: "Concede um aumento permanente no valor base de um atributo físico ou mental (FOR, AGI, INT, PER ou VIG).",
        tempo_criacao: "1 ano",
        efeito_colateral: "Reduz o atributo Essência permanentemente em -1.",
        sistema_mecanico: "Concede +1 em FOR, AGI, INT, PER ou VIG (base e não cumulativo); Efeito colateral: reduz a ESS em -1"
    },
    {
        nome: "Medicação: A Sombra da Folha",
        tipo: "Medicação (Cura Total)",
        preco: "100.000 Ryou",
        descricao: "Um elixir lendário que recupera completamente toda a Vida, Mana e Fadiga de quem o beber.",
        tempo_criacao: "1 ano",
        efeito_colateral: "Deve ser ingerido apenas uma vez ao ano, caso contrário o personagem cairá desmaiado.",
        sistema_mecanico: "Recupera 100% de Vida, Mana e Fadiga"
    },

    // ====================================================================
    // ANTÍDOTOS E CURAS
    // ====================================================================
    {
        nome: "Antídoto Fraco",
        tipo: "Antídoto",
        preco: "100 Ryou",
        descricao: "Anula os efeitos de venenos comuns e de baixa resistência.",
        tempo_criacao: "1 hora",
        sistema_mecanico: "Anula venenos de RF:5, 4, 3, 5"
    },
    {
        nome: "Antídoto Forte",
        tipo: "Antídoto",
        preco: "300 Ryou",
        descricao: "Anula os efeitos de venenos mais poderosos e de alta resistência.",
        tempo_criacao: "2 horas",
        sistema_mecanico: "Anula venenos de RF:7, 6, 7, 8"
    },
    {
        nome: "Panaceia",
        tipo: "Cura Universal",
        preco: "3,000 Ryou",
        descricao: "Cura todas as doenças e venenos naturais e tem alta chance de curar inclusive venenos e doenças mágicas.",
        tempo_criacao: "3 meses",
        efeito_colateral: "Só deve ser ingerida uma vez ao ano, caso contrário o personagem sofrerá de grandes dores estomacais e vomitará tudo o que ingerir durante as próximas 8 horas.",
        sistema_mecanico: "Cura todas as doenças/venenos naturais; 75% de chance em venenos mágicos/doenças mágicas"
    },

    // ====================================================================
    // POÇÕES E BOMBAS DE COMBATE
    // ====================================================================
    {
        nome: "Poção do Sono",
        tipo: "Poção",
        preco: "200 Ryou",
        descricao: "Uma poção que, se ingerida, induz o alvo ao sono profundo, sendo resistida pela Resistência Mental (RM).",
        tempo_criacao: "2 dias",
        sistema_mecanico: "Induz ao sono (RM:5 +1 a cada dose)"
    },
    {
        nome: "Poção Bomba Sonífera",
        tipo: "Bomba (Sono)",
        preco: "800 Ryou",
        descricao: "Um frasco que, ao ser quebrado, cria uma fumaça que induz ao sono, afetando uma área em raio.",
        tempo_criacao: "1 mês",
        sistema_mecanico: "Induz ao sono (RM:6) em área de 6+1d4 metros de raio"
    },
    {
        nome: "Bomba de Fumaça",
        tipo: "Bomba (Visão)",
        preco: "400 Ryou",
        descricao: "Uma cápsula que libera fumaça negra e viscosa que nubla a visão em uma área de raio. Se inalada, pode causar desmaio por intoxicação.",
        tempo_criacao: "1 mês",
        sistema_mecanico: "Nuvem negra (Teste de PER: 5 para ver); Área de 6+1d4 metros de raio; Falha Maior no teste de RF (4) resulta em Desmaiado/Intoxicado"
    },
    {
        nome: "Selo Explosivo",
        tipo: "Selamento/Bomba",
        preco: "3,000 Ryou",
        descricao: "Um selo que, ao ser ativado por chakra, causa uma grande explosão em área, sendo um item essencial de utilidade ninja.",
        tempo_criacao: "3 dias",
        sistema_mecanico: "Causa 5d6 de dano (AJUSTADO V2); Afeta área de 6+1d6 metros de raio"
    },
    {
        nome: "Elixir da Verdade",
        tipo: "Poção (Social)",
        preco: "100,000 Ryou",
        descricao: "Uma poção rara que, ao ser ingerida, impõe ao alvo o Defeito: Honestidade.",
        tempo_criacao: "4 meses",
        duracao: "1d12 meses",
        sistema_mecanico: "Impõe o Defeito: Honestidade (Duração: 1d12 meses)"
    },
    {
        nome: "Poção da Falsa Morte",
        tipo: "Poção",
        preco: "6,000 Ryou",
        descricao: "Faz com que o personagem entre em um estado de 'Sono dos Mortos' (estado de sono comum para sacerdotes da morte) por um longo período, simulando o óbito. Depois de 20 horas ele irá acordar normalmente.",
        tempo_criacao: "3 meses",
        sistema_mecanico: "Induz o 'Sono dos Mortos' (Duração: 20 horas)"
    },
    {
        nome: "Poção das Guelras",
        tipo: "Poção",
        preco: "500 Ryou",
        descricao: "Concede a capacidade de respirar debaixo d'água por um período, como se tivesse ativado um Sentido Especial (Anfíbio).",
        tempo_criacao: "1 semana",
        duracao: "VIG em horas",
        sistema_mecanico: "Concede respiração aquática (Sentido Especial - Anfíbio)"
    },

    // ====================================================================
    // LOÇÕES E TINTAS ESPECIAIS
    // ====================================================================
    {
        nome: "Loção de Resistência aos Elementos",
        tipo: "Loção",
        preco: "3,000 Ryou",
        descricao: "Concede Resistência Especial a todos os elementos (fogo, terra, água e ar): +50%.",
        tempo_criacao: "1 semana",
        duracao: "Uma hora",
        sistema_mecanico: "Concede Resistência Especial a todos os elementos (+50%)"
    },
    {
        nome: "Loção de Resistência a Queimaduras",
        tipo: "Loção",
        preco: "1,000 Ryou",
        descricao: "Concede Resistência Especial a ataques de fogo (+25%).",
        tempo_criacao: "1 mês",
        duracao: "1d6 horas",
        efeito_colateral: "Pequena chance de contrair a Febre do Pântano.",
        sistema_mecanico: "Resistência Especial a fogo (+25%)"
    },
    {
        nome: "Loção de Resistência a Congelamento",
        tipo: "Loção",
        preco: "1,000 Ryou",
        descricao: "Concede uma melhoria contra efeitos de congelamento.",
        tempo_criacao: "1 mês",
        duracao: "1d6 horas",
        efeito_colateral: "Pequena chance de contrair a Gripe Eterna.",
        sistema_mecanico: "Melhoria contra efeitos de congelamento"
    },
    {
        nome: "Loção de Resistência a Petrificação",
        tipo: "Loção",
        preco: "1,000 Ryou",
        descricao: "Concede uma melhoria contra efeitos de petrificação.",
        tempo_criacao: "1 mês",
        duracao: "5 horas",
        efeito_colateral: "Pequena chance de contrair o Fungo da Podridão.",
        sistema_mecanico: "Melhoria contra efeitos de petrificação"
    },
    {
        nome: "Tinta da Persistência",
        tipo: "Tinta/Inscrição",
        preco: "20,000 Ryou",
        descricao: "Tinta para uso em sigilos, tatuagens místicas ou glifos, que impede que sejam rasurados ou apagados por meios mundanos.",
        tempo_criacao: "1 mês",
        sistema_mecanico: "Impede rasuras por meios mundanos"
    },
    {
        nome: "Tinta do Aprisionamento",
        tipo: "Tinta/Inscrição",
        preco: "25,000 Ryou",
        descricao: "Tinta com propriedade mágica de prender ou impedir o fluxo da energia espiritual. Utilizada para criar pequenas áreas anti-magia ou de aprisionamento.",
        tempo_criacao: "1 mês",
        sistema_mecanico: "Cria pequenas áreas anti-magia"
    },
    {
        nome: "Tinta para Reforço Ninjutsu",
        tipo: "Tinta/Inscrição",
        preco: "10,000 Ryou",
        descricao: "Prepara-se para reforçar magias que necessitam de marcações arcanas, estendendo seus efeitos por mais tempo.",
        tempo_criacao: "1 mês",
        sistema_mecanico: "Reforça magias que necessitam de marcações arcanas, estendendo seus efeitos"
    },
    {
        nome: "Tinta do Elo Místico Proibido",
        tipo: "Tinta/Inscrição (Proibida)",
        preco: "???",
        descricao: "Uma tinta proibida capaz de alterar as propriedades elementais do chakra, trazendo propriedades ocultas aos elementos. Sua eficácia não é certa.",
        tempo_criacao: "1 ano",
        sistema_mecanico: "Altera as propriedades elementais do chakra (ex: Fogo → Chama das Trevas, Água → Solução Ácida)"
    },

    // ====================================================================
    // ITENS CORROSIVOS
    // ====================================================================
    {
        nome: "Cola Alquímica",
        tipo: "Corrosivo/Adesivo",
        preco: "1.200 Ryou",
        descricao: "Cola super forte, capaz de prender objetos firmemente. Requer uma Força excepcional para desfazer a ligação.",
        tempo_criacao: "1 semana",
        sistema_mecanico: "Requer teste de FOR de dificuldade 7 para desfazer a ligação"
    },
    {
        nome: "Saliva de Gryth",
        tipo: "Corrosivo",
        preco: "1.500 Ryou",
        descricao: "Um ácido super corrosivo, criado acidentalmente, capaz de corroer qualquer tipo de material diferente de madeira, vidro ou barro. Causa dano à resistência dos materiais.",
        tempo_criacao: "1 semana",
        sistema_mecanico: "Causa 1d4+1 de dano à resistência dos materiais"
    },

    // ====================================================================
    // KIT INICIAL E FERRAMENTAS NINJA
    // ====================================================================
    {
        nome: "Kit Ninja",
        tipo: "Kit Essencial",
        preco: "100 Ryou",
        descricao: "Um kit de sobrevivência básica, ideal para Genins. Inclui um cantil (1,5l), uma algibeira, uma mochila de couro, um saco de dormir, uma muda de trajes comuns, ração de viagem para 1 dia, uma lamparina, uma tocha e 15m de corda.",
        detalhes: "Contém: Cantil, Algibeira, Mochila, Saco de Dormir, Trajes Comuns, Ração (1 dia), Lamparina, Tocha, Corda (15m)"
    },
    {
        nome: "Ferramentas de Primeiros Socorros",
        tipo: "Ferramenta",
        preco: "2.000 Ryou",
        descricao: "Kit necessário para a perícia Ofícios (Medicina) e para realizar a manobra Prestar Primeiros Socorros."
    },
    {
        nome: "Laboratório de Alquimia",
        tipo: "Ferramenta",
        preco: "20.000 Ryou",
        descricao: "Ferramentas e utensílios necessários para a criação de itens alquímicos complexos."
    },
    {
        nome: "Ferramentas de Escalada",
        tipo: "Ferramenta",
        preco: "1.500 Ryou",
        descricao: "Utensílios para escaladas e movimentos verticais."
    },
    {
        nome: "Ferramentas de Ladino",
        tipo: "Ferramenta",
        preco: "1.000 Ryou",
        descricao: "Ferramentas para arrombamento, desativação de armadilhas e habilidades de infiltração."
    },

    // ====================================================================
    // UTILITÁRIOS DIVERSOS
    // ====================================================================
    {
        nome: "Ração de Viagem (1 pessoa)",
        tipo: "Alimentação",
        preco: "10 Ryou por dia",
        descricao: "Alimento não perecível para sustentar um personagem durante um dia de viagem."
    },
    {
        nome: "Refeição Comum",
        tipo: "Alimentação",
        preco: "5 Ryou",
        descricao: "Uma refeição padrão."
    },
    {
        nome: "Quarto Comunitário",
        tipo: "Serviço",
        preco: "3 Ryou",
        descricao: "Hospedagem básica em taverna ou estalagem."
    },
    {
        nome: "Quarto para 2 pessoas + Refeição",
        tipo: "Serviço",
        preco: "80 Ryou (pernoite)",
        descricao: "Hospedagem com acomodação para duas pessoas incluindo uma refeição."
    },
    {
        nome: "Corda (12m)",
        tipo: "Utilitário",
        preco: "10 Ryou",
        descricao: "Corda de cânhamo padrão para escalada e amarração."
    },
    {
        nome: "Traje Nobre",
        tipo: "Vestimenta",
        preco: "200 Ryou",
        descricao: "Vestimenta de alta qualidade, importante para testes de Sociedade/Influência em círculos sociais de elite."
    },
    {
        nome: "Cão de Guarda/Caçador",
        tipo: "Animal",
        preco: "100 Ryou",
        descricao: "Animal treinado para guarda e caça."
    },
    {
        nome: "Pombo Correio",
        tipo: "Animal",
        preco: "1 Ryou",
        descricao: "Usado para envio de mensagens rápidas a longas distâncias."
    }
];

async function seedItems() {
    console.log('🌱 Iniciando seed de itens...\n');

    try {
        // Verificar se a tabela existe
        const { data: tableExists, error: checkError } = await supabase
            .from('items')
            .select('id')
            .limit(1);

        if (checkError && checkError.code === 'PGRST116') {
            console.error('❌ Tabela "items" não encontrada!');
            console.log('\n📋 Para criar a tabela, execute o arquivo "database/items-table.sql" no SQL Editor do Supabase.\n');
            process.exit(1);
        }

        console.log(`✅ Conectado ao Supabase: ${supabaseUrl}\n`);

        // Inserir itens
        const { data, error } = await supabase
            .from('items')
            .insert(items);

        if (error) {
            console.error('❌ Erro ao inserir itens:', error);
            process.exit(1);
        }

        console.log(`✅ ${items.length} itens inseridos com sucesso!\n`);

        // Verificar inserção
        const { count } = await supabase
            .from('items')
            .select('*', { count: 'exact', head: true });

        console.log(`📊 Total de itens na tabela: ${count}\n`);

        console.log('✅ Seed concluído com sucesso!');

    } catch (error) {
        console.error('❌ Erro durante o seed:', error);
        process.exit(1);
    }
}

seedItems();



