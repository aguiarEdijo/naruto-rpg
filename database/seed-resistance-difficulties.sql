-- ============================================================
-- Popular tabela resistance_difficulties com dificuldades de RM/RF por rank
-- Execute este script após criar as tabelas
-- ============================================================

INSERT INTO resistance_difficulties (rank, execucao, rm_rf) VALUES
    ('E', 8, 5),
    ('D', 9, 6),
    ('C', 11, 9),
    ('B', 13, 11),
    ('A', 15, 14),
    ('S', 17, 17)
ON CONFLICT (rank) DO UPDATE
    SET execucao = EXCLUDED.execucao,
        rm_rf = EXCLUDED.rm_rf,
        updated_at = NOW();





