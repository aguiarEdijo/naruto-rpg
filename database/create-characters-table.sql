-- Criação da tabela de personagens
-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    clan TEXT NOT NULL,
    age INTEGER NOT NULL DEFAULT 12,
    rank TEXT NOT NULL CHECK (rank IN ('Genin', 'Chunnin', 'Jounin', 'Hokage')),
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 20),
    available_attribute_points INTEGER NOT NULL DEFAULT 0,
    available_skill_points INTEGER NOT NULL DEFAULT 0,
    
    -- Atributos
    base_attributes JSONB NOT NULL,
    distributed_attributes JSONB NOT NULL,
    attribute_bonuses JSONB NOT NULL,
    
    -- Recursos
    resources JSONB NOT NULL,
    auxiliary JSONB NOT NULL,
    emotions INTEGER NOT NULL DEFAULT 5 CHECK (emotions >= 0 AND emotions <= 10),
    
    -- Perícias
    skills JSONB NOT NULL,
    skill_bonuses JSONB NOT NULL,
    
    -- Controle de edição
    is_editable BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraint: um personagem por usuário
    UNIQUE(user_id)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_created_at ON characters(created_at);

-- RLS (Row Level Security)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Política: usuários só podem ver/editar seus próprios personagens
CREATE POLICY "Users can view own characters"
    ON characters
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters"
    ON characters
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
    ON characters
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Comentários
COMMENT ON TABLE characters IS 'Tabela de personagens dos jogadores';
COMMENT ON COLUMN characters.base_attributes IS 'Atributos base do personagem';
COMMENT ON COLUMN characters.distributed_attributes IS 'Pontos distribuídos pelo jogador';
COMMENT ON COLUMN characters.resources IS 'Recursos (vida, chakra, fadiga, stress)';
COMMENT ON COLUMN characters.skills IS 'Perícias do personagem';


