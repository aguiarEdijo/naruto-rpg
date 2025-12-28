-- Script para inserir dados de evolução de níveis
-- Este script popula a tabela level_progression com os dados do sistema

INSERT INTO level_progression (level, rank, dice_evolution, attribute_points, skill_points, total_skill_gain) VALUES
(1, 'Genin', '2d6', '+1', '+1', 1),
(2, 'Genin', '2d6', '—', '+1', 1),
(3, 'Genin', '2d6', '+1', '+1', 1),
(4, 'Genin', '2d6', '—', '+1', 1),
(5, 'Chunnin', '1d8 + 1d6', '+1', '+1 (+2 Bônus)', 3),
(6, 'Chunnin', '1d8 + 1d6', '—', '+1', 1),
(7, 'Chunnin', '1d8 + 1d6', '+1', '+1', 1),
(8, 'Chunnin', '1d8 + 1d6', '—', '+1', 1),
(9, 'Chunnin', '2d8', '+1', '+1', 1),
(10, 'Jounin', '2d8', '—', '+1 (+2 Bônus)', 3),
(11, 'Jounin', '2d8', '+1', '+1', 1),
(12, 'Jounin', '2d8', '—', '+1', 1),
(13, 'Jounin', '1d10 + 1d8', '+1', '+1', 1),
(14, 'Jounin', '1d10 + 1d8', '—', '+1', 1),
(15, 'Hokage', '1d10 + 1d8', '+1', '+1 (+2 Bônus)', 3),
(16, 'Hokage', '1d10 + 1d8', '—', '+1', 1),
(17, 'Hokage', '2d10', '+1', '+1', 1),
(18, 'Hokage', '2d10', '—', '+1', 1),
(19, 'Hokage', '2d10', '+1', '+1', 1),
(20, 'Hokage', '2d10', '—', '+1', 1)
ON CONFLICT (level) DO UPDATE SET
    rank = EXCLUDED.rank,
    dice_evolution = EXCLUDED.dice_evolution,
    attribute_points = EXCLUDED.attribute_points,
    skill_points = EXCLUDED.skill_points,
    total_skill_gain = EXCLUDED.total_skill_gain;

-- Verificar se os dados foram inseridos corretamente
SELECT 
    level,
    rank,
    dice_evolution,
    attribute_points,
    skill_points,
    total_skill_gain
FROM level_progression 
ORDER BY level;


