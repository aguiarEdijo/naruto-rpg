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

async function migrateDefects() {
    console.log('🚀 Iniciando migração da tabela defects...');

    try {
        // Primeiro, verificar se a tabela existe e sua estrutura
        console.log('🔍 Verificando estrutura da tabela defects...');

        const { data: tableCheck, error: tableError } = await supabase
            .from('defects')
            .select('*')
            .limit(1);

        if (tableError) {
            console.error('❌ Erro ao verificar tabela:', tableError);

            if (tableError.message.includes('Could not find the table')) {
                console.log('\n💡 A tabela defects não existe.');
                console.log('📋 Execute o seguinte SQL no Supabase Dashboard (SQL Editor):');
                console.log('\n' + '='.repeat(60));
                console.log(`
CREATE TABLE defects (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_defects_tipo ON defects(tipo);
CREATE INDEX idx_defects_nome ON defects(nome);
                `);
                console.log('='.repeat(60));
                console.log('\n🔄 Após criar a tabela, execute este script novamente.');
            } else {
                console.log('\n💡 A tabela existe mas tem estrutura incorreta.');
                console.log('📋 Execute o seguinte SQL no Supabase Dashboard (SQL Editor):');
                console.log('\n' + '='.repeat(60));
                console.log(`
-- Adicionar colunas que podem estar faltando
ALTER TABLE defects ADD COLUMN IF NOT EXISTS tipo TEXT;
ALTER TABLE defects ADD COLUMN IF NOT EXISTS descricao TEXT;

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_defects_tipo ON defects(tipo);
CREATE INDEX IF NOT EXISTS idx_defects_nome ON defects(nome);
                `);
                console.log('='.repeat(60));
                console.log('\n🔄 Após executar o SQL acima, execute este script novamente.');
            }

            throw tableError;
        }

        console.log('✅ Tabela defects encontrada!');

        // Dados dos defeitos
        const defectsData = [
            {
                nome: 'REDUÇÃO DE ATRIBUTOS INICIAIS',
                tipo: 'Mecânico',
                descricao: 'Devido à simbiose única do Clã Aburame com os Kikaichuu, o corpo do personagem sofre um custo físico inerente, sendo menos robusto do que o normal. (Membros do Clã Aburame possuem Força e Vigor reduzidos no início).'
            },
            {
                nome: 'COMPULSIVO ALIMENTAR',
                tipo: 'Compulsão',
                descricao: 'O personagem (comum ao Clã Akimichi) não consegue passar muito tempo sem ceder a um desejo de comer. Esta ação pode vir a acontecer em meio de combates, exigindo que o personagem gaste tempo para executá-la. Se o personagem for privado de fazer sua compulsão, terá suas Emoções afetadas.'
            },
            {
                nome: 'PACTO DE SERVIDÃO',
                tipo: 'Emocional/Obrigação',
                descricao: 'Típico da Família Secundária Hyuuga. O personagem carrega um pacto que o vincula a um dever inquebrável, frequentemente marcado por um selo amaldiçoado ou um fuinjutsu de clã. Esta responsabilidade reduz sua capacidade máxima de Emoções, intensificando a pressão emocional. Qualquer desvio dessa missão impacta profundamente suas Emoções.'
            },
            {
                nome: 'ORGULHO EXACERBADO',
                tipo: 'Emocional/Social',
                descricao: 'Comum ao Clã Uchiha. O personagem não abaixa a cabeça para ninguém; seu ego é inflado a ponto de ter suas Emoções afetadas quando se sente rebaixado ou humilhado. O personagem que adquire este defeito, tem sua capacidade de Emoções reduzida.'
            },
            {
                nome: 'VULNERABILIDADE EMOCIONAL',
                tipo: 'Emocional',
                descricao: 'Comum ao Clã Inuzuka. Devido à profunda conexão espiritual e emocional com o Cão Shinobi, o personagem sofre uma grande vulnerabilidade. Cativar e, principalmente, perder um companheiro canino afeta drasticamente as Emoções do membro do clã.'
            },
            {
                nome: 'MISSÃO SHINOBI - LEALDADE INABALÁVEL',
                tipo: 'Emocional/Obrigação',
                descricao: 'Comum ao Clã Senju. O personagem possui um senso profundo de lealdade para com seus aliados, crenças e vilas. Este forte Dever afeta as suas Emoções se houver falha em cumprir esta lealdade ou se for confrontado com a traição.'
            },
            {
                nome: 'COMPULSÃO POR PROCRASTINAR (PREGUIÇA)',
                tipo: 'Compulsão/Mental',
                descricao: 'Comum ao Clã Nara. O personagem é avesso ao esforço desnecessário. Em situações de tensão (como combate), a compulsão por buscar o caminho mais fácil ou descansar exige que ele gaste tempo (Ações) para \'pensar\' ou \'procrastinar\'. Suas Emoções são afetadas se for ativamente impedido de adiar a ação.'
            },
            {
                nome: 'SEGREDOS DO SELAMENTO / CAÇADO',
                tipo: 'Obrigação/Emocional',
                descricao: 'Comum ao Clã Uzumaki. Devido à sua herança de Fuinjutsu e segredos de selamento, o clã é alvo de perseguição de outras vilas ou organizações. Este \'Dever\' gera uma pressão constante que pode afetar suas Emoções em momentos de grande estresse ou quando um selo importante é rompido.'
            },
            {
                nome: 'ABERTURA PSÍQUICA (VULNERABILIDADE MENTAL)',
                tipo: 'Mecânico/Mental',
                descricao: 'Comum ao Clã Yamanaka. O foco extremo na mente e o uso constante de técnicas telepáticas tornam a consciência do personagem mais exposta. Ele recebe uma piora em testes de Resistência Mental (RM) contra ataques psíquicos diretos.'
            },
            {
                nome: 'HONESTIDADE',
                tipo: 'Social',
                descricao: 'O personagem é incapaz de mentir ou enganar intencionalmente, a menos que esteja sob extrema pressão emocional. Isso impõe uma piora em todas as perícias de Influência Social (como Blefar/Persuasão) quando a mentira está envolvida. Este defeito pode ser induzido pelo Elixir da Verdade.'
            },
            {
                nome: 'ARROGÂNCIA SOCIAL',
                tipo: 'Social/Emocional',
                descricao: 'O personagem tem dificuldade em respeitar ou levar a sério aqueles que considera inferiores. Recebe uma piora em testes de Influência e Persuasão ao interagir com personagens de status significativamente menor ou que ele despreza.'
            },
            {
                nome: 'FAMA INDESEJADA',
                tipo: 'Social',
                descricao: 'A aparência, reputação ou histórico do personagem o tornam facilmente reconhecível, mesmo sob disfarce. Ele recebe uma piora em testes de Furtividade e Disfarce em áreas populosas, pois a atenção social o destaca.'
            },
            {
                nome: 'IMPULSIVO',
                tipo: 'Comportamental',
                descricao: 'O personagem age antes de pensar, especialmente quando desafiado. Em situações de combate ou tensão social, ele deve superar um teste de controle para usar a manobra Adiar Ações ou para não atacar imediatamente a fonte de seu estresse.'
            }
        ];

        console.log('📊 Inserindo dados de defeitos...');

        // Tentar inserir os dados
        const { error: insertError } = await supabase
            .from('defects')
            .upsert(defectsData, {
                onConflict: 'nome',
                ignoreDuplicates: false
            });

        if (insertError) {
            console.error('❌ Erro ao inserir dados:', insertError);
            throw insertError;
        }

        console.log('✅ Dados inseridos com sucesso!');

        // Verificar dados inseridos
        console.log('🔍 Verificando dados...');
        const { data, error: selectError } = await supabase
            .from('defects')
            .select('*')
            .order('tipo', { ascending: true });

        if (selectError) {
            console.error('❌ Erro ao verificar dados:', selectError);
            throw selectError;
        }

        console.log(`✅ ${data.length} defeitos encontrados no banco!`);
        console.log('📋 Resumo dos dados:');

        // Agrupar por tipo
        const types = {};
        data.forEach(defect => {
            if (!types[defect.tipo]) {
                types[defect.tipo] = [];
            }
            types[defect.tipo].push(defect);
        });

        Object.entries(types).forEach(([type, defects]) => {
            console.log(`\n   ${type}:`);
            defects.forEach(defect => {
                console.log(`     • ${defect.nome}`);
            });
        });

        console.log('\n🎉 Migração concluída com sucesso!');

    } catch (error) {
        console.error('💥 Erro durante a migração:', error);
        process.exit(1);
    }
}

// Executar migração
migrateDefects();


