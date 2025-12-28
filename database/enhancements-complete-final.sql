-- ============================================================
-- Script COMPLETO para criar e popular a tabela enhancements
-- Execute TODO este arquivo no Supabase Dashboard (SQL Editor)
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

-- 4. Inserir TODOS os aprimoramentos
INSERT INTO enhancements (nome, tipo, clan_restricao, rank_restricao, requisitos, custo, acoes, duracao, descricao) VALUES

-- ==================== CLÃ ABURAME ====================
('Kikaichuu', 'Clã', 'Aburame', 'Restrito: Níveis de Patamar', '[]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem possui uma afinidade natural e um chakra altamente palatável aos kikaichuu, o que concede uma melhoria em testes de controle de chakra. O número de enxames que um Aburame consegue controlar é diretamente ligado à sua perícia Ofício (Entomologista).'),
('Simbiose Inseto-Humano', 'Clã', 'Aburame', 'Genin', '[{"pericia": "Natureza", "valor": 5}, {"pericia": "Ofício (Entomologista)", "valor": 5}, {"aprimoramento": "Kikaichuu"}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Os membros do Clã Aburame mantêm uma relação simbiótica com insetos desde o nascimento. Esta ligação proporciona a eles um sentido especial, como se estivesse sob o efeito de Visão de Chakra, e uma melhoria em testes que utilizem o elemento inseto.'),
('Chakra Extra', 'Clã', 'Aburame', 'Chunnin+', '[{"atributo": "Essência", "valor": 7}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem tem um aumento no multiplicador de Chakra pelo Essência para cada nível de patamar, resultando em um volume de chakra significativamente maior.'),
('Aptidão Kikaichuu', 'Clã', 'Aburame', 'Genin', '[{"aprimoramento": "Kikaichuu"}, {"pericia": "Ofício (Entomologista)", "valor": 5}, {"pericia": "Ninjutsu", "valor": 5}, {"pericia": "Influência", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'N/A', 'O personagem tem acesso à lista de técnicas especializadas em manipulação de insetos, permitindo o uso avançado dessas habilidades em combate e espionagem.'),

-- ==================== CLÃ AKIMICHI ====================
('Corpo Resistente', 'Clã', 'Akimichi', 'Genin', '[{"clã_restricao": "Akimichi"}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'A composição corporal e a alta capacidade de adaptação dos membros do clã Akimichi os tornam resistentes a efeitos adversos. O personagem recebe um bônus em RF e uma redução na chance de sofrer efeitos colaterais de medicações.'),
('Metamorfose Corporal', 'Clã', 'Akimichi', 'Chunnin', '[{"aprimoramento": "Corpo Resistente"}, {"atributo": "Vigor", "valor": 8}]'::jsonb, 'Fadiga, Chakra', '1', 'VIG/2 em turnos', 'O personagem é capaz de consumir calorias armazenadas, convertendo-as em melhorias da sua habilidade físicas e amplificando seus atributos corporais. Concede melhoria em testes que envolvam Força e Vigor.'),
('Baika no Jutsu', 'Clã', 'Akimichi', 'Jounin', '[{"aprimoramento": "Metamorfose Corporal"}, {"pericia": "Taijutsu", "valor": 7}]'::jsonb, 'Fadiga e Chakra', '2', 'Sustentável (Custo de Chakra/Turno)', 'Técnica secreta que aumenta o tamanho do corpo do usuário através da conversão de calorias em chakra. O usuário pode alterar seu tamanho à vontade, contando como uma categoria de tamanho superior.'),
('Estilo Akimichi (Combate Corpóreo)', 'Clã', 'Akimichi', 'Genin', '[{"pericia": "Taijutsu", "valor": 5}, {"pericia": "Influência", "valor": 4}, {"atributo": "Força", "valor": 8}]'::jsonb, 'N/A', '1 (para adotar o Estilo)', 'Sempre Ativo', 'Ao adotar o Estilo Akimichi, o personagem ganha uma melhoria em manobras de ataque e atléticas, e um bônus no dano baseado em Força. Permite que combatentes desarmados utilizem suas armas corporais com dano base igual a Força.'),
('Nikudan Sensha', 'Clã', 'Akimichi', 'Jounin', '[{"aprimoramento": "Estilo Akimichi (Combate Corpóreo)"}, {"aprimoramento": "Baika no Jutsu"}, {"pericia": "Taijutsu", "valor": 7}]'::jsonb, 'Chakra', '2', 'Instantânea', 'Um taijutsu ameaçador que converte o usuário em uma arma destrutiva rolando em alta velocidade. O ataque é impreciso, mas possui altíssimo potencial de dano.'),

-- ==================== CLÃ HYUGA ====================
('Sentido Especial - Byakugan', 'Clã', 'Hyuga', 'Chunnin+', '[{"atributo": "Essência", "valor": 8}]'::jsonb, 'Fadiga e Chakra por visão/turno', 'N/A', 'Sustentável', 'O Byakugan é a habilidade ocular exclusiva do Clã Hyuuga que concede visão extraordinária e percepção aprimorada. Inclui a Detecção de Chakra, Visão de Águia, Visão Astral, Visão no Escuro e Visão Raio-X.'),
('Juuken (Punho Gentil)', 'Clã', 'Hyuga', 'Genin', '[{"pericia": "Natureza", "valor": 4}, {"aprimoramento": "Sentido Especial - Byakugan"}]'::jsonb, 'N/A', '1 (Para adotar o Estilo)', 'Sempre Ativo (em combate desarmado)', 'O Juuken é uma forma de combate refinada onde o usuário canaliza chakra para as pontas dos dedos, visando os tenketsus (pontos de chakra) do oponente. Concede melhoria em testes de combate contra oponentes dentro da área de ameaça.'),
('Hakke Hasangeki', 'Clã', 'Hyuga', 'Chunnin+', '[{"aprimoramento": "Sentido Especial - Byakugan"}, {"aprimoramento": "Juuken (Punho Gentil)"}]'::jsonb, 'Fadiga, Chakra', '2', 'Instantânea', 'Um ataque baseado em energia espiritual. O Hyuuga pode afetar espíritos, causando dano do tipo Espiritual, que não pode ser reduzido por proteções comuns.'),

-- ==================== CLÃ INUZUKA ====================
('Sentido Especial - Faro Superior', 'Clã', 'Inuzuka', 'Genin', '[]'::jsonb, '0', '1', 'Essência em minutos', 'O Inuzuka possui a capacidade de sentir odores característicos de seres e rastrear pelo cheiro (Faro Superior). Este sentido especial deve ser ativado/desativado por ação.'),
('Cão Shinobi', 'Clã', 'Inuzuka', 'Restrito: Níveis de Patamar', '[{"pericia": "Natureza", "valor": 6}]'::jsonb, 'N/A', 'N/A', 'Permanente', 'Os membros do Clã Inuzuka estabelecem uma ligação profunda, espiritual e emocional com um companheiro canino, que se torna seu parceiro de jornada. O vínculo é tão forte que cativar ou perder o companheiro afeta as Emoções do membro do clã.'),
('Forma Alternativa', 'Clã', 'Inuzuka', 'Restrito: Níveis de Patamar', '[{"aprimoramento": "Cão Shinobi"}]'::jsonb, 'Fadiga', '2', 'N/A', 'O personagem tem acesso a uma forma animal similar ao seu Cão Shinobi, dotada de Garras e Mordidas como Armas Naturais. Itens equipados são absorvidos durante a transformação e seus efeitos cessam até o retorno à forma original.'),
('Estilo Gijuu (Combate Bestial)', 'Clã', 'Inuzuka', 'Genin', '[{"pericia": "Taijutsu", "valor": 5}, {"pericia": "Atléticas", "valor": 5}, {"pericia": "Natureza", "valor": 5}]'::jsonb, 'N/A', '1 (Para adotar o Estilo)', 'Sempre Ativo', 'Neste estado, o personagem recebe melhoria em manobras de Atacar e um bônus de Força no dano. Quando utilizado em conjunto com a Forma Alternativa, os ataques têm uma melhoria adicional.'),
('Tsuga', 'Clã', 'Inuzuka', 'Chunnin+', '[{"aprimoramento": "Estilo Gijuu (Combate Bestial)"}]'::jsonb, 'Fadiga e Chakra', '2', 'Instantânea', 'Um Taijutsu de alta velocidade que usa um giro para aumentar a força e a capacidade de penetração do ataque. É capaz de atravessar rochas e causa dano penetrante.'),

-- ==================== CLÃ NARA ====================
('Chakra Elemental - Yin', 'Clã', 'Nara', 'Genin', '[]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem possui afinidade com o Chakra Elemental Yin, associado à mente e à espiritualidade. Concede um bônus de Focus em técnicas que envolvam manipulação de sombras.'),
('Aptidão Elemental - Segredo das Sombras', 'Clã', 'Nara', 'Genin', '[{"aprimoramento": "Chakra Elemental - Yin"}, {"pericia": "Ninjutsu", "valor": 5}, {"pericia": "Ocultismo", "valor": 5}, {"pericia": "Furtividade", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'N/A', 'O personagem tem acesso a uma lista de técnicas especializadas em manipulação de sombras, representando o domínio avançado dessas habilidades únicas.'),
('Estrategista Nato', 'Clã', 'Nara', 'Chunnin+', '[{"atributo": "Inteligência", "valor": 9}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Os Nara são conhecidos por sua habilidade estratégica excepcional e adaptabilidade. Este traço permite comprar aprimoramentos de Improvisação sem atender aos requisitos, mesmo fora dos níveis de origem.'),

-- ==================== CLÃ SENJU ====================
('Primeiro Clã', 'Clã', 'Senju', 'Genin', '[{"clã_restricao": "Senju"}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Os Senju são uma das linhagens mais antigas. Este aprimoramento reduz o custo de todos os jutsus do personagem para um rank menor, com um custo mínimo de 1º círculo.'),
('Vínculo com a Natureza', 'Clã', 'Senju', 'Chunnin+', '[{"atributo": "Essência", "valor": 7}, {"pericia": "Natureza", "valor": 6}, {"pericia": "Influência", "valor": 5}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Os Senju têm uma conexão inata com a natureza, o que lhes permite superar os limites convencionais de cura e controle de chakra. O personagem recebe um bônus em testes de controle de chakra e habilidades de cura.'),

-- ==================== CLÃ UCHIHA ====================
('Chakra Elemental - Katon', 'Clã', 'Uchiha', 'Genin', '[]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem possui uma ligação natural e a capacidade de utilizar o elemento Fogo (Katon), recebendo um bônus de Focus em técnicas Katon, que pode ser aumentado posteriormente.'),
('Aptidão Elemental - Katon', 'Clã', 'Uchiha', 'Genin', '[{"aprimoramento": "Chakra Elemental - Katon"}, {"pericia": "Ninjutsu", "valor": 6}, {"pericia": "Influência", "valor": 4}, {"pericia": "Natureza", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'N/A', 'O personagem tem acesso à lista de técnicas Katon (Fogo) da Vila Oculta da Folha, permitindo o uso eficiente dessas técnicas.'),
('Treinamento Precoce', 'Clã', 'Uchiha', 'Chunnin+', '[{"atributo": "Inteligência", "valor": 7}, {"pericia": "Ninjutsu", "valor": 5}, {"pericia": "Genjutsu", "valor": 5}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Devido ao talento inato e treinamento precoce, o personagem pode ultrapassar o limite de graduação das perícias Ninjutsu e Genjutsu (o que pode ser traduzido em +1 nível de perícia acima do limite normal).'),

-- ==================== CLÃ UZUMAKI ====================
('Pacto', 'Clã', 'Uzumaki', 'Restrito: Níveis de Patamar', '[{"atributo": "Essência", "valor": 7}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Tu és ligado, numa união inquebrável, a uma entidade transcendente ou criatura ancestral. Tua essência foi entregue em troca de poder e esta conexão confere-te dons extraordinários, entrelaçando teu destino ao do teu pactuado.'),
('Aptidão Fuuinjutsu', 'Clã', 'Uzumaki', 'Genin', '[{"pericia": "Ocultismo", "valor": 6}, {"pericia": "Ofícios (Fuuinjutsu)", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'N/A', 'Concede ao personagem um domínio especializado na complexa arte de selar e desbloquear chakra, objetos ou habilidades. Sua destreza no Fuuinjutsu possibilita a manipulação eficiente de pergaminhos e a criação de selos personalizados.'),

-- ==================== CLÃ YAMANAKA ====================
('MENTE ABUNDANTE', 'Clã', 'Yamanaka', 'Chunnin+', '[{"atributo": "Inteligência", "valor": 8}, {"aprimoramento": "Concentração de Ferro"}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Concede melhoria em testes relacionados a Inteligência e Resistência Mental (RM).'),
('TELEPATIA', 'Clã', 'Yamanaka', 'Restrito: Níveis de Patamar', '[{"pericia": "Resistência Mental", "valor": 4}]'::jsonb, '0 ou Fadiga', '1 (uma vez por turno)', 'Sustentável (RM x10 minutos)', 'O personagem pode se comunicar telepaticamente com um ser inteligente, ignorando barreiras de idiomas. É possível buscar informações na mente do alvo, que pode tentar resistir.'),
('SEISHIN KŌGEKI', 'Clã', 'Yamanaka', 'Genin', '[{"aprimoramento": "Telepatia"}, {"pericia": "Ocultismo", "valor": 5}]'::jsonb, '0 ou Fadiga', '1 (Reação)', 'Instantânea', 'Uma forte energia psíquica é emanada para o alvo, causando tontura e dor de cabeça. O dano é calculado pela diferença entre o teste de Resistência Mental do alvo e o teste de Inteligência do psiônico.'),
('TŌSHI CHŌKAKU', 'Clã', 'Yamanaka', 'Genin', '[{"aprimoramento": "Telepatia"}]'::jsonb, '0', '3', 'Sustentável (RM minutos)', 'O personagem tem a capacidade de ver através da visão do alvo e ouvir o que ele ouve. O alvo só pode tentar resistir se também for um psíquico.'),
('SHINTENSHIN NO JUTSU', 'Clã', 'Yamanaka', 'Chunnin+', '[{"aprimoramento": "Tōshi Chōkaku"}, {"pericia": "Ocultismo", "valor": 7}]'::jsonb, 'Fadiga, Chakra', '2', 'Instantânea (ou RM minutos fora de combate)', 'Este jutsu emana uma energia psíquica poderosa, permitindo ao usuário projetar sua mente e temporariamente possuir o corpo do alvo. Danos infligidos ao corpo possuído são refletidos no corpo do shinobi.'),

-- ==================== APRIMORAMENTOS GERAIS ====================
('Aceleração', 'Geral', 'Geral', 'Genin', '[{"atributo": "Agilidade", "valor": 4}]'::jsonb, '0', 'N/A', 'Sempre Ativo', 'Concede ao personagem uma extensão de movimento extra e a capacidade de dividir seu movimento durante uma ação de mover-se e atacar, permitindo atacar alvos diferentes dentro de um mesmo turno. Restrito a cargas normais e equipamentos não pesados.'),
('Ambidestria', 'Geral', 'Geral', 'Restrito: Níveis de Patamar', '[]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem consegue usar bem as duas mãos, sem receber redutores nos testes com a mão inábil.'),
('Aparar Geral', 'Geral', 'Geral', 'Genin', '[{"pericia": "Técnica de Combate", "valor": 5}]'::jsonb, 'N/A', 'Reação', 'Sempre Ativo', 'Com este aprimoramento, o personagem é treinado para defender ataques utilizando sua perícia de combate, não recebendo mais a redução de um dado por usar essa manobra contra categorias de ataque diferentes do seu foco principal.'),
('Concentração de Ferro', 'Geral', 'Geral', 'Genin', '[{"atributo": "Inteligência", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Os testes de Memória, Conjuração e de habilidades psíquicas têm melhoria. O personagem recebe um bônus em Resistência Mental (RM).'),
('Aptidão Elemental', 'Geral', 'Geral', 'Restrito: Níveis de Patamar', '[{"pericia": "Natureza", "valor": 5}]'::jsonb, 'N/A', 'N/A', 'N/A', 'O personagem tem acesso à lista de jutsus elementais do elemento escolhido (Fogo, Terra, Água ou Ar).'),
('Elo com Objeto Familiar', 'Geral', 'Geral', 'Genin', '[{"atributo": "Essência", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem tem um vínculo com um objeto específico, geralmente uma herança de família, que concede um bônus nos testes do personagem que o utilize. Se o objeto for destruído, o personagem sofre um trauma emocional.'),
('Chakra Elemental Secundário', 'Geral', 'Geral', 'Restrito: Níveis de Patamar', '[{"pericia": "Natureza", "valor": 8}]'::jsonb, 'N/A', 'N/A', 'N/A', 'O personagem tem acesso à lista de jutsus de um segundo elemento.'),
('Tolerância de Ferro', 'Geral', 'Geral', 'Genin', '[{"atributo": "Vigor", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem tem um bônus em RF e é capaz de suportar mais desgaste físico e cansaço do que o normal, recebendo um bônus de Fadiga para cada nível de patamar.'),
('Família Nobre', 'Geral', 'Geral', 'Restrito: Origem', '[{"pericia": "Influência", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem é de família nobre, o que lhe concede forte ajuda financeira e contatos na cidade natal. No entanto, ele deve cumprir os deveres e expectativas designadas por seus superiores.'),
('Leve como uma Pluma', 'Geral', 'Geral', 'Genin', '[{"atributo": "Agilidade", "valor": 5}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'Concede melhoria em testes de Furtividade e na manobra de Esquivar. O personagem não afunda em areia, neve ou terreno frágil/difícil. Não concede bônus se o personagem estiver carregando peso ou utilizando equipamento pesado.'),
('Prontidão', 'Geral', 'Geral', 'Genin', '[{"atributo": "Percepção", "valor": 4}, {"atributo": "Vigor", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem tenta se manter sempre alerta e mesmo quando surpreendido, sua esquiva natural é melhor do que o normal. Recebe melhoria em testes de Percepção e pode refazer um teste de Percepção que não tenha tido um bom resultado.'),
('Recuperação Aprimorada', 'Geral', 'Geral', 'Genin', '[{"atributo": "Essência", "valor": 4}, {"atributo": "Vigor", "valor": 4}]'::jsonb, 'N/A', 'N/A', 'Sempre Ativo', 'O personagem recupera mais Vida quando recebe efeitos de cura e pode dormir vestindo seus equipamentos de combate, recuperando normalmente seu descanso. Ao descansar em locais precários, recupera mais Vida e Mana do que o normal.'),
('Vontade do Fogo', 'Geral', 'Geral', 'Genin', '[]'::jsonb, 'Fadiga', '0', 'Todo o Combate', 'Durante um combate, o personagem pode ativar este aprimoramento, recebendo um bônus de moral em Atacar, Bloquear, Aparar e Resistência Física.'),
('Aptidão Ninjutsu', 'Geral', 'Geral', 'Genin', '[{"pericia": "Controle de Chakra", "valor": 5}]'::jsonb, 'N/A', 'N/A', 'N/A', 'O personagem tem acesso à lista de Ninjutsus de uma vila oculta.'),
('Aptidão Genjutsu', 'Geral', 'Geral', 'Genin', '[{"pericia": "Controle de Chakra", "valor": 5}]'::jsonb, 'N/A', 'N/A', 'N/A', 'O personagem tem acesso à lista de Genjutsus de uma vila oculta.'),
('Aptidão Taijutsu', 'Geral', 'Geral', 'Genin', '[{"pericia": "Controle de Chakra", "valor": 5}]'::jsonb, 'N/A', 'N/A', 'N/A', 'O personagem tem acesso à lista de Taijutsus de uma vila oculta.');

-- 5. Verificar se os dados foram inseridos
SELECT 
    'Total de aprimoramentos: ' || COUNT(*) as resultado
FROM enhancements;

-- 6. Mostrar resumo por tipo e clã
SELECT 
    tipo,
    clan_restricao,
    COUNT(*) as total
FROM enhancements 
GROUP BY tipo, clan_restricao
ORDER BY tipo, clan_restricao;


