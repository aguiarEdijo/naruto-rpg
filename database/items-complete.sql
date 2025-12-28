-- ====================================================================
-- TABELA DE ITENS - Naruto RPG
-- ====================================================================
-- Criar tabela de itens
CREATE TABLE IF NOT EXISTS public.items (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    preco TEXT NOT NULL,
    descricao TEXT,
    tempo_criacao TEXT,
    efeito_colateral TEXT,
    sistema_mecanico TEXT,
    duracao TEXT,
    detalhes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_items_nome ON public.items(nome);
CREATE INDEX IF NOT EXISTS idx_items_tipo ON public.items(tipo);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items
FOR EACH ROW EXECUTE FUNCTION update_items_updated_at();

-- Comentários
COMMENT ON TABLE public.items IS 'Tabela de itens do jogo (bebidas, medicações, equipamentos, etc)';
COMMENT ON COLUMN public.items.nome IS 'Nome do item';
COMMENT ON COLUMN public.items.tipo IS 'Tipo do item (Bebida Alcoólica, Medicação, Kit, etc)';
COMMENT ON COLUMN public.items.preco IS 'Preço do item em Ryou';
COMMENT ON COLUMN public.items.descricao IS 'Descrição detalhada do item';
COMMENT ON COLUMN public.items.tempo_criacao IS 'Tempo necessário para criar o item';
COMMENT ON COLUMN public.items.efeito_colateral IS 'Efeitos colaterais do item';
COMMENT ON COLUMN public.items.sistema_mecanico IS 'Efeitos mecânicos no sistema de jogo';
COMMENT ON COLUMN public.items.duracao IS 'Duração dos efeitos';
COMMENT ON COLUMN public.items.detalhes IS 'Detalhes adicionais do item';

-- ====================================================================
-- INSERIR ITENS
-- ====================================================================
-- Nota: Após executar esta parte, execute o script Node.js para inserir os itens



