-- ============================================================
-- Script para criar a tabela de clãs
-- Execute este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

-- Remover tabela antiga (se existir)
DROP TABLE IF EXISTS clans CASCADE;

-- Criar a tabela com estrutura completa
CREATE TABLE clans (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    modificador_for INT NOT NULL DEFAULT 0,
    modificador_vig INT NOT NULL DEFAULT 0,
    modificador_agi INT NOT NULL DEFAULT 0,
    modificador_int INT NOT NULL DEFAULT 0,
    modificador_per INT NOT NULL DEFAULT 0,
    modificador_ess INT NOT NULL DEFAULT 0,
    modificador_inf INT NOT NULL DEFAULT 0,
    qualidade_inicial TEXT,
    defeitos_iniciais TEXT,
    bonus_iniciais TEXT,
    foco_atributos TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_clans_nome ON clans(nome);
CREATE INDEX idx_clans_qualidade_inicial ON clans(qualidade_inicial);

-- Comentários para documentação
COMMENT ON TABLE clans IS 'Tabela de clãs disponíveis para personagens';
COMMENT ON COLUMN clans.modificador_for IS 'Modificador de Força';
COMMENT ON COLUMN clans.modificador_vig IS 'Modificador de Vigor';
COMMENT ON COLUMN clans.modificador_agi IS 'Modificador de Agilidade';
COMMENT ON COLUMN clans.modificador_int IS 'Modificador de Inteligência';
COMMENT ON COLUMN clans.modificador_per IS 'Modificador de Percepção';
COMMENT ON COLUMN clans.modificador_ess IS 'Modificador de Essência';
COMMENT ON COLUMN clans.modificador_inf IS 'Modificador de Influência';



