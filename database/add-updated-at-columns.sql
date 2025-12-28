-- ============================================================
-- Script para adicionar coluna updated_at em todas as tabelas
-- Execute este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

-- Função genérica para atualizar updated_at (já existe para users, mas vamos garantir)
-- Versão segura que verifica se a coluna existe antes de atualizar
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
DECLARE
    has_updated_at BOOLEAN;
BEGIN
    -- Verificar se a coluna updated_at existe na tabela
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = TG_TABLE_SCHEMA 
        AND table_name = TG_TABLE_NAME 
        AND column_name = 'updated_at'
    ) INTO has_updated_at;
    
    -- Só atualizar se a coluna existir
    IF has_updated_at THEN
        BEGIN
            NEW.updated_at := NOW();
        EXCEPTION
            WHEN undefined_column THEN
                -- Se a coluna não existir, simplesmente retornar sem erro
                NULL;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================
-- 1. CLANS - Adicionar updated_at
-- ============================================================
-- Verificar se a coluna já existe antes de adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clans' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE clans ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        -- Criar trigger se não existir
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'update_clans_updated_at'
        ) THEN
            CREATE TRIGGER update_clans_updated_at 
                BEFORE UPDATE ON clans 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
        END IF;
        
        -- Atualizar registros existentes com created_at
        UPDATE clans SET updated_at = created_at WHERE updated_at IS NULL;
        
        RAISE NOTICE 'Coluna updated_at adicionada à tabela clans';
    ELSE
        RAISE NOTICE 'Coluna updated_at já existe na tabela clans';
    END IF;
END $$;

-- ============================================================
-- 2. ENHANCEMENTS - Adicionar updated_at
-- ============================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'enhancements' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE enhancements ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'update_enhancements_updated_at'
        ) THEN
            CREATE TRIGGER update_enhancements_updated_at 
                BEFORE UPDATE ON enhancements 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
        END IF;
        
        UPDATE enhancements SET updated_at = created_at WHERE updated_at IS NULL;
        
        RAISE NOTICE 'Coluna updated_at adicionada à tabela enhancements';
    ELSE
        RAISE NOTICE 'Coluna updated_at já existe na tabela enhancements';
    END IF;
END $$;

-- ============================================================
-- 3. DEFECTS - Adicionar updated_at
-- ============================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'defects' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE defects ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'update_defects_updated_at'
        ) THEN
            CREATE TRIGGER update_defects_updated_at 
                BEFORE UPDATE ON defects 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
        END IF;
        
        UPDATE defects SET updated_at = created_at WHERE updated_at IS NULL;
        
        RAISE NOTICE 'Coluna updated_at adicionada à tabela defects';
    ELSE
        RAISE NOTICE 'Coluna updated_at já existe na tabela defects';
    END IF;
END $$;

-- ============================================================
-- 4. SKILLS - Adicionar updated_at
-- ============================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'skills' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE skills ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'update_skills_updated_at'
        ) THEN
            CREATE TRIGGER update_skills_updated_at 
                BEFORE UPDATE ON skills 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
        END IF;
        
        UPDATE skills SET updated_at = created_at WHERE updated_at IS NULL;
        
        RAISE NOTICE 'Coluna updated_at adicionada à tabela skills';
    ELSE
        RAISE NOTICE 'Coluna updated_at já existe na tabela skills';
    END IF;
END $$;

-- ============================================================
-- 5. LEVEL_PROGRESSION - Adicionar updated_at
-- ============================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level_progression' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE level_progression ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'update_level_progression_updated_at'
        ) THEN
            CREATE TRIGGER update_level_progression_updated_at 
                BEFORE UPDATE ON level_progression 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
        END IF;
        
        UPDATE level_progression SET updated_at = created_at WHERE updated_at IS NULL;
        
        RAISE NOTICE 'Coluna updated_at adicionada à tabela level_progression';
    ELSE
        RAISE NOTICE 'Coluna updated_at já existe na tabela level_progression';
    END IF;
END $$;

-- ============================================================
-- Verificação final
-- ============================================================
-- Verificar quais tabelas têm updated_at
SELECT 
    table_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = t.table_name AND column_name = 'updated_at'
        ) THEN '✓'
        ELSE '✗'
    END as has_updated_at,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = t.table_name AND column_name = 'created_at'
        ) THEN '✓'
        ELSE '✗'
    END as has_created_at
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN ('users', 'clans', 'items', 'enhancements', 'defects', 'skills', 'level_progression')
ORDER BY table_name;

-- Comentários para documentação
COMMENT ON COLUMN clans.updated_at IS 'Data da última atualização do registro';
COMMENT ON COLUMN enhancements.updated_at IS 'Data da última atualização do registro';
COMMENT ON COLUMN defects.updated_at IS 'Data da última atualização do registro';
COMMENT ON COLUMN skills.updated_at IS 'Data da última atualização do registro';
COMMENT ON COLUMN level_progression.updated_at IS 'Data da última atualização do registro';

