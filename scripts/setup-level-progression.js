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

async function migrateLevelProgression() {
    console.log('🚀 Iniciando migração da tabela level_progression...');

    try {
        // 1. Primeiro, criar a tabela se ela não existir
        console.log('📋 Criando tabela level_progression...');
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS level_progression (
                id SERIAL PRIMARY KEY,
                level INTEGER NOT NULL UNIQUE CHECK (level >= 1 AND level <= 20),
                rank TEXT NOT NULL CHECK (rank IN ('Genin', 'Chunnin', 'Jounin', 'Hokage')),
                dice_evolution TEXT NOT NULL,
                attribute_points TEXT NOT NULL,
                skill_points TEXT NOT NULL,
                total_skill_gain INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS idx_level_progression_level ON level_progression(level);
            CREATE INDEX IF NOT EXISTS idx_level_progression_rank ON level_progression(rank);
        `;

        const { error: createError } = await supabase.rpc('exec_sql', {
            sql: createTableSQL
        });

        if (createError) {
            console.error('❌ Erro ao criar tabela:', createError);
            throw createError;
        }

        console.log('✅ Tabela level_progression criada com sucesso!');

        // 2. Dados de progressão
        console.log('📊 Inserindo dados de progressão...');
        const levelData = [
            { level: 1, rank: 'Genin', dice_evolution: '2d6', attribute_points: '+1', skill_points: '+1', total_skill_gain: 1 },
            { level: 2, rank: 'Genin', dice_evolution: '2d6', attribute_points: '—', skill_points: '+1', total_skill_gain: 1 },
            { level: 3, rank: 'Genin', dice_evolution: '2d6', attribute_points: '+1', skill_points: '+1', total_skill_gain: 1 },
            { level: 4, rank: 'Genin', dice_evolution: '2d6', attribute_points: '—', skill_points: '+1', total_skill_gain: 1 },
            { level: 5, rank: 'Chunnin', dice_evolution: '1d8 + 1d6', attribute_points: '+1', skill_points: '+1 (+2 Bônus)', total_skill_gain: 3 },
            { level: 6, rank: 'Chunnin', dice_evolution: '1d8 + 1d6', attribute_points: '—', skill_points: '+1', total_skill_gain: 1 },
            { level: 7, rank: 'Chunnin', dice_evolution: '1d8 + 1d6', attribute_points: '+1', skill_points: '+1', total_skill_gain: 1 },
            { level: 8, rank: 'Chunnin', dice_evolution: '1d8 + 1d6', attribute_points: '—', skill_points: '+1', total_skill_gain: 1 },
            { level: 9, rank: 'Chunnin', dice_evolution: '2d8', attribute_points: '+1', skill_points: '+1', total_skill_gain: 1 },
            { level: 10, rank: 'Jounin', dice_evolution: '2d8', attribute_points: '—', skill_points: '+1 (+2 Bônus)', total_skill_gain: 3 },
            { level: 11, rank: 'Jounin', dice_evolution: '2d8', attribute_points: '+1', skill_points: '+1', total_skill_gain: 1 },
            { level: 12, rank: 'Jounin', dice_evolution: '2d8', attribute_points: '—', skill_points: '+1', total_skill_gain: 1 },
            { level: 13, rank: 'Jounin', dice_evolution: '1d10 + 1d8', attribute_points: '+1', skill_points: '+1', total_skill_gain: 1 },
            { level: 14, rank: 'Jounin', dice_evolution: '1d10 + 1d8', attribute_points: '—', skill_points: '+1', total_skill_gain: 1 },
            { level: 15, rank: 'Hokage', dice_evolution: '1d10 + 1d8', attribute_points: '+1', skill_points: '+1 (+2 Bônus)', total_skill_gain: 3 },
            { level: 16, rank: 'Hokage', dice_evolution: '1d10 + 1d8', attribute_points: '—', skill_points: '+1', total_skill_gain: 1 },
            { level: 17, rank: 'Hokage', dice_evolution: '2d10', attribute_points: '+1', skill_points: '+1', total_skill_gain: 1 },
            { level: 18, rank: 'Hokage', dice_evolution: '2d10', attribute_points: '—', skill_points: '+1', total_skill_gain: 1 },
            { level: 19, rank: 'Hokage', dice_evolution: '2d10', attribute_points: '+1', skill_points: '+1', total_skill_gain: 1 },
            { level: 20, rank: 'Hokage', dice_evolution: '2d10', attribute_points: '—', skill_points: '+1', total_skill_gain: 1 }
        ];

        // Inserir dados usando upsert (insert ou update)
        console.log('📊 Inserindo dados de progressão...');
        const { error: insertError } = await supabase
            .from('level_progression')
            .upsert(levelData, {
                onConflict: 'level',
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
            .from('level_progression')
            .select('*')
            .order('level', { ascending: true });

        if (selectError) {
            console.error('❌ Erro ao verificar dados:', selectError);
            throw selectError;
        }

        console.log(`✅ ${data.length} níveis encontrados no banco!`);
        console.log('📋 Resumo dos dados:');

        // Agrupar por patente
        const ranks = {};
        data.forEach(level => {
            if (!ranks[level.rank]) {
                ranks[level.rank] = [];
            }
            ranks[level.rank].push(level.level);
        });

        Object.entries(ranks).forEach(([rank, levels]) => {
            const minLevel = Math.min(...levels);
            const maxLevel = Math.max(...levels);
            console.log(`   ${rank}: Níveis ${minLevel}-${maxLevel} (${levels.length} níveis)`);
        });

        console.log('🎉 Migração concluída com sucesso!');

    } catch (error) {
        console.error('💥 Erro durante a migração:', error);
        process.exit(1);
    }
}

// Executar migração
migrateLevelProgression();
