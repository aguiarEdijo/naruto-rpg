-- ============================================================
-- Script COMPLETO para criar a tabela characters
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- 1. Criar a tabela characters
CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    clan TEXT NOT NULL,
    age INTEGER NOT NULL DEFAULT 12,
    rank TEXT NOT NULL CHECK (rank IN ('Genin', 'Chunnin', 'Jounin', 'Hokage')),
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 20),
    available_attribute_points INTEGER NOT NULL DEFAULT 0,
    available_skill_points INTEGER NOT NULL DEFAULT 0,
    
    -- Atributos (JSONB)
    base_attributes JSONB NOT NULL DEFAULT '{}',
    distributed_attributes JSONB NOT NULL DEFAULT '{}',
    attribute_bonuses JSONB NOT NULL DEFAULT '{}',
    
    -- Recursos (JSONB)
    resources JSONB NOT NULL DEFAULT '{}',
    auxiliary JSONB NOT NULL DEFAULT '{}',
    emotions INTEGER NOT NULL DEFAULT 8 CHECK (emotions >= 0 AND emotions <= 12),
    
    -- Perícias (JSONB)
    skills JSONB NOT NULL DEFAULT '{}',
    skill_bonuses JSONB NOT NULL DEFAULT '{}',
    
    -- Controle de edição
    is_editable BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_created_at ON characters(created_at);
CREATE INDEX IF NOT EXISTS idx_characters_clan ON characters(clan);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas se existirem (para evitar conflitos)
DROP POLICY IF EXISTS "Users can view own characters" ON characters;
DROP POLICY IF EXISTS "Users can view their own characters" ON characters;
DROP POLICY IF EXISTS "Users can insert own characters" ON characters;
DROP POLICY IF EXISTS "Users can insert their own characters" ON characters;
DROP POLICY IF EXISTS "Users can update own characters" ON characters;
DROP POLICY IF EXISTS "Users can update their own characters" ON characters;
DROP POLICY IF EXISTS "Users can delete their own characters" ON characters;
DROP POLICY IF EXISTS "GMs can view all characters" ON characters;
DROP POLICY IF EXISTS "GM can view all characters" ON characters;

-- 5. Criar políticas para SELECT (visualização)
-- Usuários podem ver suas próprias fichas
CREATE POLICY "Users can view their own characters"
    ON characters
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- GMs podem ver todas as fichas
CREATE POLICY "GMs can view all characters"
    ON characters
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_gm = true
        )
    );

-- 6. Criar políticas para INSERT (criação)
CREATE POLICY "Users can insert their own characters"
    ON characters
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 7. Criar políticas para UPDATE (atualização)
CREATE POLICY "Users can update their own characters"
    ON characters
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8. Criar políticas para DELETE (exclusão)
CREATE POLICY "Users can delete their own characters"
    ON characters
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 9. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
CREATE TRIGGER update_characters_updated_at 
    BEFORE UPDATE ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 11. Adicionar comentários
COMMENT ON TABLE characters IS 'Tabela de personagens dos jogadores';
COMMENT ON COLUMN characters.base_attributes IS 'Atributos base do personagem (JSONB)';
COMMENT ON COLUMN characters.distributed_attributes IS 'Pontos distribuídos pelo jogador (JSONB)';
COMMENT ON COLUMN characters.resources IS 'Recursos (vida, chakra, fadiga, stress) (JSONB)';
COMMENT ON COLUMN characters.skills IS 'Perícias do personagem (JSONB)';
COMMENT ON COLUMN characters.emotions IS 'Sistema de emoções (0-12)';

-- 12. Verificar se a tabela foi criada corretamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'characters'
ORDER BY ordinal_position;

-- 13. Verificar se RLS está habilitado
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'characters';

-- 14. Verificar políticas criadas
SELECT 
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'characters'
ORDER BY policyname;

