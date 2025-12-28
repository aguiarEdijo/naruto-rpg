-- ============================================================
-- Script DEFINITIVO para corrigir triggers de updated_at
-- Execute este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

-- PASSO 1: Remover TODOS os triggers que podem estar quebrados
DROP TRIGGER IF EXISTS update_clans_updated_at ON clans;
DROP TRIGGER IF EXISTS update_enhancements_updated_at ON enhancements;
DROP TRIGGER IF EXISTS update_defects_updated_at ON defects;
DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
DROP TRIGGER IF EXISTS update_level_progression_updated_at ON level_progression;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_items_updated_at ON items;
DROP TRIGGER IF EXISTS update_jutsus_updated_at ON jutsus;

-- PASSO 2: Recriar a função - versão simples e direta
-- IMPORTANTE: Esta função só será chamada DEPOIS que as colunas existirem
-- por isso não precisamos de verificação complexa
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- PASSO 3: Garantir que todas as tabelas tenham a coluna updated_at
-- E só então criar os triggers

-- 3.1. CLANS
DO $$ 
BEGIN
    -- Adicionar coluna se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'clans' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE clans ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE clans SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
    END IF;
    
    -- Criar trigger
    CREATE TRIGGER update_clans_updated_at 
        BEFORE UPDATE ON clans 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
END $$;

-- 3.2. ENHANCEMENTS
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'enhancements' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE enhancements ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE enhancements SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
    END IF;
    
    CREATE TRIGGER update_enhancements_updated_at 
        BEFORE UPDATE ON enhancements 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
END $$;

-- 3.3. DEFECTS
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'defects' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE defects ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE defects SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
    END IF;
    
    CREATE TRIGGER update_defects_updated_at 
        BEFORE UPDATE ON defects 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
END $$;

-- 3.4. SKILLS
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'skills' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE skills ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE skills SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
    END IF;
    
    CREATE TRIGGER update_skills_updated_at 
        BEFORE UPDATE ON skills 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
END $$;

-- 3.5. LEVEL_PROGRESSION
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'level_progression' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE level_progression ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE level_progression SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
    END IF;
    
    CREATE TRIGGER update_level_progression_updated_at 
        BEFORE UPDATE ON level_progression 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
END $$;

-- 3.6. USERS (garantir que tem trigger)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE users SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
    END IF;
    
    -- Recriar trigger mesmo que já exista (garantir que está correto)
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
END $$;

-- 3.7. ITEMS (garantir que tem trigger)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'items' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE items ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE items SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
    END IF;
    
    -- Recriar trigger mesmo que já exista (garantir que está correto)
    DROP TRIGGER IF EXISTS update_items_updated_at ON items;
    CREATE TRIGGER update_items_updated_at 
        BEFORE UPDATE ON items 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
END $$;

-- 3.8. JUTSUS (garantir que tem trigger)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'jutsus' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE jutsus ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        UPDATE jutsus SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
    END IF;
    
    -- Recriar trigger mesmo que já exista (garantir que está correto)
    DROP TRIGGER IF EXISTS update_jutsus_updated_at ON jutsus;
    CREATE TRIGGER update_jutsus_updated_at 
        BEFORE UPDATE ON jutsus 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
END $$;

-- PASSO 4: Verificação final
SELECT 
    t.table_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public'
            AND table_name = t.table_name 
            AND column_name = 'updated_at'
        ) THEN '✓'
        ELSE '✗'
    END as has_updated_at,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_trigger tr
            JOIN pg_class c ON tr.tgrelid = c.oid
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE tr.tgname LIKE 'update_' || t.table_name || '_updated_at'
            AND n.nspname = 'public'
            AND c.relname = t.table_name
        ) THEN '✓'
        ELSE '✗'
    END as has_trigger
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN ('users', 'clans', 'items', 'enhancements', 'defects', 'skills', 'level_progression', 'jutsus')
ORDER BY table_name;

-- Mensagem de sucesso
DO $$ 
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Triggers de updated_at configurados com sucesso!';
    RAISE NOTICE 'Agora você pode atualizar registros sem erros.';
    RAISE NOTICE '========================================';
END $$;

