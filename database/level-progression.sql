-- Tabela de evolução de níveis do sistema Naruto RPG
-- Esta tabela armazena a estrutura de progressão por nível

CREATE TABLE IF NOT EXISTS level_progression (
    id SERIAL PRIMARY KEY,
    level INTEGER NOT NULL UNIQUE CHECK (level >= 1 AND level <= 20),
    rank TEXT NOT NULL CHECK (rank IN ('Genin', 'Chunnin', 'Jounin', 'Hokage')),
    dice_evolution TEXT NOT NULL,
    attribute_points TEXT NOT NULL, -- "+1" ou "—"
    skill_points TEXT NOT NULL, -- "+1" ou "+1 (+2 Bônus)"
    total_skill_gain INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para consultas rápidas por nível
CREATE INDEX IF NOT EXISTS idx_level_progression_level ON level_progression(level);

-- Índice para consultas por patente
CREATE INDEX IF NOT EXISTS idx_level_progression_rank ON level_progression(rank);

-- Comentários para documentação
COMMENT ON TABLE level_progression IS 'Tabela que define a progressão de níveis do sistema Naruto RPG';
COMMENT ON COLUMN level_progression.level IS 'Nível do personagem (1-20)';
COMMENT ON COLUMN level_progression.rank IS 'Patente ninja correspondente ao nível';
COMMENT ON COLUMN level_progression.dice_evolution IS 'Evolução dos dados para o nível';
COMMENT ON COLUMN level_progression.attribute_points IS 'Pontos de atributo ganhos no nível';
COMMENT ON COLUMN level_progression.skill_points IS 'Pontos de perícia ganhos no nível';
COMMENT ON COLUMN level_progression.total_skill_gain IS 'Total de pontos de perícia ganhos no nível';


