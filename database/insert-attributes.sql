-- Script para inserir dados de atributos
-- Este script popula a tabela attributes com os dados do sistema

INSERT INTO attributes (nome, abreviacao, categoria, descricao) VALUES
(
    'FORÇA',
    'FOR',
    'Físico',
    'Representa a capacidade de levantamento, músculos e poder destrutivo físico. Utilizada em ataques corpo a corpo e testes para superar obstáculos físicos (como esmagar algo ou levantar peso). Também é um fator crucial para determinar o dano base de armas corporais. A Força pode ser reduzida pela idade avançada e é um desafio para membros do Clã Aburame.'
),
(
    'VIGOR',
    'VIG',
    'Físico',
    'Mede a saúde, resistência à dor, ao cansaço e a vitalidade. É a base para a Resistência Física (RF), sendo essencial para suportar venenos, medicações e condições extremas como sufocamento. É um fator na recuperação de Vida e vitalidade. É um atributo forte nos Clãs Akimichi e Senju.'
),
(
    'AGILIDADE',
    'AGI',
    'Físico',
    'Governa a destreza manual, a velocidade, o equilíbrio e a coordenação motora. É fundamental para manobras defensivas como Esquivar, para se mover furtivamente, e para a movimentação em geral. É um atributo de foco para clãs que dependem de movimentos rápidos e precisos, como Uchiha e Hyuga.'
),
(
    'INTELIGÊNCIA',
    'INT',
    'Mental/Chakra',
    'Reflete o raciocínio lógico, a memória e a capacidade estratégica. É crucial para o planejamento tático, para o uso de técnicas de Ninjutsu e Genjutsu, e para resistir a manobras de distração. É a base para o controle de alcance de algumas habilidades sensoriais e telepáticas. É um foco central para clãs como Nara, Yamanaka, Uchiha e Aburame.'
),
(
    'PERCEPÇÃO',
    'PER',
    'Mental/Chakra',
    'Mede os sentidos aguçados e a consciência situacional, permitindo notar detalhes e reagir a perigos. É vital para o rastreamento (como o Faro Superior Inuzuka) e para a detecção de inimigos furtivos (incluindo os insetos Kikaichuu). É usada para determinar o alcance da Detecção de Chakra (Byakugan). A Percepção reduzida afeta a capacidade de concentração.'
),
(
    'ESSÊNCIA',
    'ESS',
    'Mental/Chakra',
    'Mede a força da alma, a energia espiritual e o fluxo de chakra do personagem. É fundamental para determinar o volume de Chakra e a eficácia de habilidades de linhagem sanguínea (como o Byakugan e Juuken). O dano causado à Essência (Dano Essencial) é recuperado lentamente, sublinhando sua importância.'
),
(
    'INFLUÊNCIA',
    'INF',
    'Social',
    'Governa a capacidade de comunicação social, carisma, liderança, persuasão, e a habilidade de atuar ou enganar. É o atributo central para a espionagem social, a coordenação de equipes e para manobras sociais em combate (como Distrair/Fintar). É um atributo de foco para Clãs que se baseiam em interação e manipulação mental (Nara e Yamanaka).'
)
ON CONFLICT (nome) DO UPDATE SET
    abreviacao = EXCLUDED.abreviacao,
    categoria = EXCLUDED.categoria,
    descricao = EXCLUDED.descricao;

-- Verificar se os dados foram inseridos corretamente
SELECT 
    nome,
    abreviacao,
    categoria,
    LEFT(descricao, 100) || '...' as descricao_preview
FROM attributes 
ORDER BY categoria, nome;


