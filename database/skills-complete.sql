-- ============================================================
-- Script COMPLETO para criar e popular a tabela skills
-- Execute TODO este arquivo no Supabase Dashboard (SQL Editor)
-- ============================================================

-- 1. Remover tabela antiga (se existir)
DROP TABLE IF EXISTS skills CASCADE;

-- 2. Criar a nova tabela
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    atributo_base TEXT NOT NULL CHECK (atributo_base IN ('FOR', 'VIG', 'AGI', 'INT', 'PER', 'ESS', 'INF')),
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices
CREATE INDEX idx_skills_atributo_base ON skills(atributo_base);
CREATE INDEX idx_skills_nome ON skills(nome);

-- 4. Inserir PERÍCIAS DE COMBATE E CHAKRA
INSERT INTO skills (nome, atributo_base, descricao) VALUES
('Taijutsu (Estilos de Luta)', 'AGI', 'Medida da habilidade em combate desarmado e estilos de luta corpo a corpo que dependem de velocidade, reflexos e precisão. Aplicada em manobras de Atacar e em técnicas de combate desarmado, como os estilos Akimichi e Gijuu.'),
('Ninjutsu', 'INT', 'A capacidade de conjurar e controlar técnicas ninjas elementais ou transformacionais, como as técnicas Katon do Clã Uchiha e as técnicas de insetos do Clã Aburame. Reflete o raciocínio necessário para executar selos de mão e manipular formas de chakra.'),
('Genjutsu', 'PER', 'A habilidade de criar, manter ou identificar ilusões que afetam a mente do alvo. Clãs como o Uchiha são notórios nesta área. A resistência a ilusões é uma função da consciência e da percepção do ambiente.'),
('Controle de Chakra', 'ESS', 'A perícia fundamental para canalizar e manipular a energia espiritual de forma eficiente, crucial para o uso de todas as formas de jutsu e para aprimoramentos de clã. Esta habilidade é afetada por condições como infecção por Kikaichuu e é um requisito para as Aptidões Ninjutsu, Genjutsu e Taijutsu.'),

-- 5. Inserir PERÍCIAS FÍSICAS E DE MOVIMENTO
('Atléticas', 'VIG', 'A perícia que mede a resistência, o esforço físico e a capacidade de realizar ações exaustivas, como nadar, escalar e correr por longos períodos. É utilizada para se levantar rapidamente quando derrubado e é um componente do Estilo Akimichi.'),
('Furtividade', 'AGI', 'A capacidade de se mover sem ser notado, esconder-se em ambientes, e realizar movimentos silenciosos. Essencial para a manobra Ataque Furtivo. Um alto nível nesta perícia é reforçado por aprimoramentos como Leve como uma Pluma.'),

-- 6. Inserir PERÍCIAS MENTAIS E TÉCNICAS
('Ocultismo', 'INT', 'Conhecimento sobre magias, rituais, selamento (Fuuinjutsu) e artes arcanas. Utilizada por clãs especializados em segredos espirituais, como Nara, Uzumaki e Yamanaka.'),
('Natureza', 'ESS', 'A conexão e compreensão do personagem com o ambiente natural e a capacidade de dominar elementos. Usada em habilidades de cura (Prestar Primeiros Socorros), manipulação elemental, e para estabelecer laços com animais (Cão Shinobi do Clã Inuzuka). É um pré-requisito para Aptidão Elemental.'),
('Sensores/Rastreamento', 'PER', 'A capacidade de usar sentidos aprimorados para rastrear, detectar ameaças e notar detalhes. Utilizada para perceber a movimentação de criaturas Furtivas (como os Kikaichuu) e essencial para habilidades como Faro Superior (Inuzuka) e o Byakugan (Hyuga).'),
('Ofícios (Especializado)', 'INT', 'Habilidade manual e conhecimento técnico em áreas específicas, exigindo treinamento e especialização. Inclui subtipos como Medicina (para Primeiros Socorros), Entomologista (para Aburame) e Fuuinjutsu (Selamento) (para Uzumaki).'),

-- 7. Inserir PERÍCIAS SOCIAIS
('Sociedade', 'INF', 'A perícia social que mede a habilidade de etiqueta, conhecimento de costumes, e o acesso a círculos sociais importantes. Essencial para o aprimoramento Família Nobre e crucial para clãs que dependem de sua posição social (Senju, Uchiha, Nara).'),
('Persuasão', 'INF', 'A capacidade de convencer, negociar, seduzir ou ameaçar um alvo através da oratória e do carisma. Fundamental em situações de interrogatório e diplomacia.'),
('Performance', 'INF', 'A habilidade de atuar, fingir e se apresentar. Utilizada diretamente na manobra Distrair/Fintar em combate, visando deixar o oponente Confuso.'),
('Disfarce', 'INF', 'A habilidade de mudar a aparência física e o comportamento para se passar por outra pessoa ou ocultar a identidade. Crucial em missões de espionagem e infiltração. Sua eficácia é reduzida se o personagem tiver Fama Indesejada.');

-- 8. Verificar resultado
SELECT COUNT(*) as total_pericias FROM skills;

-- 9. Mostrar resumo por atributo
SELECT 
    atributo_base,
    COUNT(*) as total_pericias,
    STRING_AGG(nome, ', ') as nomes
FROM skills 
GROUP BY atributo_base
ORDER BY 
    CASE atributo_base 
        WHEN 'FOR' THEN 1 
        WHEN 'VIG' THEN 2 
        WHEN 'AGI' THEN 3 
        WHEN 'INT' THEN 4 
        WHEN 'PER' THEN 5 
        WHEN 'ESS' THEN 6 
        WHEN 'INF' THEN 7 
    END;
