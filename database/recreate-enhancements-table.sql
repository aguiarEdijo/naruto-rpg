-- Script para recriar a tabela enhancements do zero
-- Execute este SQL no Supabase Dashboard

-- 1. Remover a tabela e dependências
DROP TABLE IF EXISTS enhancements CASCADE;

-- 2. Criar a nova tabela com estrutura completa
CREATE TABLE enhancements (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL,
    clan_restricao TEXT,
    rank_restricao TEXT,
    requisitos JSONB DEFAULT '[]',
    custo TEXT,
    acoes TEXT,
    duracao TEXT,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices
CREATE INDEX idx_enhancements_tipo ON enhancements(tipo);
CREATE INDEX idx_enhancements_clan_restricao ON enhancements(clan_restricao);
CREATE INDEX idx_enhancements_nome ON enhancements(nome);

-- 4. Comentários para documentação
COMMENT ON TABLE enhancements IS 'Tabela que define os aprimoramentos disponíveis no sistema Naruto RPG';
COMMENT ON COLUMN enhancements.id IS 'ID único do aprimoramento';
COMMENT ON COLUMN enhancements.nome IS 'Nome do aprimoramento';
COMMENT ON COLUMN enhancements.tipo IS 'Tipo/categoria (Clã ou Geral)';
COMMENT ON COLUMN enhancements.clan_restricao IS 'Nome do clã ou null/Geral';
COMMENT ON COLUMN enhancements.rank_restricao IS 'Patente/Nível mínima ou restrição por níveis de patamar';
COMMENT ON COLUMN enhancements.requisitos IS 'Lista de requisitos em formato JSON';
COMMENT ON COLUMN enhancements.custo IS 'Custo para ativar/manter (Fadiga, Chakra, etc)';
COMMENT ON COLUMN enhancements.acoes IS 'Custo de ações para executar';
COMMENT ON COLUMN enhancements.duracao IS 'Tempo de efeito';
COMMENT ON COLUMN enhancements.descricao IS 'Descrição narrativa e dos efeitos';
COMMENT ON COLUMN enhancements.created_at IS 'Timestamp de criação';

-- 5. Verificar se a tabela foi criada corretamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'enhancements' 
ORDER BY ordinal_position;


