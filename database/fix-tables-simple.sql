-- Script simples para corrigir tabelas no Supabase
-- Execute no SQL Editor do Supabase Dashboard

-- Corrigir tabela enhancements
ALTER TABLE enhancements 
ALTER COLUMN effects TYPE TEXT,
ALTER COLUMN requirements TYPE TEXT;

-- Corrigir tabela defects
ALTER TABLE defects
ALTER COLUMN penalties TYPE TEXT,
ALTER COLUMN restrictions TYPE TEXT;

-- Verificar resultado
SELECT 'enhancements' as tabela, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'enhancements' 
AND column_name IN ('effects', 'requirements')

UNION ALL

SELECT 'defects' as tabela, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'defects' 
AND column_name IN ('penalties', 'restrictions');
