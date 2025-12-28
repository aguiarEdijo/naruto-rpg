-- ============================================================
-- Script completo para criar e popular a tabela enhancements
-- Execute todo este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

-- 1. Remover tabela antiga (se existir)
DROP TABLE IF EXISTS enhancements CASCADE;

-- 2. Criar a nova tabela com estrutura completa
CREATE TABLE enhancements (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL,
    clan_restricao TEXT,
    rank_restricao TEXT,
    requisitos JSONB DEFAULT '[]',
    custo TEXT,
    acoes TEXT,
    duracao TEXT,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices
CREATE INDEX idx_enhancements_tipo ON enhancements(tipo);
CREATE INDEX idx_enhancements_clan_restricao ON enhancements(clan_restricao);
CREATE INDEX idx_enhancements_nome ON enhancements(nome);

-- 4. Inserir dados
INSERT INTO enhancements (nome, tipo, clan_restricao, rank_restricao, requisitos, custo, acoes, duracao, descricao) VALUES

-- APRIMORAMENTOS CLÃ ABURAME
('Kikaichuu', 'Clã', 'Aburame', 'Restrito: Níveis de Patamar', '[]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem possui uma afinidade natural e um chakra altamente palatável aos kikaichuu, o que concede uma melhoria em testes de controle de chakra. O número de enxames que um Aburame consegue controlar é diretamente ligado à sua perícia Ofício (Entomologista).'),
('Simbiose Inseto-Humano', 'Clã', 'Aburame', 'Genin', '[{"pericia": "Natureza", "valor": 5}, {"pericia": "Ofício (Entomologista)", "valor": 5}, {"aprimoramento": "Kikaichuu"}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Os membros do Clã Aburame mantêm uma relação simbiótica com insetos desde o nascimento. Esta ligação proporciona a eles um sentido especial, como se estivesse sob o efeito de Visão de Chakra, e uma melhoria em testes que utilizem o elemento inseto.'),
('Chakra Extra', 'Clã', 'Aburame', 'Chunnin+', '[{"atributo": "Essência", "valor": 7}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem tem um aumento no multiplicador de Chakra pelo Essência para cada nível de patamar, resultando em um volume de chakra significativamente maior.'),
('Aptidão Kikaichuu', 'Clã', 'Aburame', 'Genin', '[{"aprimoramento": "Kikaichuu"}, {"pericia": "Ofício (Entomologista)", "valor": 5}, {"pericia": "Ninjutsu", "valor": 5}, {"pericia": "Influência", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'N/A', 'O personagem tem acesso à lista de técnicas especializadas em manipulação de insetos, permitindo o uso avançado dessas habilidades em combate e espionagem.'),

-- APRIMORAMENTOS CLÃ AKIMICHI
('Corpo Resistente', 'Clã', 'Akimichi', 'Genin', '[{"clã_restricao": "Akimichi"}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'A composição corporal e a alta capacidade de adaptação dos membros do clã Akimichi os tornam resistentes a efeitos adversos. O personagem recebe um bônus em RF e uma redução na chance de sofrer efeitos colaterais de medicações.'),
('Metamorfose Corporal', 'Clã', 'Akimichi', 'Chunnin', '[{"aprimoramento": "Corpo Resistente"}, {"atributo": "Vigor", "valor": 8}]'::jsonb, 'Fadiga, Chakra', '1', 'VIG/2 em turnos', 'O personagem é capaz de consumir calorias armazenadas, convertendo-as em melhorias da sua habilidade físicas e amplificando seus atributos corporais. Concede melhoria em testes que envolvam Força e Vigor.'),
('Baika no Jutsu', 'Clã', 'Akimichi', 'Jounin', '[{"aprimoramento": "Metamorfose Corporal"}, {"pericia": "Taijutsu", "valor": 7}]'::jsonb, 'Fadiga e Chakra', '2', 'Sustentável (Custo de Chakra/Turno)', 'Técnica secreta que aumenta o tamanho do corpo do usuário através da conversão de calorias em chakra. O usuário pode alterar seu tamanho à vontade, contando como uma categoria de tamanho superior.'),
('Estilo Akimichi (Combate Corpóreo)', 'Clã', 'Akimichi', 'Genin', '[{"pericia": "Taijutsu", "valor": 5}, {"pericia": "Influência", "valor": 4}, {"atributo": "Força", "valor": 8}]'::jsonb, 'N/A', '1 (para adotar o Estilo)', 'Sempre Ativo', 'Ao adotar o Estilo Akimichi, o personagem ganha uma melhoria em manobras de ataque e atléticas, e um bônus no dano baseado em Força.'),
('Nikudan Sensha', 'Clã', 'Akimichi', 'Jounin', '[{"aprimoramento": "Estilo Akimichi (Combate Corpóreo)"}, {"aprimoramento": "Baika no Jutsu"}, {"pericia": "Taijutsu", "valor": 7}]'::jsonb, 'Chakra', '2', 'Instantânea', 'Um taijutsu ameaçador que converte o usuário em uma arma destrutiva rolando em alta velocidade. O ataque é impreciso, mas possui altíssimo potencial de dano.'),

-- APRIMORAMENTOS CLÃ HYUGA
('Sentido Especial - Byakugan', 'Clã', 'Hyuga', 'Chunnin+', '[{"atributo": "Essência", "valor": 8}]'::jsonb, 'Fadiga e Chakra por visão/turno', 'N/A', 'Sustentável', 'O Byakugan é a habilidade ocular exclusiva do Clã Hyuuga que concede visão extraordinária e percepção aprimorada. Inclui Detecção de Chakra, Visão de Águia, Visão Astral, Visão no Escuro e Visão Raio-X.'),
('Juuken (Punho Gentil)', 'Clã', 'Hyuga', 'Genin', '[{"pericia": "Natureza", "valor": 4}, {"aprimoramento": "Sentido Especial - Byakugan"}]'::jsonb, 'N/A', '1 (Para adotar o Estilo)', 'Sempre Ativo (em combate desarmado)', 'O Juuken é uma forma de combate refinada onde o usuário canaliza chakra para as pontas dos dedos, visando os tenketsus (pontos de chakra) do oponente.'),
('Hakke Hasangeki', 'Clã', 'Hyuga', 'Chunnin+', '[{"aprimoramento": "Sentido Especial - Byakugan"}, {"aprimoramento": "Juuken (Punho Gentil)"}]'::jsonb, 'Fadiga, Chakra', '2', 'Instantânea', 'Um ataque baseado em energia espiritual. O Hyuuga pode afetar espíritos, causando dano do tipo Espiritual, que não pode ser reduzido por proteções comuns.'),

-- APRIMORAMENTOS GERAIS
('Aceleração', 'Geral', 'Geral', 'Genin', '[{"atributo": "Agilidade", "valor": 4}]'::jsonb, '0', 'N/A', 'Sempre Ativo', 'Concede ao personagem uma extensão de movimento extra e a capacidade de dividir seu movimento durante uma ação de mover-se e atacar.'),
('Ambidestria', 'Geral', 'Geral', 'Restrito: Níveis de Patamar', '[]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem consegue usar bem as duas mãos, sem receber redutores nos testes com a mão inábil.'),
('Aparar Geral', 'Geral', 'Geral', 'Genin', '[{"pericia": "Técnica de Combate", "valor": 5}]'::jsonb, 'N/A', 'Reação', 'Sempre Ativo', 'Com este aprimoramento, o personagem é treinado para defender ataques utilizando sua perícia de combate.'),
('Concentração de Ferro', 'Geral', 'Geral', 'Genin', '[{"atributo": "Inteligência", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Os testes de Memória, Conjuração e de habilidades psíquicas têm melhoria. O personagem recebe um bônus em Resistência Mental (RM).');

-- 5. Verificar se os dados foram inseridos
SELECT 
    'Total de aprimoramentos: ' || COUNT(*) as resultado,
    'Tipos: ' || STRING_AGG(DISTINCT tipo, ', ') as tipos,
    'Clãs: ' || STRING_AGG(DISTINCT clan_restricao, ', ') FILTER (WHERE clan_restricao IS NOT NULL AND clan_restricao != 'Geral') as clãs
FROM enhancements;


