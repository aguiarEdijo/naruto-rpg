const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kvbbdcegsdohnhyzsflk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada nas variáveis de ambiente');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
    console.log('🚀 Iniciando migrações do banco de dados...');

    try {
        // 1. Criar tabela level_progression
        console.log('📋 Criando tabela level_progression...');
        const levelProgressionSQL = fs.readFileSync(
            path.join(__dirname, '../database/level-progression.sql'),
            'utf8'
        );

        const { error: createError } = await supabase.rpc('exec_sql', {
            sql: levelProgressionSQL
        });

        if (createError) {
            console.error('❌ Erro ao criar tabela level_progression:', createError);
            throw createError;
        }

        console.log('✅ Tabela level_progression criada com sucesso!');

        // 2. Inserir dados de progressão
        console.log('📊 Inserindo dados de progressão...');
        const insertSQL = fs.readFileSync(
            path.join(__dirname, '../database/insert-level-progression.sql'),
            'utf8'
        );

        const { error: insertError } = await supabase.rpc('exec_sql', {
            sql: insertSQL
        });

        if (insertError) {
            console.error('❌ Erro ao inserir dados de progressão:', insertError);
            throw insertError;
        }

        console.log('✅ Dados de progressão inseridos com sucesso!');

        // 3. Verificar se os dados foram inseridos
        console.log('🔍 Verificando dados inseridos...');
        const { data, error: selectError } = await supabase
            .from('level_progression')
            .select('*')
            .order('level', { ascending: true });

        if (selectError) {
            console.error('❌ Erro ao verificar dados:', selectError);
            throw selectError;
        }

        console.log(`✅ ${data.length} níveis de progressão encontrados no banco!`);
        console.log('📋 Primeiros 5 níveis:');
        data.slice(0, 5).forEach(level => {
            console.log(`   Nível ${level.level}: ${level.rank} - ${level.dice_evolution}`);
        });

        console.log('🎉 Migrações concluídas com sucesso!');

    } catch (error) {
        console.error('💥 Erro durante as migrações:', error);
        process.exit(1);
    }
}

// Executar migrações
runMigrations();


