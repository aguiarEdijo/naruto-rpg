-- ============================================================
-- Script para criar a tabela de faixas etárias
-- Execute este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

DROP TABLE IF EXISTS age_ranges CASCADE;

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

CREATE INDEX idx_age_ranges_faixa_etaria ON age_ranges(faixa_etaria);
CREATE INDEX idx_age_ranges_idade_minima ON age_ranges(idade_minima);

-- Comentários para documentação
COMMENT ON TABLE age_ranges IS 'Faixas etárias e seus modificadores de atributos';
COMMENT ON COLUMN age_ranges.idade_maxima IS 'NULL para idade ilimitada (idoso)';



