-- Script para verificar e corrigir a estrutura da tabela defects
-- Execute este SQL no Supabase Dashboard

-- 1. Verificar a estrutura atual da tabela defects
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'defects' 
ORDER BY ordinal_position;

-- 2. Verificar se existe a tabela character_defects
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'character_defects';

-- 3. Verificar a estrutura da tabela character_defects
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'character_defects' 
ORDER BY ordinal_position;

-- 4. Se a coluna 'tipo' não existir na tabela defects, adicionar ela
ALTER TABLE defects ADD COLUMN IF NOT EXISTS tipo TEXT;

-- 5. Se a coluna 'descricao' não existir na tabela defects, adicionar ela
ALTER TABLE defects ADD COLUMN IF NOT EXISTS descricao TEXT;

-- 6. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_defects_tipo ON defects(tipo);
CREATE INDEX IF NOT EXISTS idx_defects_nome ON defects(nome);

-- 7. Verificar a estrutura final
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'defects' 
ORDER BY ordinal_position;


