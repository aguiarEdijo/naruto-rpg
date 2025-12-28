-- ============================================================
-- Script para popular a tabela de faixas etárias
-- Execute este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

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



