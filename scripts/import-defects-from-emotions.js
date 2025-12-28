const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL não encontrada nas variáveis de ambiente');
    process.exit(1);
}

if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada nas variáveis de ambiente');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapeamento de seções para tipos
const SECTION_TO_TYPE = {
    'Defeitos de Natureza Emocional e Psicológica': 'Emocional/Psicológico',
    'Defeitos de Orgulho, Pecado e Conduta': 'Emocional/Comportamental',
    'Defeitos de Missão, Dever e Lealdade': 'Obrigação',
    'Defeitos Sociais': 'Social',
    'Defeitos Físicos com Impacto Emocional': 'Físico'
};

// Função para capitalizar título (converte "ABANDONADO PELA FÉ" para "Abandonado pela Fé")
function capitalizeTitle(title) {
    return title
        .split(' ')
        .map(word => {
            // Manter algumas palavras em minúsculas se necessário
            const lowercaseWords = ['de', 'da', 'do', 'das', 'dos', 'pela', 'pelas', 'pelo', 'pelos', '/'];
            if (lowercaseWords.includes(word.toLowerCase()) && word !== word.toUpperCase()) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}

// Função para fazer parse do markdown e extrair defeitos
function parseDefectsFromMarkdown(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const defects = [];
    
    let currentSection = null;
    let currentDefect = null;
    let lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detectar seção
        if (line.startsWith('## ') && line !== '## Defeitos do Sistema (Adaptados e Consolidados)') {
            currentSection = line.replace('## ', '').trim();
            continue;
        }
        
        // Detectar início de defeito (### TITULO)
        if (line.startsWith('### ')) {
            // Salvar defeito anterior se existir
            if (currentDefect) {
                defects.push(currentDefect);
            }
            
            const title = line.replace('### ', '').trim();
            currentDefect = {
                nome: capitalizeTitle(title),
                tipo: SECTION_TO_TYPE[currentSection] || 'Outros',
                descricao: ''
            };
            continue;
        }
        
        // Acumular descrição
        if (currentDefect) {
            // Pular linhas vazias no início
            if (!line && !currentDefect.descricao) {
                continue;
            }
            
            // Parar ao encontrar novo defeito ou seção
            if (line.startsWith('### ') || line.startsWith('## ')) {
                if (currentDefect.descricao.trim()) {
                    defects.push(currentDefect);
                }
                currentDefect = null;
                if (line.startsWith('### ')) {
                    i--; // Reprocessar esta linha
                }
                continue;
            }
            
            // Adicionar linha à descrição
            if (line) {
                currentDefect.descricao += (currentDefect.descricao ? '\n' : '') + line;
            }
        }
    }
    
    // Adicionar último defeito
    if (currentDefect && currentDefect.descricao.trim()) {
        defects.push(currentDefect);
    }
    
    return defects;
}

async function importDefects() {
    console.log('🚀 Iniciando importação de defeitos do arquivo emoções.md...');
    
    try {
        const emotionsFilePath = path.join(__dirname, '..', 'docs', 'emoções.md');
        
        if (!fs.existsSync(emotionsFilePath)) {
            console.error(`❌ Arquivo não encontrado: ${emotionsFilePath}`);
            process.exit(1);
        }
        
        // Parse do markdown
        console.log('📖 Fazendo parse do arquivo markdown...');
        const defects = parseDefectsFromMarkdown(emotionsFilePath);
        console.log(`✅ Encontrados ${defects.length} defeitos no arquivo`);
        
        // Buscar defeitos existentes no banco
        console.log('🔍 Verificando defeitos existentes no banco...');
        const { data: existingDefects, error: fetchError } = await supabase
            .from('defects')
            .select('nome');
        
        if (fetchError) {
            console.error('❌ Erro ao buscar defeitos existentes:', fetchError);
            throw fetchError;
        }
        
        const existingNames = new Set((existingDefects || []).map(d => d.nome.toUpperCase()));
        console.log(`📊 Encontrados ${existingNames.size} defeitos já cadastrados`);
        
        // Filtrar apenas defeitos novos
        const newDefects = defects.filter(defect => {
            return !existingNames.has(defect.nome.toUpperCase());
        });
        
        console.log(`✨ ${newDefects.length} defeitos novos para importar`);
        
        if (newDefects.length === 0) {
            console.log('✅ Todos os defeitos já estão no banco de dados!');
            return;
        }
        
        // Exibir defeitos que serão importados
        console.log('\n📋 Defeitos que serão importados:');
        newDefects.forEach((defect, index) => {
            console.log(`  ${index + 1}. ${defect.nome} (${defect.tipo})`);
        });
        
        // Inserir defeitos no banco
        console.log('\n💾 Inserindo defeitos no banco de dados...');
        const { data: insertedData, error: insertError } = await supabase
            .from('defects')
            .insert(newDefects)
            .select();
        
        if (insertError) {
            console.error('❌ Erro ao inserir defeitos:', insertError);
            throw insertError;
        }
        
        console.log(`✅ ${insertedData.length} defeitos importados com sucesso!`);
        
        // Exibir resumo final
        console.log('\n📊 Resumo:');
        console.log(`   Total no arquivo: ${defects.length}`);
        console.log(`   Já existentes: ${existingNames.size}`);
        console.log(`   Novos importados: ${insertedData.length}`);
        
    } catch (error) {
        console.error('❌ Erro durante importação:', error);
        process.exit(1);
    }
}

// Executar importação
importDefects().then(() => {
    console.log('\n✅ Importação concluída!');
    process.exit(0);
}).catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});

