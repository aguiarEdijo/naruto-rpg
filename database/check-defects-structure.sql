-- Script para descobrir a estrutura real da tabela defects
-- Execute este SQL no Supabase Dashboard (SQL Editor)

-- 1. Verificar se a tabela defects existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'defects';

-- 2. Verificar todas as colunas da tabela defects
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'defects' 
ORDER BY ordinal_position;

-- 3. Verificar se existe a tabela character_defects
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'character_defects';

-- 4. Verificar colunas da tabela character_defects
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'character_defects' 
ORDER BY ordinal_position;

-- 5. Verificar constraints e foreign keys
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('defects', 'character_defects');


