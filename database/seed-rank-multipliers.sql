-- ============================================================
-- Popular tabela rank_multipliers com dados iniciais
-- Execute este script após criar as tabelas
-- ============================================================

INSERT INTO rank_multipliers (rank, multiplier) VALUES
    ('E', 0),
    ('D', 1),
    ('C', 2),
    ('B', 3),
    ('A', 4),
    ('S', 5)
ON CONFLICT (rank) DO UPDATE
    SET multiplier = EXCLUDED.multiplier,
        updated_at = NOW();





