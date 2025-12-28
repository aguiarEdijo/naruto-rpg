// Script para executar SQL no Supabase
// npm install @supabase/supabase-js dotenv

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Chave de serviço

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variáveis de ambiente não configuradas');
    console.log('Adicione ao .env:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://kvbbdcegsdohnhyzsflk.supabase.co');
    console.log('SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL() {
    try {
        console.log('🚀 Executando SQL no Supabase...');

        // SQL para criar tabela users
        const sql = `
            -- Criar tabela users
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                is_gm BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Habilitar RLS
            ALTER TABLE users ENABLE ROW LEVEL SECURITY;

            -- Criar políticas para users
            CREATE POLICY "Users can view their own data." ON users
                FOR SELECT USING (auth.uid() = id);

            CREATE POLICY "Users can insert their own data." ON users
                FOR INSERT WITH CHECK (auth.uid() = id);

            CREATE POLICY "Users can update their own data." ON users
                FOR UPDATE USING (auth.uid() = id);

            CREATE POLICY "Users can delete their own data." ON users
                FOR DELETE USING (auth.uid() = id);

            -- Criar função para atualizar updated_at automaticamente
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ language 'plpgsql';

            -- Criar trigger para atualizar updated_at
            CREATE TRIGGER update_users_updated_at 
                BEFORE UPDATE ON users 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
        `;

        // Executar SQL usando rpc
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('❌ Erro ao executar SQL:', error);
        } else {
            console.log('✅ SQL executado com sucesso!');
        }

    } catch (error) {
        console.error('❌ Erro:', error);
    }
}

executeSQL();
