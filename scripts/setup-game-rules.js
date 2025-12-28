const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kvbbdcegsdohnhyzsflk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada nas variáveis de ambiente');
    console.log('\n📝 Adicione ao arquivo .env:');
    console.log('SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui\n');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Lista de scripts SQL na ordem de execução
const sqlScripts = [
    {
        name: 'Criar tabelas de regras do jogo',
        file: path.join(__dirname, '../database/game-rules-tables.sql'),
        description: 'Cria todas as 6 tabelas necessárias'
    },
    {
        name: 'Popular rank multipliers',
        file: path.join(__dirname, '../database/seed-rank-multipliers.sql'),
        description: 'Insere multiplicadores por rank (E, D, C, B, A, S)'
    },
    {
        name: 'Popular regras de recursos',
        file: path.join(__dirname, '../database/seed-resource-rules.sql'),
        description: 'Insere fórmulas de cálculo de vida, chakra, RM e RF'
    },
    {
        name: 'Popular categorias de jutsus',
        file: path.join(__dirname, '../database/seed-jutsu-categories.sql'),
        description: 'Insere categorias e ranks de jutsus'
    },
    {
        name: 'Popular efeitos de jutsus',
        file: path.join(__dirname, '../database/seed-jutsu-effects.sql'),
        description: 'Insere lista completa de efeitos disponíveis'
    },
    {
        name: 'Popular dificuldades de resistência',
        file: path.join(__dirname, '../database/seed-resistance-difficulties.sql'),
        description: 'Insere dificuldades de RM/RF por rank'
    }
];

async function executeSQLFile(sqlContent, scriptName) {
    // Dividir o SQL em comandos individuais (separados por ;)
    // Remover comentários e linhas vazias
    const commands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`\n📝 Executando: ${scriptName}`);
    console.log(`   Encontrados ${commands.length} comandos SQL`);

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i] + ';';
        
        // Pular comandos que são apenas comentários ou muito pequenos
        if (command.trim().length < 10) continue;

        try {
            // Tentar executar via RPC (pode não funcionar se a função não existir)
            // Ou executar diretamente via query se possível
            const { error } = await supabase.rpc('exec_sql', {
                sql_query: command
            });

            if (error) {
                // Se RPC não funcionar, tentar método alternativo
                console.log(`   ⚠️  Comando ${i + 1} precisa ser executado manualmente`);
                console.log(`   💡 Abra o SQL Editor do Supabase e execute:`);
                console.log(`   \n${command}\n`);
            }
        } catch (error) {
            console.log(`   ⚠️  Erro ao executar comando ${i + 1}, execute manualmente no SQL Editor`);
        }
    }
}

async function runMigrations() {
    console.log('🚀 Iniciando migração de regras do jogo...\n');
    console.log('⚠️  NOTA: Este script tentará executar os SQLs, mas alguns comandos');
    console.log('   podem precisar ser executados manualmente no SQL Editor do Supabase.\n');

    try {
        // Verificar se os arquivos existem
        console.log('📂 Verificando arquivos SQL...');
        for (const script of sqlScripts) {
            if (!fs.existsSync(script.file)) {
                console.error(`❌ Arquivo não encontrado: ${script.file}`);
                process.exit(1);
            }
        }
        console.log('✅ Todos os arquivos encontrados!\n');

        // Executar cada script
        for (const script of sqlScripts) {
            const sqlContent = fs.readFileSync(script.file, 'utf8');
            
            console.log(`\n${'='.repeat(60)}`);
            console.log(`📋 ${script.name}`);
            console.log(`   ${script.description}`);
            console.log(`${'='.repeat(60)}`);

            // Tentar executar
            await executeSQLFile(sqlContent, script.name);
            
            console.log(`\n✅ ${script.name} processado!`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 Migração concluída!');
        console.log('='.repeat(60));
        
        console.log('\n📝 PRÓXIMOS PASSOS:');
        console.log('1. Acesse o SQL Editor do Supabase Dashboard');
        console.log('2. Execute cada um dos scripts SQL na ordem:');
        sqlScripts.forEach((script, index) => {
            console.log(`   ${index + 1}. ${script.name} - ${path.basename(script.file)}`);
        });
        console.log('\n💡 Ou copie e cole o conteúdo de cada arquivo .sql no SQL Editor\n');

    } catch (error) {
        console.error('\n💥 Erro durante a migração:', error);
        console.log('\n📝 Execute os scripts manualmente no SQL Editor do Supabase:');
        sqlScripts.forEach((script, index) => {
            console.log(`   ${index + 1}. ${script.file}`);
        });
        process.exit(1);
    }
}

// Executar migrações
runMigrations();





