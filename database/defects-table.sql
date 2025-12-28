-- Tabela de defeitos do sistema Naruto RPG
-- Esta tabela armazena as definições dos defeitos disponíveis

CREATE TABLE IF NOT EXISTS defects (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_defects_tipo ON defects(tipo);
CREATE INDEX IF NOT EXISTS idx_defects_nome ON defects(nome);

-- Comentários para documentação
COMMENT ON TABLE defects IS 'Tabela que define os defeitos disponíveis no sistema Naruto RPG';
COMMENT ON COLUMN defects.nome IS 'Nome do defeito';
COMMENT ON COLUMN defects.tipo IS 'Tipo/categoria do defeito (Mecânico, Compulsão, Emocional, etc.)';
COMMENT ON COLUMN defects.descricao IS 'Descrição detalhada do defeito e seus efeitos';


