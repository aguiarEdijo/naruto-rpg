# Configuração da Tabela de Clãs

Este documento fornece instruções para criar e popular a tabela de clãs no banco de dados Supabase.

## 📋 Pré-requisitos

1. Acesso ao Supabase Dashboard
2. Projeto configurado com `.env` contendo:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 🗄️ Estrutura da Tabela

A tabela `clans` armazena informações sobre os clãs disponíveis para os personagens:

### Colunas:
- `id` (SERIAL PRIMARY KEY)
- `nome` (TEXT NOT NULL UNIQUE)
- `descricao` (TEXT NOT NULL)
- `modificador_for` (INT NOT NULL DEFAULT 0)
- `modificador_vig` (INT NOT NULL DEFAULT 0)
- `modificador_agi` (INT NOT NULL DEFAULT 0)
- `modificador_int` (INT NOT NULL DEFAULT 0)
- `modificador_per` (INT NOT NULL DEFAULT 0)
- `modificador_ess` (INT NOT NULL DEFAULT 0)
- `modificador_inf` (INT NOT NULL DEFAULT 0)
- `qualidade_inicial` (TEXT)
- `defeitos_iniciais` (TEXT)
- `bonus_iniciais` (TEXT)
- `foco_atributos` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT NOW())

## 🚀 Instruções de Execução

### Passo 1: Criar a Tabela

Execute o arquivo `clans-table.sql` no Supabase SQL Editor:

```bash
# Copie e cole o conteúdo de database/clans-table.sql
# no Supabase Dashboard > SQL Editor
```

Este script:
- Remove a tabela existente (se houver)
- Cria a nova tabela com estrutura completa
- Cria índices para otimização
- Adiciona comentários de documentação

### Passo 2: Popular com Dados

Execute o arquivo `insert-clans.sql` no Supabase SQL Editor:

```bash
# Copie e cole o conteúdo de database/insert-clans.sql
# no Supabase Dashboard > SQL Editor
```

Este script insere:
- 9 clãs de Konoha (Uchiha, Hyuga, Nara, etc.)
- 2 templates especiais (Sem Clã, Mutação)

## 📊 Clãs Incluídos

### Clãs de Konoha:
1. **Aburame** - Simbiose com insetos
2. **Akimichi** - Expansão corporal e força física
3. **Hyuga** - Byakugan e técnicas de Taijutsu
4. **Inuzuka** - Parceria com cães ninjas
5. **Nara** - Manipulação de sombras e estratégia
6. **Senju** - Manipulação de chakra e conexão com a natureza
7. **Uchiha** - Sharingan e técnicas de fogo
8. **Uzumaki** - Vitalidade e técnicas de selamento
9. **Yamanaka** - Controle mental e telepatia

### Templates Especiais:
10. **Sem Clã** - +2 pontos de atributo e perícia extras
11. **Mutação** - +1 ponto de atributo e perícia extras

## ✅ Verificação

Após executar os scripts, verifique a tabela:

```sql
-- Contar total de clãs
SELECT COUNT(*) FROM clans;

-- Listar todos os clãs
SELECT nome, qualidade_inicial, foco_atributos FROM clans ORDER BY nome;

-- Ver modificadores de um clã específico
SELECT nome, modificador_for, modificador_vig, modificador_agi, modificador_int, modificador_per, modificador_ess, modificador_inf FROM clans WHERE nome = 'Uchiha';
```

## 🔗 Integração com o Código

A tabela é consumida através do hook `useClans`:

```typescript
import { useClans } from '@/lib/hooks/useClans';

const { clans, loading, getClanByName, getModificadores } = useClans();

// Obter modificadores de um clã
const modificadores = getModificadores('Uchiha');

// Obter informações de um clã
const clan = getClanByName('Hyuga');
```

## 📝 Notas

- Os modificadores são aplicados aos atributos base do personagem
- `qualidade_inicial` representa a habilidade especial do clã
- `defeitos_iniciais` são os defeitos obrigatórios para o clã
- `bonus_iniciais` são bônus especiais (apenas para Sem Clã e Mutação)
- `foco_atributos` indica quais atributos o clã prioriza

## 🛠️ Manutenção

Para adicionar novos clãs, execute:

```sql
INSERT INTO clans (nome, descricao, modificador_for, modificador_vig, ...) VALUES (...);
```

Para atualizar um clã existente:

```sql
UPDATE clans SET modificador_for = 1 WHERE nome = 'NovoCla';
```



