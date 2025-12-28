-- ============================================================
-- Script COMPLETO para criar e popular a tabela de faixas etárias
-- Execute TODO este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

-- 1. Remover tabela antiga (se existir)
DROP TABLE IF EXISTS age_ranges CASCADE;

-- 2. Criar a nova tabela com estrutura completa
CREATE TABLE age_ranges (
    id SERIAL PRIMARY KEY,
    faixa_etaria TEXT NOT NULL UNIQUE,
    idade_minima INT NOT NULL,
    idade_maxima INT,
    descricao TEXT NOT NULL,
    modificador_for INT NOT NULL DEFAULT 0,
    modificador_vig INT NOT NULL DEFAULT 0,
    modificador_agi INT NOT NULL DEFAULT 0,
    modificador_int INT NOT NULL DEFAULT 0,
    modificador_per INT NOT NULL DEFAULT 0,
    modificador_ess INT NOT NULL DEFAULT 0,
    modificador_inf INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices
CREATE INDEX idx_age_ranges_faixa_etaria ON age_ranges(faixa_etaria);
CREATE INDEX idx_age_ranges_idade_minima ON age_ranges(idade_minima);

-- 4. Comentários para documentação
COMMENT ON TABLE age_ranges IS 'Faixas etárias e seus modificadores de atributos';
COMMENT ON COLUMN age_ranges.idade_maxima IS 'NULL para idade ilimitada (idoso)';

-- 5. Inserir TODAS as faixas etárias
INSERT INTO age_ranges (faixa_etaria, idade_minima, idade_maxima, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf) VALUES

-- Criança (6-11 anos)
('Criança', 6, 11, 
'Personagens jovens que ainda não atingiram o auge do desenvolvimento físico. Nesta fase, a Força e o Vigor são naturalmente reduzidos.',
-1, -1, 0, 0, 0, 0, 0),

-- Jovem (12-17 anos)
('Jovem', 12, 17,
'A idade padrão para Genin iniciantes. Não há modificadores de atributos nesta fase.',
0, 0, 0, 0, 0, 0, 0),

-- Adulto (18-35 anos)
('Adulto', 18, 35,
'O período de auge físico e força máxima. A Força e o Vigor do personagem estão aumentados.',
1, 1, 0, 0, 0, 0, 0),

-- Maduro (36-50 anos)
('Maduro', 36, 50,
'A experiência e a sabedoria prevalecem. A Inteligência e a Percepção aumentam, mas a Agilidade começa a declinar.',
0, 0, -1, 1, 1, 0, 0),

-- Idoso (51+ anos)
('Idoso', 51, NULL,
'O corpo sofre o declínio físico da idade avançada, mas a experiência de vida e o conhecimento elevam a Inteligência e a Percepção a níveis muito superiores.',
-1, -1, -2, 2, 2, 0, 0);



