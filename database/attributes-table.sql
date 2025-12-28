-- Tabela de atributos do sistema Naruto RPG
-- Esta tabela armazena as definições dos atributos principais

CREATE TABLE IF NOT EXISTS attributes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    abreviacao TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL CHECK (categoria IN ('Físico', 'Mental/Chakra', 'Social')),
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_attributes_categoria ON attributes(categoria);
CREATE INDEX IF NOT EXISTS idx_attributes_abreviacao ON attributes(abreviacao);

-- Comentários para documentação
COMMENT ON TABLE attributes IS 'Tabela que define os atributos principais do sistema Naruto RPG';
COMMENT ON COLUMN attributes.nome IS 'Nome completo do atributo';
COMMENT ON COLUMN attributes.abreviacao IS 'Abreviação do atributo (ex: FOR, VIG, AGI)';
COMMENT ON COLUMN attributes.categoria IS 'Categoria do atributo (Físico, Mental/Chakra, Social)';
COMMENT ON COLUMN attributes.descricao IS 'Descrição detalhada do atributo e seu uso';


