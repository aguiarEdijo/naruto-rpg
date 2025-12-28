-- ============================================================
-- Script para inserir jutsus iniciais
-- Execute este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

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

-- Verificar se os dados foram inseridos corretamente
SELECT 
    nome,
    tipo_jutsu,
    rank,
    custo_chakra,
    acao
FROM jutsus
ORDER BY rank, nome;

