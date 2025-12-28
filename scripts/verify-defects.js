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

async function verifyDefects() {
    console.log('🔍 Verificando tabela defects após criação...');

    try {
        // Verificar se conseguimos consultar a tabela
        console.log('📊 Consultando defeitos...');

        const { data, error } = await supabase
            .from('defects')
            .select('*')
            .order('tipo', { ascending: true });

        if (error) {
            console.error('❌ Erro ao consultar defeitos:', error);
            throw error;
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

        console.log('\n🎉 Verificação concluída com sucesso!');
        console.log('✅ A tabela defects está funcionando corretamente!');

    } catch (error) {
        console.error('💥 Erro durante a verificação:', error);
        process.exit(1);
    }
}

// Executar verificação
verifyDefects();


