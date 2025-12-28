-- ============================================================
-- Script COMPLETO para criar e popular a tabela de clãs
-- Execute TODO este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

-- 1. Remover tabela antiga (se existir)
DROP TABLE IF EXISTS clans CASCADE;

-- 2. Criar a nova tabela com estrutura completa
CREATE TABLE clans (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    modificador_for INT NOT NULL DEFAULT 0,
    modificador_vig INT NOT NULL DEFAULT 0,
    modificador_agi INT NOT NULL DEFAULT 0,
    modificador_int INT NOT NULL DEFAULT 0,
    modificador_per INT NOT NULL DEFAULT 0,
    modificador_ess INT NOT NULL DEFAULT 0,
    modificador_inf INT NOT NULL DEFAULT 0,
    qualidade_inicial TEXT,
    defeitos_iniciais TEXT,
    bonus_iniciais TEXT,
    foco_atributos TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices
CREATE INDEX idx_clans_nome ON clans(nome);
CREATE INDEX idx_clans_qualidade_inicial ON clans(qualidade_inicial);

-- 4. Inserir TODOS os clãs

-- Clã Aburame
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, foco_atributos) VALUES
('Aburame', 
'O Clã Aburame é conhecido por sua ligação única e simbiótica com insetos, uma relação que remonta gerações. Eles utilizam seus enxames para ataques, espionagem e defesa. Os membros são facilmente identificáveis pela presença de insetos que vivem em seu corpo desde o nascimento, compartilhando habilidades sensoriais e usando os insetos como uma extensão de seu corpo.',
-1, -1, 0, 1, 1, 1, 0,
'Kikaichuu (restrito: níveis de patamar)',
'REDUÇÃO DE ATRIBUTOS INICIAIS',
'Percepção e Inteligência');

-- Clã Akimichi
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, foco_atributos) VALUES
('Akimichi',
'O Clã Akimichi é conhecido por suas habilidades em transformação corporal e por suas técnicas de aumento de massa, que ampliam sua força e resistência em combate. Eles são mestres em utilizar seu próprio corpo como uma arma, aumentando seu tamanho e força destrutiva e possuem alta capacidade de adaptação corporal.',
1, 1, 0, 0, 0, 0, 0,
'Corpo Resistente',
'COMPULSIVO ALIMENTAR',
'Força e Vigor');

-- Clã Hyuga
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, foco_atributos) VALUES
('Hyuga',
'O Clã Hyuuga é uma linhagem venerável conhecida pelo *Byakugan*, uma *kekkei genkai* que oferece visão penetrante, a capacidade de ver o fluxo de chakra e os pontos de pressão do corpo. O clã é dividido em ramificações principais e secundárias, sendo o ramo secundário marcado pelo *Pacto de Servidão*.',
0, 0, 1, 0, 0, 1, 0,
'Sentido Especial - Byakugan',
'PACTO DE SERVIDÃO (Família Secundária) OU COMPRA DA QUALIDADE FAMÍLIA NOBRE (Família Principal)',
'Essência e Agilidade');

-- Clã Inuzuka
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, foco_atributos) VALUES
('Inuzuka',
'O Clã Inuzuka é reconhecido por sua forte conexão e parceria especial com cães ninjas, desenvolvendo técnicas de combate que se baseiam na cooperação e na sincronização com seus companheiros caninos. Eles possuem sentidos aguçados e habilidades de rastreamento avançado, sendo úteis em missões de busca e captura.',
0, 0, 0, 0, 1, 0, 0,
'Sentido Especial - Faro Superior',
'VULNERABILIDADE EMOCIONAL',
'Percepção e Agilidade');

-- Clã Nara
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, foco_atributos) VALUES
('Nara',
'O Clã Nara é mestre em estratégia, conhecido por sua astúcia, inteligência e pela habilidade de manipular sombras (*Chakra Elemental - Yin*) para controlar o ambiente e os movimentos dos oponentes em batalha. Eles têm uma tradição de estrategistas habilidosos.',
0, 0, 0, 1, 0, 0, 1,
'Chakra Elemental - Yin',
'COMPULSÃO POR PROCRASTINAR (PREGUIÇA)',
'Inteligência e Influência');

-- Clã Senju
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, foco_atributos) VALUES
('Senju',
'O Clã Senju é uma das linhagens mais antigas, reconhecido por sua extraordinária habilidade em manipulação de chakra e sua conexão profunda com a natureza. São famosos por seu espírito indomável, habilidades de cura e por serem os fundadores de Konoha. Eles têm um senso profundo de lealdade para com seus aliados e crenças.',
0, 1, 0, 0, 0, 1, 0,
'Primeiro Clã',
'MISSÃO SHINOBI - LEALDADE INABALÁVEL',
'Vigor e Essência');

-- Clã Uchiha
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, foco_atributos) VALUES
('Uchiha',
'O Clã Uchiha é conhecido por seu talento excepcional em *ninjutsu* (especialmente *Katon* - Fogo) e pelo *Sharingan*, que permite prever movimentos, copiar técnicas e usar *Genjutsu*. Sua história é marcada por grande habilidade e tragédia, e são identificados por seus olhos distintivos.',
0, 0, 1, 1, 0, 0, 0,
'Chakra Elemental - Katon',
'ORGULHO EXACERBADO',
'Agilidade e Inteligência');

-- Clã Uzumaki
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, foco_atributos) VALUES
('Uzumaki',
'O Clã Uzumaki é conhecido por sua herança de força vital, longevidade e habilidades excepcionais em técnicas de selamento (*Fuinjutsu*). Eles são notórios por seus cabelos vermelhos distintivos e por possuírem uma quantidade incomum de chakra, o que lhes confere uma resistência física considerável.',
0, 1, 0, 0, 0, 1, 0,
'Chakra Extra',
'SEGREDOS DO SELAMENTO / CAÇADO',
'Essência e Vigor');

-- Clã Yamanaka
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, foco_atributos) VALUES
('Yamanaka',
'O Clã Yamanaka é reconhecido por suas habilidades sensoriais e suas técnicas de controle mental, concentrando-se no uso de jutsus que exploram a mente e os sentidos dos oponentes. Eles são valiosos em missões de vigilância e espionagem, possuindo a capacidade de ler mentes e realizar a projeção da própria consciência (*Shintenshin no Jutsu*).',
0, 0, 0, 1, 0, 0, 1,
'TELEPATIA (restrito: níveis de patamar)',
'ABERTURA PSÍQUICA (VULNERABILIDADE MENTAL)',
'Inteligência e Influência');

-- Templates Especiais

-- Sem Clã
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, bonus_iniciais, foco_atributos) VALUES
('Sem Clã',
'Representa um personagem sem uma linhagem ninja conhecida. Esta origem concede maior flexibilidade na criação e permite ao jogador distribuir mais recursos iniciais onde preferir.',
0, 0, 0, 0, 0, 0, 0,
'Flexibilidade na Criação',
'N/A',
'+2 pontos de atributo livres e +2 pontos de perícia extras',
'Livre Escolha');

-- Mutação
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf, qualidade_inicial, defeitos_iniciais, bonus_iniciais, foco_atributos) VALUES
('Mutação',
'Representa um personagem com características únicas, seja devido a experimentos, uma linhagem desconhecida, ou uma origem misteriosa. Essa origem confere um bônus de criação menor do que o Sem Clã, mas sugere um potencial de habilidades singulares.',
0, 0, 0, 0, 0, 0, 0,
'Características Únicas',
'N/A',
'+1 ponto de atributo livre e +1 ponto de perícia extra',
'Livre Escolha');



