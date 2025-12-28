-- SEED: Inserir dados de defeitos no sistema Naruto RPG
-- Execute este arquivo no Supabase Dashboard (SQL Editor)

-- Inserir todos os defeitos
INSERT INTO defects (nome, tipo, descricao) VALUES
(
    'REDUÇÃO DE ATRIBUTOS INICIAIS',
    'Mecânico',
    'Devido à simbiose única do Clã Aburame com os Kikaichuu, o corpo do personagem sofre um custo físico inerente, sendo menos robusto do que o normal. (Membros do Clã Aburame possuem Força e Vigor reduzidos no início).'
),
(
    'COMPULSIVO ALIMENTAR',
    'Compulsão',
    'O personagem (comum ao Clã Akimichi) não consegue passar muito tempo sem ceder a um desejo de comer. Esta ação pode vir a acontecer em meio de combates, exigindo que o personagem gaste tempo para executá-la. Se o personagem for privado de fazer sua compulsão, terá suas Emoções afetadas.'
),
(
    'PACTO DE SERVIDÃO',
    'Emocional/Obrigação',
    'Típico da Família Secundária Hyuuga. O personagem carrega um pacto que o vincula a um dever inquebrável, frequentemente marcado por um selo amaldiçoado ou um fuinjutsu de clã. Esta responsabilidade reduz sua capacidade máxima de Emoções, intensificando a pressão emocional. Qualquer desvio dessa missão impacta profundamente suas Emoções.'
),
(
    'ORGULHO EXACERBADO',
    'Emocional/Social',
    'Comum ao Clã Uchiha. O personagem não abaixa a cabeça para ninguém; seu ego é inflado a ponto de ter suas Emoções afetadas quando se sente rebaixado ou humilhado. O personagem que adquire este defeito, tem sua capacidade de Emoções reduzida.'
),
(
    'VULNERABILIDADE EMOCIONAL',
    'Emocional',
    'Comum ao Clã Inuzuka. Devido à profunda conexão espiritual e emocional com o Cão Shinobi, o personagem sofre uma grande vulnerabilidade. Cativar e, principalmente, perder um companheiro canino afeta drasticamente as Emoções do membro do clã.'
),
(
    'MISSÃO SHINOBI - LEALDADE INABALÁVEL',
    'Emocional/Obrigação',
    'Comum ao Clã Senju. O personagem possui um senso profundo de lealdade para com seus aliados, crenças e vilas. Este forte Dever afeta as suas Emoções se houver falha em cumprir esta lealdade ou se for confrontado com a traição.'
),
(
    'COMPULSÃO POR PROCRASTINAR (PREGUIÇA)',
    'Compulsão/Mental',
    'Comum ao Clã Nara. O personagem é avesso ao esforço desnecessário. Em situações de tensão (como combate), a compulsão por buscar o caminho mais fácil ou descansar exige que ele gaste tempo (Ações) para ''pensar'' ou ''procrastinar''. Suas Emoções são afetadas se for ativamente impedido de adiar a ação.'
),
(
    'SEGREDOS DO SELAMENTO / CAÇADO',
    'Obrigação/Emocional',
    'Comum ao Clã Uzumaki. Devido à sua herança de Fuinjutsu e segredos de selamento, o clã é alvo de perseguição de outras vilas ou organizações. Este ''Dever'' gera uma pressão constante que pode afetar suas Emoções em momentos de grande estresse ou quando um selo importante é rompido.'
),
(
    'ABERTURA PSÍQUICA (VULNERABILIDADE MENTAL)',
    'Mecânico/Mental',
    'Comum ao Clã Yamanaka. O foco extremo na mente e o uso constante de técnicas telepáticas tornam a consciência do personagem mais exposta. Ele recebe uma piora em testes de Resistência Mental (RM) contra ataques psíquicos diretos.'
),
(
    'HONESTIDADE',
    'Social',
    'O personagem é incapaz de mentir ou enganar intencionalmente, a menos que esteja sob extrema pressão emocional. Isso impõe uma piora em todas as perícias de Influência Social (como Blefar/Persuasão) quando a mentira está envolvida. Este defeito pode ser induzido pelo Elixir da Verdade.'
),
(
    'ARROGÂNCIA SOCIAL',
    'Social/Emocional',
    'O personagem tem dificuldade em respeitar ou levar a sério aqueles que considera inferiores. Recebe uma piora em testes de Influência e Persuasão ao interagir com personagens de status significativamente menor ou que ele despreza.'
),
(
    'FAMA INDESEJADA',
    'Social',
    'A aparência, reputação ou histórico do personagem o tornam facilmente reconhecível, mesmo sob disfarce. Ele recebe uma piora em testes de Furtividade e Disfarce em áreas populosas, pois a atenção social o destaca.'
),
(
    'IMPULSIVO',
    'Comportamental',
    'O personagem age antes de pensar, especialmente quando desafiado. Em situações de combate ou tensão social, ele deve superar um teste de controle para usar a manobra Adiar Ações ou para não atacar imediatamente a fonte de seu estresse.'
);

-- Verificar se os dados foram inseridos corretamente
SELECT 
    'Total de defeitos inseridos: ' || COUNT(*) as resultado
FROM defects;

-- Mostrar resumo por tipo
SELECT 
    tipo,
    COUNT(*) as total_defeitos,
    STRING_AGG(nome, ', ') as nomes
FROM defects 
GROUP BY tipo 
ORDER BY tipo;


