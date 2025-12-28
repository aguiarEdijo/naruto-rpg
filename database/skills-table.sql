-- Script para criar a tabela skills (perícias) no sistema Naruto RPG
-- Execute este SQL no Supabase Dashboard

-- Remover tabela antiga se existir
DROP TABLE IF EXISTS skills CASCADE;

-- Criar a nova tabela
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    atributo_base TEXT NOT NULL CHECK (atributo_base IN ('FOR', 'VIG', 'AGI', 'INT', 'PER', 'ESS', 'INF')),
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_skills_atributo_base ON skills(atributo_base);
CREATE INDEX idx_skills_nome ON skills(nome);

-- Comentários para documentação
COMMENT ON TABLE skills IS 'Tabela que define as perícias disponíveis no sistema Naruto RPG';
COMMENT ON COLUMN skills.nome IS 'Nome da perícia';
COMMENT ON COLUMN skills.atributo_base IS 'Atributo base da perícia (FOR, VIG, AGI, INT, PER, ESS, INF)';
COMMENT ON COLUMN skills.descricao IS 'Descrição da perícia e como é utilizada';

-- Verificar se a tabela foi criada corretamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'skills' 
ORDER BY ordinal_position;


