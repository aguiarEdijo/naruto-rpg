-- Script para verificar e corrigir a estrutura da tabela defects
-- Execute este SQL no Supabase Dashboard

-- 1. Verificar a estrutura atual da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'defects' 
ORDER BY ordinal_position;

-- 2. Se a tabela não existir ou estiver com estrutura incorreta, execute:
DROP TABLE IF EXISTS defects;

-- 3. Criar a tabela com a estrutura correta
CREATE TABLE defects (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar índices
CREATE INDEX idx_defects_tipo ON defects(tipo);
CREATE INDEX idx_defects_nome ON defects(nome);

-- 5. Verificar se a tabela foi criada corretamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'defects' 
ORDER BY ordinal_position;


