-- Schema do banco de dados para Naruto RPG
-- Este arquivo documenta a estrutura completa das tabelas necessárias

-- Tabela de usuários (já existe)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    is_gm BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clãs (já existe)
CREATE TABLE IF NOT EXISTS clans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    modifiers JSONB DEFAULT '{}',
    special_ability TEXT
);

-- Tabela principal de personagens (já existe parcialmente)
CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    clan TEXT REFERENCES clans(id),
    age INTEGER NOT NULL,
    rank TEXT NOT NULL CHECK (rank IN ('Genin', 'Chunnin', 'Jounin', 'Hokage')),
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 20),
    
    -- Pontos disponíveis
    available_attribute_points INTEGER DEFAULT 0,
    available_skill_points INTEGER DEFAULT 0,
    
    -- Atributos (JSONB para flexibilidade)
    base_attributes JSONB NOT NULL DEFAULT '{}',
    distributed_attributes JSONB NOT NULL DEFAULT '{}',
    attribute_bonuses JSONB NOT NULL DEFAULT '{}',
    
    -- Recursos
    resources JSONB NOT NULL DEFAULT '{}',
    auxiliary JSONB NOT NULL DEFAULT '{}',
    emotions INTEGER DEFAULT 8 CHECK (emotions >= 0 AND emotions <= 10),
    
    -- Perícias fixas
    skills JSONB NOT NULL DEFAULT '{}',
    skill_bonuses JSONB NOT NULL DEFAULT '{}',
    
    -- Controle
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perícias customizadas
CREATE TABLE IF NOT EXISTS custom_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('combat', 'craft')),
    attribute1 TEXT NOT NULL CHECK (attribute1 IN ('strength', 'agility', 'vigor', 'intelligence', 'essence', 'perception')),
    attribute2 TEXT NOT NULL CHECK (attribute2 IN ('strength', 'agility', 'vigor', 'intelligence', 'essence', 'perception')),
    distributed INTEGER DEFAULT 0,
    bonus INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de jutsus
CREATE TABLE IF NOT EXISTS jutsus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Ninjutsu', 'Taijutsu', 'Genjutsu')),
    description TEXT,
    rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 5),
    chakra_cost INTEGER DEFAULT 0,
    damage INTEGER DEFAULT 0,
    effects TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    weight DECIMAL(5,2) DEFAULT 0 CHECK (weight >= 0),
    effects TEXT,
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de aprimoramentos disponíveis
CREATE TABLE IF NOT EXISTS enhancements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    effects TEXT DEFAULT '', -- String separada por ';' para converter para array
    requirements TEXT DEFAULT '{}', -- JSON string para converter para objeto
    clan TEXT REFERENCES clans(id),
    restricted TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de defeitos disponíveis
CREATE TABLE IF NOT EXISTS defects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    penalties TEXT DEFAULT '', -- String separada por ';' para converter para array
    restrictions TEXT DEFAULT '{}', -- JSON string para converter para objeto
    clan TEXT REFERENCES clans(id),
    restricted TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relacionamento personagem-aprimoramentos
CREATE TABLE IF NOT EXISTS character_enhancements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    enhancement_id UUID REFERENCES enhancements(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(character_id, enhancement_id)
);

-- Tabela de relacionamento personagem-defeitos
CREATE TABLE IF NOT EXISTS character_defects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(character_id, defect_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_skills_character_id ON custom_skills(character_id);
CREATE INDEX IF NOT EXISTS idx_jutsus_character_id ON jutsus(character_id);
CREATE INDEX IF NOT EXISTS idx_jutsus_type ON jutsus(type);
CREATE INDEX IF NOT EXISTS idx_items_character_id ON items(character_id);
CREATE INDEX IF NOT EXISTS idx_items_rarity ON items(rarity);
CREATE INDEX IF NOT EXISTS idx_character_enhancements_character_id ON character_enhancements(character_id);
CREATE INDEX IF NOT EXISTS idx_character_defects_character_id ON character_defects(character_id);

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_skills_updated_at BEFORE UPDATE ON custom_skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jutsus_updated_at BEFORE UPDATE ON jutsus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security) para segurança
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE jutsus ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_enhancements ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_defects ENABLE ROW LEVEL SECURITY;

-- Política: usuários só podem ver/editar seus próprios personagens
CREATE POLICY "Users can view their own characters" ON characters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own characters" ON characters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters" ON characters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters" ON characters
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas similares para tabelas relacionadas
CREATE POLICY "Users can manage custom skills of their characters" ON custom_skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM characters 
            WHERE characters.id = custom_skills.character_id 
            AND characters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage jutsus of their characters" ON jutsus
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM characters 
            WHERE characters.id = jutsus.character_id 
            AND characters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage items of their characters" ON items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM characters 
            WHERE characters.id = items.character_id 
            AND characters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage enhancements of their characters" ON character_enhancements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM characters 
            WHERE characters.id = character_enhancements.character_id 
            AND characters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage defects of their characters" ON character_defects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM characters 
            WHERE characters.id = character_defects.character_id 
            AND characters.user_id = auth.uid()
        )
    );
