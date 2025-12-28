-- ============================================================
-- Popular tabela jutsu_effects com lista completa de efeitos
-- Execute este script após criar as tabelas
-- ============================================================

INSERT INTO jutsu_effects (name, custo, requisito, descricao, categoria) VALUES
    ('FA', 1, 'Acerto', 'Habilita cálculo de Força de Ataque (dano). Usa F ou P + Habilidade + Multiplicador.', NULL),
    ('FD', 2, NULL, 'Força de Defesa. Reduz ou evita dano usando Habilidade + Multiplicador.', NULL),
    ('FA+1', 2, 'Acerto', 'Aumenta em +1 o resultado final da Força de Ataque.', NULL),
    ('Ampliado', 1, NULL, 'Inclui um atributo adicional no cálculo de FA ou FD.', NULL),
    ('Reduzido', -1, NULL, 'Remove um atributo do cálculo de FA ou FD.', NULL),
    ('Resistente', 2, NULL, 'Dano recebido é reduzido pela metade antes da FD.', NULL),
    ('Guiado', 2, NULL, 'Oponente não pode usar esquiva comum.', NULL),
    ('Preciso', 1, NULL, 'Recebe +1 em testes de precisão.', NULL),
    ('Impreciso', -1, NULL, 'Sofre -1 em testes de precisão.', NULL),
    ('Invisível', 2, NULL, 'Contra alvos que não percebem o usuário, não há esquiva.', NULL),
    ('Veloz', 2, NULL, 'Rápido demais para ser esquivado normalmente.', NULL),
    ('Instantânea', 2, NULL, 'Não pode ser reagida; ignora ações de reação.', NULL),
    ('Perigoso', 1, NULL, 'Aumenta chance de crítico em +1.', NULL),
    ('Poderoso', 1, 'Crítico', 'Soma novamente o atributo primário ao dano ao obter crítico.', NULL),
    ('Penetrante', 1, 'Acerto', 'Ignora armadura do alvo.', NULL),
    ('Indefensável', 1, 'Acerto', 'Ignora Habilidade do alvo na FD.', NULL),
    ('Venenoso', 1, 'Dano', 'O alvo perde PV a cada turno.', NULL),
    ('Hemorragia', 1, 'Crítico', 'O alvo sangra e perde PV todo turno.', NULL),
    ('Fratura', 2, 'Crítico', 'Reduz -1 Habilidade do alvo de forma acumulativa.', NULL),
    ('Vorpal', 2, 'Crítico', 'Causa teste de Armadura para evitar desmembramento.', NULL),
    ('Irresistível', 2, 'Acerto', 'Não existe teste para resistir ao efeito.', NULL),
    ('Eficaz', 1, NULL, 'O oponente sofre -2 para evitar o jutsu.', NULL),
    ('Ineficaz', -1, NULL, 'O oponente recebe +2 para evitar o jutsu.', NULL),
    ('Espiritual', 1, 'Acerto', 'Causa 1 ponto de dano direto ao Chakra do alvo.', NULL),
    ('Paralisante', 1, 'Acerto', 'Imobiliza o alvo se falhar teste de Resistência.', NULL),
    ('Prender', 1, 'Acerto', 'Imobiliza o alvo se falhar teste de Força.', NULL),
    ('Amplo', 1, NULL, 'Pode atingir vários alvos.', NULL),
    ('Em Área', 2, NULL, 'Afeta todos os alvos dentro de uma área definida.', NULL),
    ('Dinâmico', 1, NULL, 'Pode escolher múltiplos alvos distintos.', NULL),
    ('Escalar', 1, NULL, 'Possui múltiplos níveis ou intensidades crescentes.', NULL),
    ('Ingrediente', -1, NULL, 'Exige um elemento ou condição ambiental.', NULL),
    ('Independente', 2, NULL, 'O jutsu se mantém sozinho após ser criado.', NULL),
    ('Permanente', -1, NULL, 'Não pode ser desfeito pelo usuário.', NULL),
    ('Protegido', 1, NULL, 'Só pode ser desfeito com um selo específico.', NULL),
    ('Controle', 2, NULL, 'Permite controlar o alvo.', NULL),
    ('Vital', -1, NULL, 'Possui custo de vida além do custo de chakra.', NULL),
    ('Inflar', 1, NULL, 'Permite ampliar efeitos pagando chakra extra.', NULL),
    ('Fraqueza', -1, NULL, 'Tem redutores ou punições em certas situações.', NULL),
    ('Arremesso', 2, 'Dano', 'Joga o alvo a uma distância baseada em Dano - Resistência.', NULL),
    ('Especial', 1, NULL, 'Efeito raro encontrado em jutsus específicos.', NULL),
    ('EspecialNegativo', -1, NULL, 'Defeito raro entre jutsus específicos.', NULL),
    ('Passos Largos', 1, NULL, 'Aumenta deslocamento em +5m.', 'Estilo de Luta'),
    ('Escorregadio', 1, NULL, '+1 Esquiva.', 'Estilo de Luta'),
    ('Ímpeto', 1, NULL, '+3 Iniciativa.', 'Estilo de Luta')
ON CONFLICT (name) DO UPDATE
    SET custo = EXCLUDED.custo,
        requisito = EXCLUDED.requisito,
        descricao = EXCLUDED.descricao,
        categoria = EXCLUDED.categoria,
        updated_at = NOW();





