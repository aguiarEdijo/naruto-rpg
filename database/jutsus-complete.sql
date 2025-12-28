-- ============================================================
-- Script COMPLETO para criar e popular a tabela de jutsus
-- Execute TODO este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

-- 1. Criar a tabela
DROP TABLE IF EXISTS jutsus CASCADE;

CREATE TABLE jutsus (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    tipo_jutsu TEXT NOT NULL CHECK (tipo_jutsu IN ('Ninjutsu', 'Taijutsu', 'Genjutsu')),
    subtipo TEXT,
    rank TEXT NOT NULL CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S')),
    custo_chakra TEXT NOT NULL,
    acao TEXT NOT NULL,
    duracao TEXT NOT NULL,
    restricao TEXT,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices
CREATE INDEX idx_jutsus_nome ON jutsus(nome);
CREATE INDEX idx_jutsus_tipo_jutsu ON jutsus(tipo_jutsu);
CREATE INDEX idx_jutsus_rank ON jutsus(rank);
CREATE INDEX idx_jutsus_subtipo ON jutsus(subtipo);

-- 3. Criar trigger para updated_at
-- (Assumindo que a função update_updated_at_column já existe)
CREATE TRIGGER update_jutsus_updated_at 
    BEFORE UPDATE ON jutsus 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Inserir dados iniciais
INSERT INTO jutsus (nome, tipo_jutsu, subtipo, rank, custo_chakra, acao, duracao, restricao, descricao) VALUES
('Henge no Jutsu (Transformação)', 'Ninjutsu', NULL, 'E', '1', 'Secundária', 'Sustentável', NULL, 'Cria uma ilusão externa que altera a aparência do usuário, permitindo assumir a forma de objetos ou seres de tamanho semelhante. A técnica é cancelada imediatamente caso o usuário sofra dano ou utilize outra técnica simultaneamente.'),
('Bunshin no Jutsu (Duplicação)', 'Ninjutsu', NULL, 'E', '1 (Criação) ou 4 (Finta) [3]', 'Secundária (Criação)', 'Sustentada', NULL, 'Cria um ou mais clones ilusórios do usuário. As ações de cada clone devem ser definidas no início de cada turno. Eles são capazes de realizar apenas ações básicas e predefinidas, sendo destruídos ao sofrer dano ou interagir com qualquer técnica. Cada clone adicional aumenta a dificuldade do teste de conjuração em +1. Manter os clones requer uma ação sustentável.'),
('Kawarimi no Jutsu (Substituição de Corpo)', 'Ninjutsu', NULL, 'E', '2', 'Movimento (Uso) / Reação (Defesa)', 'Instantânea', NULL, 'Permite substituir um teste de Esquiva por um teste de Ninjutsu (com penalidade de -1 dado). O usuário troca de posição com um objeto inanimado da cena, podendo realizar um teste de Furtividade logo após a substituição para se ocultar.'),
('Shunshin no Jutsu (Movimentação Instantânea)', 'Ninjutsu', NULL, 'D', '1', 'Completa', 'Instantânea', NULL, 'O usuário se desloca em um movimento extremamente rápido e quase imperceptível. Pode percorrer até 6 vezes seu deslocamento normal, afastando-se da área de combate de forma indetectável.'),
('Kai (Liberação)', 'Genjutsu', NULL, 'D', 'Igual ao custo do Genjutsu cancelado [4]', 'Primária', 'Instantânea', NULL, 'O usuário desfaz as alterações em seu fluxo de chakra causadas por um Genjutsu. Para se libertar, deve realizar um teste de Percepção contra a dificuldade imposta pela ilusão. Pode também ser usado para libertar outros alvos em contato físico.')
ON CONFLICT (nome) DO UPDATE SET
    tipo_jutsu = EXCLUDED.tipo_jutsu,
    subtipo = EXCLUDED.subtipo,
    rank = EXCLUDED.rank,
    custo_chakra = EXCLUDED.custo_chakra,
    acao = EXCLUDED.acao,
    duracao = EXCLUDED.duracao,
    restricao = EXCLUDED.restricao,
    descricao = EXCLUDED.descricao,
    updated_at = NOW();

-- 5. Comentários para documentação
COMMENT ON TABLE jutsus IS 'Tabela que define os jutsus disponíveis no sistema Naruto RPG';
COMMENT ON COLUMN jutsus.nome IS 'Nome do jutsu';
COMMENT ON COLUMN jutsus.tipo_jutsu IS 'Tipo do jutsu (Ninjutsu, Taijutsu, Genjutsu)';
COMMENT ON COLUMN jutsus.subtipo IS 'Subtipo do jutsu (ex: Kekkei Genkai, Elemento, etc.)';
COMMENT ON COLUMN jutsus.rank IS 'Rank do jutsu (E, D, C, B, A, S)';
COMMENT ON COLUMN jutsus.custo_chakra IS 'Custo de chakra necessário (pode ser número ou descrição)';
COMMENT ON COLUMN jutsus.acao IS 'Tipo de ação necessária (Primária, Secundária, Movimento, Completa, Reação, Sustentável)';
COMMENT ON COLUMN jutsus.duracao IS 'Duração do efeito (Instantânea, Sustentável, Sustentada, etc.)';
COMMENT ON COLUMN jutsus.restricao IS 'Restrições ou pré-requisitos para usar o jutsu';
COMMENT ON COLUMN jutsus.descricao IS 'Descrição detalhada do jutsu e seus efeitos';

-- 6. Verificação final
SELECT 
    COUNT(*) as total_jutsus,
    COUNT(*) FILTER (WHERE tipo_jutsu = 'Ninjutsu') as ninjutsu_count,
    COUNT(*) FILTER (WHERE tipo_jutsu = 'Genjutsu') as genjutsu_count,
    COUNT(*) FILTER (WHERE tipo_jutsu = 'Taijutsu') as taijutsu_count
FROM jutsus;

