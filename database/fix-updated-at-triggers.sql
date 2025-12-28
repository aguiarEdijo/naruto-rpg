-- ============================================================
-- Script para CORRIGIR triggers de updated_at
-- Execute este arquivo no Supabase Dashboard (SQL Editor)
-- Este script remove triggers quebrados e recria corretamente
-- ============================================================

-- Função genérica para atualizar updated_at
-- Versão com tratamento de erro para evitar falhas se a coluna não existir
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
-- Remover triggers antigos que podem estar quebrados
-- ============================================================

DROP TRIGGER IF EXISTS update_clans_updated_at ON clans;
DROP TRIGGER IF EXISTS update_enhancements_updated_at ON enhancements;
DROP TRIGGER IF EXISTS update_defects_updated_at ON defects;
DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
DROP TRIGGER IF EXISTS update_level_progression_updated_at ON level_progression;

-- ============================================================
-- 1. CLANS - Garantir que tem updated_at e trigger correto
-- ============================================================
DO $$ 
BEGIN
    -- Adicionar coluna se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clans' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE clans ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        -- Inicializar com created_at
        UPDATE clans SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
        RAISE NOTICE 'Coluna updated_at adicionada à tabela clans';
    END IF;
    
    -- Recriar trigger
    CREATE TRIGGER update_clans_updated_at 
        BEFORE UPDATE ON clans 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    
    RAISE NOTICE 'Trigger para clans criado com sucesso';
END $$;

-- ============================================================
-- 2. ENHANCEMENTS - Garantir que tem updated_at e trigger correto
-- ============================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'enhancements' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE enhancements ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE enhancements SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
        RAISE NOTICE 'Coluna updated_at adicionada à tabela enhancements';
    END IF;
    
    CREATE TRIGGER update_enhancements_updated_at 
        BEFORE UPDATE ON enhancements 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    
    RAISE NOTICE 'Trigger para enhancements criado com sucesso';
END $$;

-- ============================================================
-- 3. DEFECTS - Garantir que tem updated_at e trigger correto
-- ============================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'defects' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE defects ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE defects SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
        RAISE NOTICE 'Coluna updated_at adicionada à tabela defects';
    END IF;
    
    CREATE TRIGGER update_defects_updated_at 
        BEFORE UPDATE ON defects 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    
    RAISE NOTICE 'Trigger para defects criado com sucesso';
END $$;

-- ============================================================
-- 4. SKILLS - Garantir que tem updated_at e trigger correto
-- ============================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'skills' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE skills ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE skills SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
        RAISE NOTICE 'Coluna updated_at adicionada à tabela skills';
    END IF;
    
    CREATE TRIGGER update_skills_updated_at 
        BEFORE UPDATE ON skills 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    
    RAISE NOTICE 'Trigger para skills criado com sucesso';
END $$;

-- ============================================================
-- 5. LEVEL_PROGRESSION - Garantir que tem updated_at e trigger correto
-- ============================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level_progression' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE level_progression ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE level_progression SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
        RAISE NOTICE 'Coluna updated_at adicionada à tabela level_progression';
    END IF;
    
    CREATE TRIGGER update_level_progression_updated_at 
        BEFORE UPDATE ON level_progression 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    
    RAISE NOTICE 'Trigger para level_progression criado com sucesso';
END $$;

-- ============================================================
-- Verificação final - Listar todas as tabelas e seus triggers
-- ============================================================
SELECT 
    t.table_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = t.table_name AND column_name = 'updated_at'
        ) THEN '✓'
        ELSE '✗'
    END as has_updated_at,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_trigger 
            WHERE tgname LIKE 'update_' || t.table_name || '_updated_at'
        ) THEN '✓'
        ELSE '✗'
    END as has_trigger
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN ('users', 'clans', 'items', 'enhancements', 'defects', 'skills', 'level_progression')
ORDER BY table_name;

-- Listar todos os triggers relacionados a updated_at
SELECT 
    trigger_name,
    event_object_table,
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_name LIKE '%updated_at%'
ORDER BY event_object_table, trigger_name;

