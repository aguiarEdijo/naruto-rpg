-- Script para corrigir as tabelas enhancements e defects no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Corrigir tabela enhancements
ALTER TABLE enhancements 
ALTER COLUMN effects TYPE TEXT USING effects::TEXT,
ALTER COLUMN requirements TYPE TEXT USING requirements::TEXT;

-- 2. Corrigir tabela defects  
ALTER TABLE defects
ALTER COLUMN penalties TYPE TEXT USING penalties::TEXT,
ALTER COLUMN restrictions TYPE TEXT USING restrictions::TEXT;

-- 3. Atualizar dados existentes (se houver)
-- Converter arrays JSONB para strings separadas por ';'
UPDATE enhancements 
SET effects = CASE 
    WHEN effects IS NULL OR effects = '' THEN ''
    WHEN jsonb_typeof(effects) = 'array' THEN 
        array_to_string(
            ARRAY(SELECT jsonb_array_elements_text(effects)), 
            ';'
        )
    ELSE effects::TEXT
END;

UPDATE enhancements 
SET requirements = CASE 
    WHEN requirements IS NULL OR requirements = '{}' THEN '{}'
    ELSE requirements::TEXT
END;

UPDATE defects 
SET penalties = CASE 
    WHEN penalties IS NULL OR penalties = '' THEN ''
    WHEN jsonb_typeof(penalties) = 'array' THEN 
        array_to_string(
            ARRAY(SELECT jsonb_array_elements_text(penalties)), 
            ';'
        )
    ELSE penalties::TEXT
END;

UPDATE defects 
SET restrictions = CASE 
    WHEN restrictions IS NULL OR restrictions = '{}' THEN '{}'
    ELSE restrictions::TEXT
END;

-- 4. Verificar se as alterações foram aplicadas
SELECT 
    'enhancements' as table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'enhancements' 
AND column_name IN ('effects', 'requirements')

UNION ALL

SELECT 
    'defects' as table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'defects' 
AND column_name IN ('penalties', 'restrictions');
