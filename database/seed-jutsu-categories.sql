-- ============================================================
-- Popular tabelas jutsu_categories e jutsu_category_ranks
-- Execute este script após criar as tabelas
-- ============================================================

-- Inserir categorias de jutsus
INSERT INTO jutsu_categories (id, name) VALUES
    ('ninjutsu', 'Ninjutsu'),
    ('barreiras', 'Barreiras'),
    ('sustentavel', 'Jutsu Sustentável'),
    ('taijutsu', 'Taijutsu'),
    ('estiloDeLuta', 'Estilo de Luta'),
    ('genjutsu', 'Genjutsu')
ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        updated_at = NOW();

-- ============================================================
-- Ranks para categoria: Ninjutsu
-- ============================================================
INSERT INTO jutsu_category_ranks (category_id, rank, custo, requisito, mult, efeito) VALUES
    ('ninjutsu', 'S', '10', 10, 'Nin x5', '7 Pe'),
    ('ninjutsu', 'A', '8', 8, 'Nin x4', '5 Pe'),
    ('ninjutsu', 'B', '6', 6, 'Nin x3', '4 Pe'),
    ('ninjutsu', 'C', '4', 4, 'Nin x2', '3 Pe'),
    ('ninjutsu', 'D', '2', 2, 'Nin x1', '2 Pe'),
    ('ninjutsu', 'E', '1', 1, NULL, '1 Pe')
ON CONFLICT (category_id, rank) DO UPDATE
    SET custo = EXCLUDED.custo,
        requisito = EXCLUDED.requisito,
        mult = EXCLUDED.mult,
        efeito = EXCLUDED.efeito,
        updated_at = NOW();

-- ============================================================
-- Ranks para categoria: Barreiras
-- ============================================================
INSERT INTO jutsu_category_ranks (category_id, rank, custo, requisito, mult, efeito) VALUES
    ('barreiras', 'S', '15', 10, 'Nin x6', '5 Pe'),
    ('barreiras', 'A', '10', 9, 'Nin x5', '4 Pe'),
    ('barreiras', 'B', '8', 7, 'Nin x4', '3 Pe'),
    ('barreiras', 'C', '6', 5, 'Nin x3', '2 Pe'),
    ('barreiras', 'D', NULL, NULL, NULL, '1 Pe'),
    ('barreiras', 'E', NULL, NULL, NULL, NULL)
ON CONFLICT (category_id, rank) DO UPDATE
    SET custo = EXCLUDED.custo,
        requisito = EXCLUDED.requisito,
        mult = EXCLUDED.mult,
        efeito = EXCLUDED.efeito,
        updated_at = NOW();

-- ============================================================
-- Ranks para categoria: Jutsu Sustentável
-- ============================================================
INSERT INTO jutsu_category_ranks (category_id, rank, custo, requisito, duracao, efeito) VALUES
    ('sustentavel', 'S', '4 + 3/turno', 10, '3x Res Turnos', '7 Pe'),
    ('sustentavel', 'A', '4 + 2/turno', 9, '2x Res Turnos', '5 Pe'),
    ('sustentavel', 'B', '2 + 2/turno', 7, '2x Res Turnos', '4 Pe'),
    ('sustentavel', 'C', '2 + 1/turno', 5, 'Res Turnos', '3 Pe'),
    ('sustentavel', 'D', '1/turno', 3, 'Res Turnos', '2 Pe'),
    ('sustentavel', 'E', NULL, NULL, NULL, '1 Pe')
ON CONFLICT (category_id, rank) DO UPDATE
    SET custo = EXCLUDED.custo,
        requisito = EXCLUDED.requisito,
        duracao = EXCLUDED.duracao,
        efeito = EXCLUDED.efeito,
        updated_at = NOW();

-- ============================================================
-- Ranks para categoria: Taijutsu
-- ============================================================
INSERT INTO jutsu_category_ranks (category_id, rank, custo, requisito, mult, efeito) VALUES
    ('taijutsu', 'S', '10', 10, 'Tai x5', '7 Pe'),
    ('taijutsu', 'A', '7', 8, 'Tai x4', '5 Pe'),
    ('taijutsu', 'B', '5', 6, 'Tai x3', '4 Pe'),
    ('taijutsu', 'C', '3', 4, 'Tai x2', '3 Pe'),
    ('taijutsu', 'D', '1', 2, 'Tai x1', '2 Pe'),
    ('taijutsu', 'E', '0', 1, NULL, '1 Pe')
ON CONFLICT (category_id, rank) DO UPDATE
    SET custo = EXCLUDED.custo,
        requisito = EXCLUDED.requisito,
        mult = EXCLUDED.mult,
        efeito = EXCLUDED.efeito,
        updated_at = NOW();

-- ============================================================
-- Ranks para categoria: Estilo de Luta
-- ============================================================
INSERT INTO jutsu_category_ranks (category_id, rank, custo, requisito, mult, efeito) VALUES
    ('estiloDeLuta', 'S', '2/turno', 10, 'Tai x1', '7 Pe'),
    ('estiloDeLuta', 'A', '1/turno', 9, 'Tai x1', '6 Pe'),
    ('estiloDeLuta', 'B', '1/turno', 7, 'Tai x1', '5 Pe'),
    ('estiloDeLuta', 'C', 'Res C*', 5, 'Tai x1', '4 Pe'),
    ('estiloDeLuta', 'D', 'Res C*', 3, 'Tai x1', '3 Pe'),
    ('estiloDeLuta', 'E', NULL, NULL, NULL, NULL)
ON CONFLICT (category_id, rank) DO UPDATE
    SET custo = EXCLUDED.custo,
        requisito = EXCLUDED.requisito,
        mult = EXCLUDED.mult,
        efeito = EXCLUDED.efeito,
        updated_at = NOW();

-- ============================================================
-- Ranks para categoria: Genjutsu
-- ============================================================
INSERT INTO jutsu_category_ranks (category_id, rank, custo, requisito, realidade, efeito) VALUES
    ('genjutsu', 'S', '10', 10, 7, '7 Pe'),
    ('genjutsu', 'A', '8', 9, 5, '6 Pe'),
    ('genjutsu', 'B', '6', 7, 4, '5 Pe'),
    ('genjutsu', 'C', '4', 5, 3, '4 Pe'),
    ('genjutsu', 'D', '2', 3, 2, '3 Pe'),
    ('genjutsu', 'E', '1', 2, 1, '2 Pe')
ON CONFLICT (category_id, rank) DO UPDATE
    SET custo = EXCLUDED.custo,
        requisito = EXCLUDED.requisito,
        realidade = EXCLUDED.realidade,
        efeito = EXCLUDED.efeito,
        updated_at = NOW();





