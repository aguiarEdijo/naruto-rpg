-- ============================================================
-- Popular tabela resource_calculation_rules com fórmulas de cálculo
-- Execute este script após criar as tabelas
-- ============================================================

-- Regra para cálculo de Vida
INSERT INTO resource_calculation_rules (rule_type, formula, rank_multipliers) VALUES
    ('health', 
     '{"base_attribute": "vigor", "multiplier_attribute": "vigor", "additional_attribute": "strength", "operation": "multiply_then_add"}',
     '{"Genin": 5, "Chunnin": 6, "Jounin": 7, "Hokage": 8}')
ON CONFLICT (rule_type) DO UPDATE
    SET formula = EXCLUDED.formula,
        rank_multipliers = EXCLUDED.rank_multipliers,
        updated_at = NOW();

-- Regra para cálculo de Chakra
INSERT INTO resource_calculation_rules (rule_type, formula, rank_multipliers) VALUES
    ('chakra',
     '{"base_attribute": "essence", "multiplier_attribute": "essence", "additional_attribute": "intelligence", "operation": "multiply_then_add"}',
     '{"Genin": 5, "Chunnin": 6, "Jounin": 7, "Hokage": 8}')
ON CONFLICT (rule_type) DO UPDATE
    SET formula = EXCLUDED.formula,
        rank_multipliers = EXCLUDED.rank_multipliers,
        updated_at = NOW();

-- Regra para cálculo de Resistência Mental (RM)
INSERT INTO resource_calculation_rules (rule_type, formula, rank_multipliers) VALUES
    ('mental_resistance',
     '{"attributes": ["intelligence", "essence", "perception"], "operation": "sum_then_divide", "divisor": 3}',
     '{}')
ON CONFLICT (rule_type) DO UPDATE
    SET formula = EXCLUDED.formula,
        rank_multipliers = EXCLUDED.rank_multipliers,
        updated_at = NOW();

-- Regra para cálculo de Resistência Física (RF)
INSERT INTO resource_calculation_rules (rule_type, formula, rank_multipliers) VALUES
    ('physical_resistance',
     '{"attributes": ["strength", "agility", "vigor"], "operation": "sum_then_divide", "divisor": 3}',
     '{}')
ON CONFLICT (rule_type) DO UPDATE
    SET formula = EXCLUDED.formula,
        rank_multipliers = EXCLUDED.rank_multipliers,
        updated_at = NOW();





