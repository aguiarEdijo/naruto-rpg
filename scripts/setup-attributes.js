const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Carregar variáveis de ambiente do .env

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Debug das variáveis de ambiente:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Presente' : 'Ausente');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Presente' : 'Ausente');

if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL não encontrada nas variáveis de ambiente');
    process.exit(1);
}

if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada nas variáveis de ambiente');
    console.log('💡 Verifique se o arquivo .env contém a variável SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateAttributes() {
    console.log('🚀 Iniciando migração da tabela attributes...');

    try {
        // Dados dos atributos
        const attributesData = [
            {
                nome: 'FORÇA',
                abreviacao: 'FOR',
                categoria: 'Físico',
                descricao: 'Representa a capacidade de levantamento, músculos e poder destrutivo físico. Utilizada em ataques corpo a corpo e testes para superar obstáculos físicos (como esmagar algo ou levantar peso). Também é um fator crucial para determinar o dano base de armas corporais. A Força pode ser reduzida pela idade avançada e é um desafio para membros do Clã Aburame.'
            },
            {
                nome: 'VIGOR',
                abreviacao: 'VIG',
                categoria: 'Físico',
                descricao: 'Mede a saúde, resistência à dor, ao cansaço e a vitalidade. É a base para a Resistência Física (RF), sendo essencial para suportar venenos, medicações e condições extremas como sufocamento. É um fator na recuperação de Vida e vitalidade. É um atributo forte nos Clãs Akimichi e Senju.'
            },
            {
                nome: 'AGILIDADE',
                abreviacao: 'AGI',
                categoria: 'Físico',
                descricao: 'Governa a destreza manual, a velocidade, o equilíbrio e a coordenação motora. É fundamental para manobras defensivas como Esquivar, para se mover furtivamente, e para a movimentação em geral. É um atributo de foco para clãs que dependem de movimentos rápidos e precisos, como Uchiha e Hyuga.'
            },
            {
                nome: 'INTELIGÊNCIA',
                abreviacao: 'INT',
                categoria: 'Mental/Chakra',
                descricao: 'Reflete o raciocínio lógico, a memória e a capacidade estratégica. É crucial para o planejamento tático, para o uso de técnicas de Ninjutsu e Genjutsu, e para resistir a manobras de distração. É a base para o controle de alcance de algumas habilidades sensoriais e telepáticas. É um foco central para clãs como Nara, Yamanaka, Uchiha e Aburame.'
            },
            {
                nome: 'PERCEPÇÃO',
                abreviacao: 'PER',
                categoria: 'Mental/Chakra',
                descricao: 'Mede os sentidos aguçados e a consciência situacional, permitindo notar detalhes e reagir a perigos. É vital para o rastreamento (como o Faro Superior Inuzuka) e para a detecção de inimigos furtivos (incluindo os insetos Kikaichuu). É usada para determinar o alcance da Detecção de Chakra (Byakugan). A Percepção reduzida afeta a capacidade de concentração.'
            },
            {
                nome: 'ESSÊNCIA',
                abreviacao: 'ESS',
                categoria: 'Mental/Chakra',
                descricao: 'Mede a força da alma, a energia espiritual e o fluxo de chakra do personagem. É fundamental para determinar o volume de Chakra e a eficácia de habilidades de linhagem sanguínea (como o Byakugan e Juuken). O dano causado à Essência (Dano Essencial) é recuperado lentamente, sublinhando sua importância.'
            },
            {
                nome: 'INFLUÊNCIA',
                abreviacao: 'INF',
                categoria: 'Social',
                descricao: 'Governa a capacidade de comunicação social, carisma, liderança, persuasão, e a habilidade de atuar ou enganar. É o atributo central para a espionagem social, a coordenação de equipes e para manobras sociais em combate (como Distrair/Fintar). É um atributo de foco para Clãs que se baseiam em interação e manipulação mental (Nara e Yamanaka).'
            }
        ];

        console.log('📊 Inserindo dados de atributos...');

        // Tentar inserir os dados
        const { error: insertError } = await supabase
            .from('attributes')
            .upsert(attributesData, {
                onConflict: 'nome',
                ignoreDuplicates: false
            });

        if (insertError) {
            console.error('❌ Erro ao inserir dados:', insertError);

            // Se a tabela não existe, vamos mostrar instruções para criá-la manualmente
            if (insertError.message.includes('Could not find the table')) {
                console.log('\n💡 A tabela attributes não existe ainda.');
                console.log('📋 Execute o seguinte SQL no Supabase Dashboard (SQL Editor):');
                console.log('\n' + '='.repeat(60));
                console.log(`
CREATE TABLE IF NOT EXISTS attributes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    abreviacao TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL CHECK (categoria IN ('Físico', 'Mental/Chakra', 'Social')),
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attributes_categoria ON attributes(categoria);
CREATE INDEX IF NOT EXISTS idx_attributes_abreviacao ON attributes(abreviacao);
                `);
                console.log('='.repeat(60));
                console.log('\n🔄 Após criar a tabela, execute este script novamente.');
            }

            throw insertError;
        }

        console.log('✅ Dados inseridos com sucesso!');

        // Verificar dados inseridos
        console.log('🔍 Verificando dados...');
        const { data, error: selectError } = await supabase
            .from('attributes')
            .select('*')
            .order('categoria', { ascending: true });

        if (selectError) {
            console.error('❌ Erro ao verificar dados:', selectError);
            throw selectError;
        }

        console.log(`✅ ${data.length} atributos encontrados no banco!`);
        console.log('📋 Resumo dos dados:');

        // Agrupar por categoria
        const categories = {};
        data.forEach(attr => {
            if (!categories[attr.categoria]) {
                categories[attr.categoria] = [];
            }
            categories[attr.categoria].push(attr);
        });

        Object.entries(categories).forEach(([category, attrs]) => {
            console.log(`\n   ${category}:`);
            attrs.forEach(attr => {
                console.log(`     • ${attr.abreviacao} - ${attr.nome}`);
            });
        });

        console.log('\n🎉 Migração concluída com sucesso!');

    } catch (error) {
        console.error('💥 Erro durante a migração:', error);
        process.exit(1);
    }
}

// Executar migração
migrateAttributes();


