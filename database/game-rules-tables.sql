-- ============================================================
-- Criação das tabelas para regras do sistema Naruto RPG
-- Execute este script no Supabase Dashboard (SQL Editor)
-- ============================================================

-- 1. Tabela rank_multipliers
-- Armazena multiplicadores por rank de jutsu (E, D, C, B, A, S)
CREATE TABLE IF NOT EXISTS rank_multipliers (
    rank TEXT PRIMARY KEY CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S')),
    multiplier INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela resource_calculation_rules
-- Armazena regras de cálculo de recursos (vida, chakra, RM, RF)
CREATE TABLE IF NOT EXISTS resource_calculation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_type TEXT NOT NULL UNIQUE CHECK (rule_type IN ('health', 'chakra', 'physical_resistance', 'mental_resistance')),
    formula JSONB NOT NULL,
    rank_multipliers JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela jutsu_categories
-- Armazena categorias de jutsus
CREATE TABLE IF NOT EXISTS jutsu_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela jutsu_category_ranks
-- Armazena ranks dentro de cada categoria com seus valores
CREATE TABLE IF NOT EXISTS jutsu_category_ranks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT NOT NULL REFERENCES jutsu_categories(id) ON DELETE CASCADE,
    rank TEXT NOT NULL CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S')),
    custo TEXT,
    requisito INTEGER,
    mult TEXT,
    efeito TEXT,
    duracao TEXT,
    realidade INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, rank)
);

-- 5. Tabela jutsu_effects
-- Armazena efeitos disponíveis para jutsus
CREATE TABLE IF NOT EXISTS jutsu_effects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    custo INTEGER NOT NULL,
    requisito TEXT,
    descricao TEXT NOT NULL,
    categoria TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela resistance_difficulties
-- Armazena dificuldades de resistência (RM/RF) por rank de jutsu
CREATE TABLE IF NOT EXISTS resistance_difficulties (
    rank TEXT PRIMARY KEY CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S')),
    execucao INTEGER NOT NULL,
    rm_rf INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_jutsu_category_ranks_category_id ON jutsu_category_ranks(category_id);
CREATE INDEX IF NOT EXISTS idx_jutsu_category_ranks_rank ON jutsu_category_ranks(rank);
CREATE INDEX IF NOT EXISTS idx_jutsu_effects_name ON jutsu_effects(name);
CREATE INDEX IF NOT EXISTS idx_jutsu_effects_categoria ON jutsu_effects(categoria);
CREATE INDEX IF NOT EXISTS idx_resource_calculation_rules_rule_type ON resource_calculation_rules(rule_type);

-- Criar função para atualizar updated_at automaticamente (se ainda não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_rank_multipliers_updated_at 
    BEFORE UPDATE ON rank_multipliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_calculation_rules_updated_at 
    BEFORE UPDATE ON resource_calculation_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jutsu_categories_updated_at 
    BEFORE UPDATE ON jutsu_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jutsu_category_ranks_updated_at 
    BEFORE UPDATE ON jutsu_category_ranks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jutsu_effects_updated_at 
    BEFORE UPDATE ON jutsu_effects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resistance_difficulties_updated_at 
    BEFORE UPDATE ON resistance_difficulties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE rank_multipliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_calculation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE jutsu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE jutsu_category_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE jutsu_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resistance_difficulties ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Políticas RLS: Todos podem ler, apenas GMs podem editar
-- ============================================================

-- Função auxiliar para verificar se usuário é GM
CREATE OR REPLACE FUNCTION is_gm()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND is_gm = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para rank_multipliers
CREATE POLICY "Anyone can view rank_multipliers" ON rank_multipliers
    FOR SELECT USING (true);

CREATE POLICY "Only GMs can insert rank_multipliers" ON rank_multipliers
    FOR INSERT WITH CHECK (is_gm());

CREATE POLICY "Only GMs can update rank_multipliers" ON rank_multipliers
    FOR UPDATE USING (is_gm());

CREATE POLICY "Only GMs can delete rank_multipliers" ON rank_multipliers
    FOR DELETE USING (is_gm());

-- Políticas para resource_calculation_rules
CREATE POLICY "Anyone can view resource_calculation_rules" ON resource_calculation_rules
    FOR SELECT USING (true);

CREATE POLICY "Only GMs can insert resource_calculation_rules" ON resource_calculation_rules
    FOR INSERT WITH CHECK (is_gm());

CREATE POLICY "Only GMs can update resource_calculation_rules" ON resource_calculation_rules
    FOR UPDATE USING (is_gm());

CREATE POLICY "Only GMs can delete resource_calculation_rules" ON resource_calculation_rules
    FOR DELETE USING (is_gm());

-- Políticas para jutsu_categories
CREATE POLICY "Anyone can view jutsu_categories" ON jutsu_categories
    FOR SELECT USING (true);

CREATE POLICY "Only GMs can insert jutsu_categories" ON jutsu_categories
    FOR INSERT WITH CHECK (is_gm());

CREATE POLICY "Only GMs can update jutsu_categories" ON jutsu_categories
    FOR UPDATE USING (is_gm());

CREATE POLICY "Only GMs can delete jutsu_categories" ON jutsu_categories
    FOR DELETE USING (is_gm());

-- Políticas para jutsu_category_ranks
CREATE POLICY "Anyone can view jutsu_category_ranks" ON jutsu_category_ranks
    FOR SELECT USING (true);

CREATE POLICY "Only GMs can insert jutsu_category_ranks" ON jutsu_category_ranks
    FOR INSERT WITH CHECK (is_gm());

CREATE POLICY "Only GMs can update jutsu_category_ranks" ON jutsu_category_ranks
    FOR UPDATE USING (is_gm());

CREATE POLICY "Only GMs can delete jutsu_category_ranks" ON jutsu_category_ranks
    FOR DELETE USING (is_gm());

-- Políticas para jutsu_effects
CREATE POLICY "Anyone can view jutsu_effects" ON jutsu_effects
    FOR SELECT USING (true);

CREATE POLICY "Only GMs can insert jutsu_effects" ON jutsu_effects
    FOR INSERT WITH CHECK (is_gm());

CREATE POLICY "Only GMs can update jutsu_effects" ON jutsu_effects
    FOR UPDATE USING (is_gm());

CREATE POLICY "Only GMs can delete jutsu_effects" ON jutsu_effects
    FOR DELETE USING (is_gm());

-- Políticas para resistance_difficulties
CREATE POLICY "Anyone can view resistance_difficulties" ON resistance_difficulties
    FOR SELECT USING (true);

CREATE POLICY "Only GMs can insert resistance_difficulties" ON resistance_difficulties
    FOR INSERT WITH CHECK (is_gm());

CREATE POLICY "Only GMs can update resistance_difficulties" ON resistance_difficulties
    FOR UPDATE USING (is_gm());

CREATE POLICY "Only GMs can delete resistance_difficulties" ON resistance_difficulties
    FOR DELETE USING (is_gm());

-- Comentários para documentação
COMMENT ON TABLE rank_multipliers IS 'Multiplicadores por rank de jutsu (E, D, C, B, A, S)';
COMMENT ON TABLE resource_calculation_rules IS 'Regras de cálculo de recursos (vida, chakra, RM, RF)';
COMMENT ON TABLE jutsu_categories IS 'Categorias de jutsus (ninjutsu, barreiras, sustentavel, taijutsu, estiloDeLuta, genjutsu)';
COMMENT ON TABLE jutsu_category_ranks IS 'Ranks dentro de cada categoria de jutsu com seus valores';
COMMENT ON TABLE jutsu_effects IS 'Efeitos disponíveis para jutsus';
COMMENT ON TABLE resistance_difficulties IS 'Dificuldades de resistência (RM/RF) por rank de jutsu';





