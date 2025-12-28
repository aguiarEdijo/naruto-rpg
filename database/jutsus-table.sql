-- ============================================================
-- Script para criar a tabela de jutsus
-- Execute este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

-- Remover tabela antiga (se existir)
DROP TABLE IF EXISTS jutsus CASCADE;

-- Criar a tabela com estrutura completa
CREATE TABLE jutsus (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    tipo_jutsu TEXT NOT NULL CHECK (tipo_jutsu IN ('Ninjutsu', 'Taijutsu', 'Genjutsu')),
    subtipo TEXT,
    rank TEXT NOT NULL CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S')),
    custo_chakra TEXT NOT NULL, -- Pode ser número ou descrição complexa
    acao TEXT NOT NULL, -- Primária, Secundária, Movimento, Completa, Reação, Sustentável
    duracao TEXT NOT NULL, -- Instantânea, Sustentável, Sustentada, etc.
    restricao TEXT, -- Restrições ou pré-requisitos
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para consultas rápidas
CREATE INDEX idx_jutsus_nome ON jutsus(nome);
CREATE INDEX idx_jutsus_tipo_jutsu ON jutsus(tipo_jutsu);
CREATE INDEX idx_jutsus_rank ON jutsus(rank);
CREATE INDEX idx_jutsus_subtipo ON jutsus(subtipo);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_jutsus_updated_at 
    BEFORE UPDATE ON jutsus 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE jutsus IS 'Tabela que define os jutsus disponíveis no sistema Naruto RPG';
COMMENT ON COLUMN jutsus.nome IS 'Nome do jutsu';
COMMENT ON COLUMN jutsus.tipo_jutsu IS 'Tipo do jutsu (Ninjutsu, Taijutsu, Genjutsu)';
COMMENT ON COLUMN jutsus.subtipo IS 'Subtipo do jutsu (ex: Kekkei Genkai, Elemento, etc.)';
COMMENT ON COLUMN jutsus.rank IS 'Rank do jutsu (E, D, C, B, A, S)';
COMMENT ON COLUMN jutsus.custo_chakra IS 'Custo de chakra necessário (pode ser número ou descrição)';
COMMENT ON COLUMN jutsus.acao IS 'Tipo de ação necessária (Primária, Secundária, Movimento, Completa, Reação, Sustentável)';
COMMENT ON COLUMN jutsus.duracao IS 'Duração do efeito (Instantânea, Sustentável, Sustentada, etc.)';
COMMENT ON COLUMN jutsus.restricao IS 'Restrições ou pré-requisitos para usar o jutsu';
COMMENT ON COLUMN jutsus.descricao IS 'Descrição detalhada do jutsu e seus efeitos';

