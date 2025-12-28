-- Script para verificar e modificar a estrutura da tabela enhancements
-- Execute este SQL no Supabase Dashboard

-- 1. Primeiro, verificar a estrutura atual
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'enhancements' 
ORDER BY ordinal_position;

-- 2. Adicionar as novas colunas necessárias (se não existirem)
ALTER TABLE enhancements ADD COLUMN IF NOT EXISTS clan_restricao TEXT;
ALTER TABLE enhancements ADD COLUMN IF NOT EXISTS rank_restricao TEXT;
ALTER TABLE enhancements ADD COLUMN IF NOT EXISTS requisitos JSONB DEFAULT '[]';
ALTER TABLE enhancements ADD COLUMN IF NOT EXISTS custo TEXT;
ALTER TABLE enhancements ADD COLUMN IF NOT EXISTS acoes TEXT;
ALTER TABLE enhancements ADD COLUMN IF NOT EXISTS duracao TEXT;

-- 3. Verificar se existe a coluna 'tipo' e outros campos originais
DO $$
BEGIN
    -- Se não existir a coluna 'tipo', adicionar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'enhancements' AND column_name = 'tipo'
    ) THEN
        ALTER TABLE enhancements ADD COLUMN tipo TEXT;
    END IF;
    
    -- Se não existir a coluna 'name', adicionar (para migração de dados antigos)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'enhancements' AND column_name = 'name'
    ) THEN
        ALTER TABLE enhancements ADD COLUMN name TEXT;
    END IF;
    
    -- Se não existir a coluna 'description', adicionar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'enhancements' AND column_name = 'description'
    ) THEN
        ALTER TABLE enhancements ADD COLUMN description TEXT;
    END IF;
END $$;

-- 4. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_enhancements_tipo ON enhancements(tipo);
CREATE INDEX IF NOT EXISTS idx_enhancements_clan_restricao ON enhancements(clan_restricao);
CREATE INDEX IF NOT EXISTS idx_enhancements_nome ON enhancements(nome);

-- 5. Verificar a estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'enhancements' 
ORDER BY ordinal_position;

-- 6. Se houver dados antigos com colunas 'name' e 'description', migrar para 'nome' e 'descricao'
DO $$
BEGIN
    -- Migrar nome
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'enhancements' AND column_name = 'name'
    ) THEN
        UPDATE enhancements 
        SET nome = COALESCE(name, 'Sem nome') 
        WHERE nome IS NULL OR nome = '';
    END IF;
    
    -- Migrar descrição
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'enhancements' AND column_name = 'description'
    ) THEN
        UPDATE enhancements 
        SET descricao = COALESCE(description, 'Sem descrição') 
        WHERE descricao IS NULL OR descricao = '';
    END IF;
END $$;


