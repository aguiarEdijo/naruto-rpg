# Configuração de Regras do Sistema

Este documento explica como executar a migração para criar as tabelas de regras do jogo no banco de dados Supabase.

## 📋 Pré-requisitos

1. Acesso ao painel do Supabase
2. Acesso ao SQL Editor do Supabase

## 🚀 Executando a Migração

### Método Recomendado: SQL Editor do Supabase

1. **Acesse o SQL Editor do Supabase Dashboard**
   - Vá para seu projeto no Supabase
   - Clique em "SQL Editor" no menu lateral

2. **Execute os scripts na ordem:**

   **Passo 1:** Criar tabelas
   - Abra o arquivo: `database/game-rules-tables.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Clique em "Run" ou pressione Ctrl+Enter

   **Passo 2:** Popular rank multipliers
   - Abra o arquivo: `database/seed-rank-multipliers.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Execute

   **Passo 3:** Popular regras de recursos
   - Abra o arquivo: `database/seed-resource-rules.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Execute

   **Passo 4:** Popular categorias de jutsus
   - Abra o arquivo: `database/seed-jutsu-categories.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Execute

   **Passo 5:** Popular efeitos de jutsus
   - Abra o arquivo: `database/seed-jutsu-effects.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Execute

   **Passo 6:** Popular dificuldades de resistência
   - Abra o arquivo: `database/seed-resistance-difficulties.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Execute

## ✅ Verificação

Após executar todos os scripts, você pode verificar se as tabelas foram criadas:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'rank_multipliers',
    'resource_calculation_rules',
    'jutsu_categories',
    'jutsu_category_ranks',
    'jutsu_effects',
    'resistance_difficulties'
);

-- Verificar dados inseridos
SELECT COUNT(*) FROM rank_multipliers;
SELECT COUNT(*) FROM resource_calculation_rules;
SELECT COUNT(*) FROM jutsu_categories;
SELECT COUNT(*) FROM jutsu_category_ranks;
SELECT COUNT(*) FROM jutsu_effects;
SELECT COUNT(*) FROM resistance_difficulties;
```

## 📝 Estrutura Criada

- **rank_multipliers**: Multiplicadores por rank de jutsu (E, D, C, B, A, S)
- **resource_calculation_rules**: Fórmulas de cálculo de vida, chakra, RM, RF
- **jutsu_categories**: Categorias de jutsus
- **jutsu_category_ranks**: Ranks dentro de cada categoria
- **jutsu_effects**: Efeitos disponíveis para jutsus
- **resistance_difficulties**: Dificuldades de RM/RF por rank

## 🔒 Segurança (RLS)

- Todas as tabelas têm Row Level Security habilitado
- **Leitura**: Todos os usuários autenticados podem ler
- **Escrita**: Apenas usuários com `is_gm = true` podem editar

## 🐛 Solução de Problemas

Se encontrar erros:

1. **Erro de função não encontrada**: A função `is_gm()` será criada pelo primeiro script
2. **Erro de política já existe**: Use `DROP POLICY IF EXISTS` antes de criar
3. **Erro de tabela já existe**: Os scripts usam `CREATE TABLE IF NOT EXISTS`, então são seguros de executar novamente

Para recriar tudo do zero:

```sql
-- CUIDADO: Isso apaga todas as regras!
DROP TABLE IF EXISTS resistance_difficulties CASCADE;
DROP TABLE IF EXISTS jutsu_effects CASCADE;
DROP TABLE IF EXISTS jutsu_category_ranks CASCADE;
DROP TABLE IF EXISTS jutsu_categories CASCADE;
DROP TABLE IF EXISTS resource_calculation_rules CASCADE;
DROP TABLE IF EXISTS rank_multipliers CASCADE;
```

Depois execute os scripts novamente.





